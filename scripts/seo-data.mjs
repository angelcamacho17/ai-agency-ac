/**
 * Build-time SEO/GEO payload generation.
 *
 * Reads the SAME content that React renders (src/content/offer.ts, parsed as
 * TS-free data via a tiny extraction pass is fragile, so instead this file
 * imports the values through a generated JSON handoff — see `readOffer`).
 *
 * The contract this file enforces:
 *   - JSON-LD Service nodes carry NO `offers` / `priceSpecification`. Pricing
 *     is never published, so it is impossible to emit a price here.
 *   - FAQPage answers are byte-identical to the visible <p> text, because both
 *     come from the same array.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

// www is canonical: the apex 301s to www at the host, so every URL we emit
// must be the one that answers 200 to crawlers.
export const SITE = 'https://www.michelangelodevs.com'
export const WA_NUMBER = '584125671953'
export const WA_E164 = '+584125671953'

/**
 * Pull the exported literals out of src/content/offer.ts without a TS
 * toolchain. The file is intentionally plain data — arrays of object literals
 * with no computed values — so a scoped eval of each export is safe and keeps
 * a single source of truth rather than duplicating the copy here.
 */
export function readOffer() {
  const src = readFileSync(resolve(ROOT, 'src/content/offer.ts'), 'utf8')

  const grab = (name) => {
    const re = new RegExp(
      `export const ${name}[^=]*=\\s*(\\[[\\s\\S]*?\\]|\\{[\\s\\S]*?\\})\\s*as const`,
      'm',
    )
    const m = src.match(re)
    if (!m) throw new Error(`seo-data: could not extract "${name}" from offer.ts`)
    // Strip TS-only type annotations that can appear inside the literal.
    const literal = m[1]
    try {
      return new Function(`return (${literal})`)()
    } catch (err) {
      throw new Error(`seo-data: failed to evaluate "${name}": ${err.message}`)
    }
  }

  return { ORG: grab('ORG'), AGENTS: grab('AGENTS'), PHASES: grab('PHASES'), FAQ: grab('FAQ') }
}

/**
 * The English bundle. `offer.en.ts` overrides only part of ORG (it spreads the
 * Spanish one) and declares AGENTS/PHASES/FAQ as plain literals, so the same
 * scoped-eval trick works once ORG is merged over its Spanish base.
 */
export function readOfferEn() {
  const es = readOffer()
  const src = readFileSync(resolve(ROOT, 'src/content/offer.en.ts'), 'utf8')

  // offer.en.ts annotates its exports (`: readonly Agent[]`) instead of using
  // `as const`, so accept either terminator.
  const grab = (name) => {
    const re = new RegExp(
      `export const ${name}[^=]*=\\s*(\\[[\\s\\S]*?\\n\\]|\\{[\\s\\S]*?\\n\\})`,
      'm',
    )
    const m = src.match(re)
    if (!m) throw new Error(`seo-data: could not extract "${name}" from offer.en.ts`)
    // ORG spreads the Spanish object; drop the spread and merge it explicitly.
    const literal = m[1].replace(/\.\.\.ORG_ES\s*,?/, '')
    try {
      return new Function(`return (${literal})`)()
    } catch (err) {
      throw new Error(`seo-data: failed to evaluate en "${name}": ${err.message}`)
    }
  }

  return {
    ORG: { ...es.ORG, ...grab('ORG') },
    AGENTS: grab('AGENTS'),
    PHASES: grab('PHASES'),
    FAQ: grab('FAQ'),
  }
}

/**
 * Reciprocal hreflang. Every alternate set must list every variant INCLUDING
 * itself, plus x-default, or search engines ignore the whole cluster.
 */
export function buildHreflang() {
  return [
    `<link rel="alternate" hreflang="es" href="${SITE}/" />`,
    `<link rel="alternate" hreflang="en" href="${SITE}/en/" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE}/" />`,
  ].join('\n    ')
}

