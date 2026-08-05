/**
 * THE GATE. Fails the build when the SEO/GEO/conversion contract is broken.
 *
 * This is the most valuable script in the repo: it converts every promise in
 * the plan from "aspirational" to "unregressable". If someone later swaps a
 * CTA back to a mailto, hides the copy behind an animation again, or ships a
 * price, the build stops here rather than silently shipping.
 *
 * Run automatically as part of `npm run build`.
 */

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readOffer } from './seo-data.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const DIST = resolve(ROOT, 'dist')

const failures = []
const warnings = []

const fail = (m) => failures.push(m)
const warn = (m) => warnings.push(m)

const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null)

const html = read(resolve(DIST, 'index.html'))
if (!html) {
  console.error('verify-seo: dist/index.html missing — run `vite build` first.')
  process.exit(1)
}

const { ORG, AGENTS, FAQ } = readOffer()

/* -------------------------------------------------- 1. crawlable content */

const bodyStart = html.indexOf('<div id="root">')
const rootInner = html.slice(bodyStart + '<div id="root">'.length)
const prerendered = rootInner.trim().length > 200 && !rootInner.startsWith('</div>')

if (!prerendered) {
  warn(
    'dist/index.html ships an EMPTY #root — crawlers and generative engines see a blank page.\n' +
      '      Install puppeteer (`npm i -D puppeteer`) so the prerender step can run.',
  )
} else {
  // Only assert on rendered text when a prerender actually happened.
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')

  const need = (needle, label) => {
    if (!text.includes(needle)) fail(`${label} missing from prerendered HTML: "${needle}"`)
  }

  need('AI agents that answer, qualify and close', 'H1')
  need(ORG.definition.slice(0, 60), 'Entity sentence')
  for (const a of AGENTS) need(a.name, `Agent name`)
  for (const f of FAQ) need(f.q, `FAQ question`)

  if (!/Skip to content/.test(text)) fail('Skip link missing from prerendered HTML')
}

/* ------------------------------------------------------- 2. the CTA rule */

if (!html.includes('wa.me/584125671953')) {
  fail('dist/index.html does not contain the WhatsApp link wa.me/584125671953')
}

// mailto: as a conversion action is a constraint violation.
if (/href="mailto:/.test(html)) {
  fail('A mailto: link is present in the built HTML — WhatsApp is the only conversion channel')
}

/* ------------------------------------------------------ 3. no prices ever */

const PRICE_PATTERNS = [
  /\$\s?\d/,
  /\bUSD\b/,
  /\bEUR\b/,
  /\d+\s?(?:USD|usd)\b/,
  /\bdesde\s+\$?\d/i,
  /\ba partir de\s+\$?\d/i,
  /\bprice(?:s|d)?\s*:\s*\$?\d/i,
  /\bpriceSpecification\b/,
  /"offers"\s*:/,
  /\bper month\b/i,
  /\bal mes\b/i,
  /\bmensual(?:es)?\s*:?\s*\$?\d/i,
]

const srcFiles = [
  'src/content/offer.ts',
  'src/sections/Hero.tsx',
  'src/sections/Agents.tsx',
  'src/sections/Questions.tsx',
  'src/sections/Process.tsx',
  'src/sections/FinalCta.tsx',
]

/**
 * Strip comments before scanning. Comments legitimately *discuss* pricing
 * (e.g. "carries no priceSpecification"); only shipped strings matter.
 */
const stripComments = (s) =>
  s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1')

for (const rel of srcFiles) {
  const body = read(resolve(ROOT, rel))
  if (!body) continue
  const code = stripComments(body)
  for (const re of PRICE_PATTERNS) {
    const m = code.match(re)
    if (m) fail(`Possible pricing language in ${rel}: "${m[0]}" — prices must never be published`)
  }
}

for (const re of PRICE_PATTERNS) {
  const m = html.match(re)
  if (m) fail(`Possible pricing language in built HTML: "${m[0]}"`)
}

/* ------------------------------------------------- 4. structured data set */

if (!html.includes('application/ld+json')) {
  fail('No JSON-LD in dist/index.html')
} else {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  try {
    const graph = JSON.parse(m[1])['@graph'] || []
    const types = graph.map((n) => n['@type'])
    for (const t of ['ProfessionalService', 'OfferCatalog', 'HowTo', 'FAQPage']) {
      if (!types.includes(t)) fail(`JSON-LD @graph missing a ${t} node`)
    }
    const faqNode = graph.find((n) => n['@type'] === 'FAQPage')
    if (faqNode && faqNode.mainEntity.length !== FAQ.length) {
      fail(
        `FAQPage has ${faqNode.mainEntity.length} questions but offer.ts defines ${FAQ.length}`,
      )
    }
    // FAQ answers must match the visible copy byte-for-byte.
    for (const q of faqNode?.mainEntity || []) {
      const source = FAQ.find((f) => f.q === q.name)
      if (!source) fail(`JSON-LD FAQ question not found in offer.ts: "${q.name}"`)
      else if (source.a !== q.acceptedAnswer.text) {
        fail(`JSON-LD FAQ answer drifted from visible copy for: "${q.name}"`)
      }
    }
    const catalog = graph.find((n) => n['@type'] === 'OfferCatalog')
    for (const svc of catalog?.itemListElement || []) {
      if ('offers' in svc || 'priceSpecification' in svc) {
        fail(`Service "${svc.name}" carries a price node — pricing must never be published`)
      }
    }
  } catch (err) {
    fail(`JSON-LD is not parseable: ${err.message}`)
  }
}

/* ------------------------------------------------------- 5. GEO artefacts */

const llms = read(resolve(DIST, 'llms.txt'))
if (!llms) fail('dist/llms.txt missing')
else {
  if (!llms.includes('wa.me/584125671953')) fail('llms.txt missing the WhatsApp link')
  if (!/Pricing is not published/.test(llms)) {
    fail('llms.txt must state explicitly that pricing is not published')
  }
  for (const a of AGENTS) {
    if (!llms.includes(a.name)) fail(`llms.txt missing agent: ${a.name}`)
  }
}

const robots = read(resolve(DIST, 'robots.txt'))
if (!robots) fail('dist/robots.txt missing')
else {
  for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
    if (!robots.includes(bot)) fail(`robots.txt does not mention ${bot}`)
  }
  if (!robots.includes('Sitemap:')) fail('robots.txt missing the Sitemap: line')
}

if (!existsSync(resolve(DIST, 'sitemap.xml'))) fail('dist/sitemap.xml missing')

/* ------------------------------------------------------------ 6. head kit */

if (!/rel="canonical"/.test(html)) fail('Missing <link rel="canonical">')
if (!/property="og:image"/.test(html)) fail('Missing og:image')
if (!/name="twitter:card"/.test(html)) fail('Missing twitter:card')
if (!existsSync(resolve(DIST, 'og.jpg'))) {
  warn('public/og.jpg missing — link previews in WhatsApp will have no image')
}

/* ---------------------------------------------------------------- report */

if (warnings.length) {
  console.log('\n  SEO/GEO warnings:')
  for (const w of warnings) console.log(`    ! ${w}`)
}

if (failures.length) {
  console.error(`\n  ✗ SEO/GEO gate FAILED (${failures.length}):\n`)
  for (const f of failures) console.error(`    - ${f}`)
  console.error('')
  process.exit(1)
}

console.log(`  ✓ SEO/GEO gate passed${warnings.length ? ` (${warnings.length} warning(s))` : ''}`)
