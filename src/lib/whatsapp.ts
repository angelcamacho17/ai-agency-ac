/**
 * The single source of truth for the conversion channel.
 *
 * WhatsApp is the ONLY conversion event on this site — there is no pricing
 * page, no form, no email capture. The number lives here and nowhere else in
 * `src/`, so it can never drift between the nav, the hero, the agent cards,
 * the FAQ and the footer. The JSON-LD generator and llms.txt read the same
 * constants at build time.
 */

/** E.164 without the `+`, which is the format wa.me expects. */
export const WA_NUMBER = '584125671953'

/** Human-readable form for display in copy and the footer NAP. */
export const WA_DISPLAY = '+58 412 567 1953'

/** E.164 with the `+`, for `tel:` links and schema.org `telephone`. */
export const WA_E164 = '+584125671953'

/**
 * Where a click came from. Kept as a literal union so a typo fails the build
 * rather than silently poisoning attribution.
 */
export type CtaSource =
  | 'nav'
  | 'hero'
  | 'agent-card'
  | 'switchboard'
  | 'demo-handoff'
  | 'process-day5'
  | 'faq'
  | 'final-cta'
  | 'mobile-bar'
  | 'footer'

/**
 * Prefilled opening messages. Spanish, because the inbound audience writes in
 * Spanish even when they read the English page — and the first message the
 * visitor sends should already sound like them, not like a form submission.
 */
export const WA_PREFILL = {
  default: 'Hola, vengo de la web de Michelangelo Devs.',
  nav: 'Hola, vengo de la web de Michelangelo Devs.',
  hero: 'Hola, quiero un agente de IA para mi negocio.',
  demoHandoff: 'Hola, probé el agente en su web y quiero uno para mi negocio.',
  process: 'Hola, quiero lanzar mi agente en 5 días.',
  faq: 'Hola, tengo una pregunta sobre los agentes de IA.',
} as const

/** Used by every job card: `Hola, quiero un agente para mi negocio. Me interesa: {job}.` */
export const agentPrefill = (job: string) =>
  `Hola, quiero un agente para mi negocio. Me interesa: ${job}.`

/** `Quiero un agente para {channel}.` — used by the Switchboard satellites. */
export const channelPrefill = (channel: string) =>
  `Hola, quiero un agente para ${channel}.`

/**
 * Build a wa.me deep link with an optional prefilled message.
 * Always returns an absolute https URL so it works identically in the
 * prerendered document, in the WhatsApp unfurler and in JSON-LD.
 */
export function waHref(prefill: string = WA_PREFILL.default): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(prefill)}`
}

/**
 * The props every WhatsApp anchor needs. Spreading this guarantees the
 * destination is legible, the tab is safe, and the click is attributable.
 */
export function waLinkProps(source: CtaSource, prefill?: string) {
  return {
    href: waHref(prefill),
    target: '_blank' as const,
    rel: 'noopener noreferrer',
    'data-cta-source': source,
  }
}