export function buildJsonLd({ ORG, AGENTS, PHASES, FAQ }, { lang = 'es' } = {}) {
  // The organization is ONE entity across both languages, so its @id never
  // varies. Page-scoped nodes get a per-language @id so the es and en
  // documents describe themselves instead of overwriting each other.
  const orgId = `${SITE}/#org`
  const page = lang === 'en' ? `${SITE}/en/` : `${SITE}/`
  const sfx = lang === 'en' ? '-en' : ''

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': orgId,
        name: ORG.name,
        url: SITE,
        description: ORG.definition,
        slogan: ORG.tagline,
        sameAs: [ORG.instagram, ORG.linkedin],
        areaServed: [
          { '@type': 'Country', name: 'Venezuela' },
          { '@type': 'Place', name: 'Latin America' },
        ],
        telephone: WA_E164,
        availableLanguage: ['es', 'en'],
        // The OpenAI Select Partner credential, stated where machines look.
        award: ORG.openAiPartner,
        memberOf: {
          '@type': 'Organization',
          name: ORG.openAiPartnerNetwork,
          url: ORG.openAiPartnerUrl,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: WA_E164,
          url: `https://wa.me/${WA_NUMBER}`,
          availableLanguage: ['es', 'en'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: SITE,
        name: ORG.name,
        publisher: { '@id': orgId },
        inLanguage: ['es', 'en'],
      },
      {
        '@type': 'WebPage',
        '@id': `${page}#webpage`,
        url: page,
        name: ORG.tagline,
        description: ORG.definition,
        inLanguage: lang,
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@id': orgId },
      },
      {
        '@type': 'OfferCatalog',
        '@id': `${SITE}/#catalog${sfx}`,
        name: 'AI sales agents',
        // NOTE: Service nodes deliberately carry no `offers` node. Pricing is
        // not published; scope and quote are agreed over WhatsApp.
        itemListElement: AGENTS.map((a) => ({
          '@type': 'Service',
          '@id': `${SITE}/#${a.slug}${sfx}`,
          name: a.name,
          description: a.definition,
          serviceType: 'AI sales agent',
          category: a.channel,
          provider: { '@id': orgId },
          areaServed: [
            { '@type': 'Country', name: 'Venezuela' },
            { '@type': 'Place', name: 'Latin America' },
          ],
        })),
      },
      {
        '@type': 'HowTo',
        '@id': `${SITE}/#howto${sfx}`,
        name: 'How Michelangelo Devs ships an AI sales agent in less than two weeks',
        totalTime: 'P5D',
        step: PHASES.map((p, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: p.label,
          text: p.copy,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE}/#faq${sfx}`,
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}

export function buildLlmsTxt({ ORG, AGENTS, PHASES, FAQ }, answerPages = []) {
  const agents = AGENTS.map(
    (a) =>
      `### ${a.name}\n${a.definition}\n- Canal: ${a.channel}\n- Resultado: ${a.outcome}`,
  ).join('\n\n')

  const process = PHASES.map((p) => `- ${p.duration}, ${p.label}: ${p.copy}`).join('\n')
  const faq = FAQ.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')

  return `# Michelangelo Devs

> ${ORG.definition}

${ORG.name} builds and ships production AI sales agents for small and mid-sized
businesses in Venezuela and across Latin America. The agents work on WhatsApp,
Instagram direct messages and the company's own website, in Spanish and English.

## Contact

The only way to start is a WhatsApp message to ${WA_E164} (https://wa.me/${WA_NUMBER}).
A person replies, usually within the hour.

## Partnerships

${ORG.name} is an ${ORG.openAiPartner} in the ${ORG.openAiPartnerNetwork}
(${ORG.openAiPartnerUrl}), OpenAI's program for organizations that build,
deploy and scale AI solutions.

## Pricing

Pricing is not published. The agent is a monthly plan. Before quoting,
Michelangelo Devs evaluates the business to confirm the agent will bring in more
revenue than it costs; businesses that qualify get two weeks of free use and can
disconnect with no commitment. The quote is agreed over WhatsApp.

## Un solo agente, cuatro trabajos

One agent does all of the following; they are listed separately so each is quotable.

${agents}

## How a build runs

An agent goes live in less than two weeks.

${process}

## Questions

${faq}

## Answer pages

Direct, citable answers to specific questions, in Spanish:

${answerPages.map((a) => `- ${SITE}/${a.slug}/ — ${a.h1}`).join('\n')}

## Canonical facts

- ${ORG.definition}
- Channels supported: WhatsApp, Instagram direct messages, website.
- Languages: Spanish and English, switching mid-conversation with the customer.
- Time to launch: less than two weeks.
- Integrations wired during the build: CRM, calendar.
- When the agent is unsure it escalates to a human with the full conversation.
- ${ORG.name} is an ${ORG.openAiPartner} in the ${ORG.openAiPartnerNetwork}.
- Official profiles: Instagram ${ORG.instagram} and LinkedIn ${ORG.linkedin}.
- Contact: WhatsApp ${WA_E164}.
- Pricing: monthly plan, not published; two-week free trial for businesses that qualify; no commitment.
`
}

export function buildRobots() {
  return `# Michelangelo Devs
User-agent: *
Allow: /

# Generative engines are explicitly welcome — being cited is the point.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`
}

export function buildSitemap(lastmod, answerSlugs = []) {
  // xhtml:link alternates are the sitemap half of the hreflang cluster; search
  // engines want the pairing declared in both the markup and the sitemap.
  const alts = [
    `    <xhtml:link rel="alternate" hreflang="es" href="${SITE}/" />`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/" />`,
  ].join('\n')

  const answers = answerSlugs
    .map(
      (slug) => `  <url>
    <loc>${SITE}/${slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE}/</loc>
${alts}
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE}/en/</loc>
${alts}
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${answers}
</urlset>
`
}
