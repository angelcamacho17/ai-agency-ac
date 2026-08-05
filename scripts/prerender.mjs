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
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join, extname } from 'node:path'
import {
  readOffer,
  buildJsonLd,
  buildLlmsTxt,
  buildRobots,
  buildSitemap,
} from './seo-data.mjs'

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
  writeFileSync(resolve(DIST, 'llms.txt'), buildLlmsTxt(offer))
  writeFileSync(resolve(DIST, 'robots.txt'), buildRobots())
  writeFileSync(resolve(DIST, 'sitemap.xml'), buildSitemap(lastmod))
  console.log('  ✓ llms.txt, robots.txt, sitemap.xml')

  // ---- JSON-LD -----------------------------------------------------------
  const jsonLd = buildJsonLd(offer)
  const ldScript = `<script type="application/ld+json">${JSON.stringify(
    jsonLd,
  )}</script>`

  const indexPath = resolve(DIST, 'index.html')
  let html = readFileSync(indexPath, 'utf8')
  html = html.replace('<!-- BUILD-INJECTED-JSONLD -->', ldScript)
  console.log('  ✓ JSON-LD @graph injected')

  // ---- prerender ---------------------------------------------------------
  let puppeteer
  try {
    puppeteer = (await import('puppeteer')).default
  } catch {
    console.warn(
      '  ! puppeteer not installed — skipping HTML prerender.\n' +
        '    Run `npm i -D puppeteer` to enable it. JSON-LD and llms.txt still shipped.',
    )
    writeFileSync(indexPath, html)
    return
  }

  // Write the JSON-LD version first so the served page already carries it.
  writeFileSync(indexPath, html)

  const server = serveDist()
  await new Promise((r) => server.listen(PORT, r))

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 1200 })
    await page.goto(`http://localhost:${PORT}/?static=1`, {
      waitUntil: 'networkidle0',
      timeout: 60_000,
    })
    // The flag renders everything at rest, but give React a beat to commit.
    await page.waitForFunction(
      () => (document.querySelector('#root')?.textContent || '').length > 500,
      { timeout: 20_000 },
    )

    const rendered = await page.$eval('#root', (el) => el.innerHTML)

    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${rendered}</div>`,
    )
    writeFileSync(indexPath, html)
    console.log(
      `  ✓ prerendered #root (${(rendered.length / 1024).toFixed(1)} KB of markup)`,
    )
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch((err) => {
  console.error('prerender failed:', err)
  process.exit(1)
})
