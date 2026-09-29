/**
 * Post-build prerender + SEO asset emission.
 *
 * Why a headless snapshot rather than renderToString: this app's render path
 * touches `window` (useStageMode, Sculpture) and pulls in three.js, drei,
 * postprocessing and anime.js. A Puppeteer snapshot needs zero SSR-safety
 * auditing of any of that — it just runs the real app in a real browser and
 * captures what a crawler should have seen.
 *
 * The `?static=1` flag forces useStageMode -> false and
 * usePrefersReducedMotion -> true, which is exactly the plain scrolling
 * document with every section visible at rest.
 *
 * Runs after `vite build`. Emits into dist/:
 *   index.html  (with prerendered #root + JSON-LD)
 *   llms.txt, robots.txt, sitemap.xml
 */

import { createServer } from 'node:http'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join, extname } from 'node:path'
import {
  readOffer,
  readOfferEn,
  buildHreflang,
  buildJsonLd,
  buildLlmsTxt,
  buildRobots,
  buildSitemap,
} from './seo-data.mjs'
import { ANSWERS, renderAnswerPage } from './answers.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const DIST = resolve(ROOT, 'dist')
const PORT = 4187

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
}

function serveDist() {
  return createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
    let filePath = join(DIST, urlPath === '/' ? 'index.html' : urlPath)
    if (!filePath.startsWith(DIST)) {
      res.writeHead(403).end()
      return
    }
    if (!existsSync(filePath)) filePath = join(DIST, 'index.html')
    try {
      const body = readFileSync(filePath)
      res.writeHead(200, {
        'Content-Type': MIME[extname(filePath)] || 'application/octet-stream',
      })
      res.end(body)
    } catch {
      res.writeHead(404).end()
    }
  })
}

async function main() {
  const offer = readOffer()

  // ---- static SEO/GEO assets (no browser needed) -------------------------
  const lastmod = new Date().toISOString().slice(0, 10)
  writeFileSync(resolve(DIST, 'llms.txt'), buildLlmsTxt(offer, ANSWERS))
  writeFileSync(resolve(DIST, 'robots.txt'), buildRobots())
  writeFileSync(
    resolve(DIST, 'sitemap.xml'),
    buildSitemap(lastmod, ANSWERS.map((a) => a.slug)),
  )
  console.log('  ✓ llms.txt, robots.txt, sitemap.xml')

  // ---- citable answer pages (static, self-contained) ---------------------
  for (const a of ANSWERS) {
    const dir = resolve(DIST, a.slug)
    mkdirSync(dir, { recursive: true })
    writeFileSync(resolve(dir, 'index.html'), renderAnswerPage(a, offer))
  }
  console.log(`  ✓ ${ANSWERS.length} answer pages (${ANSWERS.map((a) => `/${a.slug}/`).join(', ')})`)

  // ---- per-locale head rewrite ------------------------------------------
  const offerEn = readOfferEn()
  const hreflang = buildHreflang()

  const indexPath = resolve(DIST, 'index.html')
  const baseHtml = readFileSync(indexPath, 'utf8')

  const ld = (o, lang) =>
    `<script type="application/ld+json">${JSON.stringify(buildJsonLd(o, { lang }))}</script>`

  // Spanish: inject JSON-LD + hreflang into the shipped head.
  let esHtml = baseHtml
    .replace('<!-- BUILD-INJECTED-JSONLD -->', `${hreflang}\n    ${ld(offer, 'es')}`)

  /**
   * English: same document, translated head. The <head> is authored in Spanish
   * for the default locale, so every locale-bearing tag is rewritten rather
   * than duplicated — one template, two outputs.
   */
  const enTitle = 'Michelangelo Devs. AI agents that answer, qualify and close'
  const enDesc =
    "Michelangelo Devs is an AI agents agency that builds production sales agents for WhatsApp, Instagram and web, live in less than two weeks. OpenAI Select Partner. Message us on WhatsApp."
  let enHtml = baseHtml
    .replace('<html lang="es"', '<html lang="en"')
    .replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${enTitle}</title>`,
    )
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${enDesc}" />`,
    )
    .replace(
      '<link rel="canonical" href="https://www.michelangelodevs.com/" />',
      '<link rel="canonical" href="https://www.michelangelodevs.com/en/" />',
    )
    .replace('content="es_VE"', 'content="en_US"')
    .replace('<meta property="og:locale:alternate" content="en_US" />', '<meta property="og:locale:alternate" content="es_VE" />')
    .replace(
      '<meta property="og:url" content="https://www.michelangelodevs.com/" />',
      '<meta property="og:url" content="https://www.michelangelodevs.com/en/" />',
    )
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${enTitle}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${enTitle}$2`)
    .replace('<!-- BUILD-INJECTED-JSONLD -->', `${hreflang}\n    ${ld(offerEn, 'en')}`)

  // Absolute asset paths so /en/index.html resolves the same bundle as /.
  enHtml = enHtml.replace(/(src|href)="\.\//g, '$1="/')

  writeFileSync(indexPath, esHtml)
  const enDir = resolve(DIST, 'en')
  mkdirSync(enDir, { recursive: true })
  writeFileSync(resolve(enDir, 'index.html'), enHtml)
  console.log('  ✓ JSON-LD @graph + hreflang injected (es, en)')

  // ---- prerender ---------------------------------------------------------
  let puppeteer
  try {
    puppeteer = (await import('puppeteer')).default
  } catch {
    console.warn(
      '  ! puppeteer not installed — skipping HTML prerender.\n' +
        '    Run `npm i -D puppeteer` to enable it. JSON-LD and llms.txt still shipped.',
    )
    return
  }

  const server = serveDist()
  await new Promise((r) => server.listen(PORT, r))

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })
  try {
    // One snapshot per locale. `?lang=` drives the content bundle; `?static=1`
    // forces the plain at-rest document.
    for (const { lang, file } of [
      { lang: 'es', file: indexPath },
      { lang: 'en', file: resolve(enDir, 'index.html') },
    ]) {
      const page = await browser.newPage()
      await page.setViewport({ width: 1440, height: 1200 })
      await page.goto(`http://localhost:${PORT}/?static=1&lang=${lang}`, {
        waitUntil: 'networkidle0',
        timeout: 60_000,
      })
      await page.waitForFunction(
        () => (document.querySelector('#root')?.textContent || '').length > 500,
        { timeout: 20_000 },
      )

      const rendered = await page.$eval('#root', (el) => el.innerHTML)
      const doc = readFileSync(file, 'utf8').replace(
        '<div id="root"></div>',
        `<div id="root">${rendered}</div>`,
      )
      writeFileSync(file, doc)
      console.log(
        `  ✓ prerendered ${lang} #root (${(rendered.length / 1024).toFixed(1)} KB of markup)`,
      )
      await page.close()
    }
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch((err) => {
  console.error('prerender failed:', err)
  process.exit(1)
})
