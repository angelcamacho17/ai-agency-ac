/**
 * THE SINGLE SOURCE OF TRUTH for what Michelangelo Devs sells.
 *
 * This file feeds three consumers that must never drift apart:
 *   1. The React sections (hero, capabilities, agents, process, clients, FAQ)
 *   2. The JSON-LD @graph injected at build time
 *   3. public/llms.txt
 *
 * Rules enforced by structure, not by discipline:
 *   - There is NO price field. Pricing is never published; scope and quote are
 *     agreed over WhatsApp. Nothing here can populate a priceSpecification.
 *   - Every `definition` must survive being quoted with zero surrounding
 *     context. An LLM should be able to lift one sentence and have it still
 *     name the subject, the channel and the outcome. That is the GEO contract.
 *   - Every literal stays plain data (no computed values) because
 *     scripts/seo-data.mjs evaluates these exports without a TS toolchain.
 */

import { agentPrefill } from '../lib/whatsapp'

/* ---------------------------------------------------------------- identity */

export const ORG = {
  name: 'Michelangelo Devs',
  url: 'https://michelangelodevs.com',
  /** The entity sentence. Must appear verbatim in the hero, JSON-LD and llms.txt. */
  definition:
    'Michelangelo Devs is an AI agents agency that builds production sales agents for WhatsApp, Instagram and web, live in about five days.',
  tagline: 'AI agents that answer, qualify and close on WhatsApp, Instagram and your site.',
  instagram: 'https://www.instagram.com/michelangelo.devs/',
  instagramHandle: '@michelangelo.devs',
  areaServed: ['Venezuela', 'Latin America'],
  languages: ['es', 'en'],
} as const

/* ------------------------------------------------------------ capabilities */

export type Capability = {
  key: string
  title: string
  copy: string
}

/**
 * What every agent ships with. Each line describes a behaviour that exists in
 * production today, phrased for a business owner, not an engineer.
 */
export const CAPABILITIES: readonly Capability[] = [
  { key: 'channels', title: 'One brain, three channels', copy: 'Instagram, WhatsApp and web share one memory.' },
  { key: 'knowledge', title: 'Answers from your catalog', copy: 'Prices and stock from your own sheets.' },
  { key: 'booking', title: 'Books and reschedules', copy: 'Real availability, several locations.' },
  { key: 'payments', title: 'Closes with a payment link', copy: 'Paid inside the chat.' },
  { key: 'crm', title: 'Keeps your CRM honest', copy: 'Every lead lands in the right stage.' },
  { key: 'handoff', title: 'Hands off to a human', copy: 'With the full context attached.' },
  { key: 'languages', title: 'Spanish, English, Portuguese', copy: 'Switches when the customer does.' },
  { key: 'voice', title: 'Replies with voice notes', copy: 'When the moment calls for it.' },
  { key: 'followup', title: 'Follows up twice, then stops', copy: 'Never after a no.' },
  { key: 'review', title: 'Reviews its own answers', copy: 'A second model checks every draft.' },
] as const

/* ------------------------------------------------------------------ agents */

export type Agent = {
  slug: string
  name: string
  channel: string
  /** Self-contained, quotable, subject-in-sentence. The GEO payload. */
  definition: string
  /** The buyer-facing promise, one line. */
  outcome: string
  /** What it plugs into. */
  connects: readonly string[]
  /** Observable behaviours, rendered on the card. */
  behaviours: readonly string[]
}

export const AGENTS: readonly Agent[] = [
  {
    slug: 'whatsapp-sales-agent',
    name: 'WhatsApp Sales Agent',
    channel: 'WhatsApp',
    definition:
      'The WhatsApp Sales Agent answers WhatsApp messages in under a second, in Spanish or English, and books ready-to-buy customers straight into your calendar.',
    outcome: 'Books the ready-to-buy without you touching the phone.',
    connects: ['CRM', 'Calendar', 'Payments'],
    behaviours: [
      'Replies in under a second, day or night',
      'Reads the whole thread before it answers',
      'Scores intent and qualifies the lead',
      'Books straight into your calendar',
      'Escalates to a person with full context',
    ],
  },
  {
    slug: 'instagram-dm-agent',
    name: 'Instagram DM Agent',
    channel: 'Instagram',
    definition:
      'The Instagram DM Agent replies to Instagram direct messages and story reactions in your brand voice, qualifies the buyer, and moves the conversation to a booking or a sale.',
    outcome: 'Turns story replies and DMs into booked conversations.',
    connects: ['Instagram Business', 'CRM', 'Calendar'],
    behaviours: [
      'Answers DMs and story reactions',
      'Holds your brand voice on every reply',
      'Separates buyers from browsers',
      'Moves the thread toward a booking',
      'Hands off to a human on request',
    ],
  },
  {
    slug: 'web-concierge-agent',
    name: 'Web Concierge Agent',
    channel: 'Website',
    definition:
      'The Web Concierge Agent lives on your website, answers product and pricing questions from your own documentation, and captures the visitor before they leave the page.',
    outcome: 'Catches the visitor who would have bounced in silence.',
    connects: ['Your docs', 'CRM', 'Analytics'],
    behaviours: [
      'Answers from your real documentation',
      'Never invents a fact it was not given',
      'Captures the lead before the tab closes',
      'Routes the question to the right team',
      'Logs every conversation for review',
    ],
  },
  {
    slug: 'booking-agent',
    name: 'Booking Agent',
    channel: 'Any channel',
    definition:
      'The Booking Agent handles scheduling end to end. It offers real availability, confirms the appointment, sends the reminder and reschedules when the customer asks.',
    outcome: 'Fills the calendar and cuts the no-shows.',
    connects: ['Calendar', 'CRM', 'WhatsApp'],
    behaviours: [
      'Offers only genuinely free slots',
      'Confirms in the customer’s own channel',
      'Sends the reminder before the appointment',
      'Reschedules without a human touching it',
      'Flags repeat no-shows to your team',
    ],
  },
  {
    slug: 'recovery-agent',
    name: 'Recovery Agent',
    channel: 'WhatsApp + Instagram',
    definition:
      'The Recovery Agent follows up on conversations that went cold, such as abandoned carts, unanswered quotes and stalled threads, and reopens them with a message that sounds like your team.',
    outcome: 'Reopens the deals everyone else forgot about.',
    connects: ['CRM', 'Payments', 'WhatsApp'],
    behaviours: [
      'Spots the thread that went quiet',
      'Follows up on a schedule you set',
      'Sounds like your team, not a broadcast',
      'Stops the moment the customer says no',
      'Reports what actually reopened',
    ],
  },
] as const

/** Convenience for card CTAs. Keeps prefill wording in one place. */
export const agentWaPrefill = (agent: Agent) => agentPrefill(agent.name)

/* ----------------------------------------------------------------- process */

export type Phase = {
  key: string
  label: string
  duration: string
  copy: string
}

export const PHASES: readonly Phase[] = [
  {
    key: 'map',
    label: 'Map',
    duration: 'Day 1',
    copy: 'We trace how your best rep sells.',
  },
  {
    key: 'build',
    label: 'Build',
    duration: 'Day 2-3',
    copy: 'Your data, your voice, your CRM and calendar.',
  },
  {
    key: 'pressure-test',
    label: 'Pressure-test',
    duration: 'Day 4',
    copy: 'Real conversations, edge cases, handoff rules.',
  },
  {
    key: 'ship',
    label: 'Ship',
    duration: 'Day 5',
    copy: 'Live on your channels. We iterate weekly.',
  },
] as const

/* ----------------------------------------------------------------- clients */

export type ClientLink = { channel: 'Website' | 'WhatsApp' | 'Instagram'; href: string }

export type Client = {
  key: string
  name: string
  /** What they do, four words or fewer. */
  sector: string
  /** Alpha-mask PNG in public/clients; painted in currentColor. Absent = wordmark. */
  logo?: string
  links: readonly ClientLink[]
  /** One line, featured tile only. */
  copy?: string
  featured?: boolean
}

export const CLIENTS: readonly Client[] = [
  {
    key: 'lidotel',
    name: 'Lidotel',
    sector: 'Hotel chain',
    logo: '/clients/lidotel.png',
    links: [{ channel: 'Website', href: 'https://lidotel.com/' }],
    copy: 'Quotes real rooms and takes the payment, on Instagram, WhatsApp and lidotel.com.',
    featured: true,
  },
  {
    key: 'terracota',
    name: 'Terracota',
    sector: 'Clothing, retail and wholesale',
    logo: '/clients/terracota.png',
    links: [
      { channel: 'WhatsApp', href: 'https://wa.me/584226325858' },
      { channel: 'Instagram', href: 'https://www.instagram.com/terraccota.vip' },
    ],
  },
  {
    key: 'renaissence',
    name: 'Clínica Renaissence',
    sector: 'Medical clinic',
    logo: '/clients/renaissence.png',
    links: [{ channel: 'Instagram', href: 'https://www.instagram.com/dra.gabrielarodriguezplaza/' }],
  },
  {
    key: 'topone',
    name: 'TopOne',
    sector: 'Wholesale auto parts',
    logo: '/clients/topone.png',
    links: [{ channel: 'WhatsApp', href: 'https://wa.me/584220421739' }],
  },
  {
    key: 'coloreal',
    name: 'Coloreal y Sensacolor',
    sector: 'Paint manufacturer',
    logo: '/clients/coloreal.png',
    links: [{ channel: 'Instagram', href: 'https://www.instagram.com/pinturascolorealvzla/' }],
  },
  {
    key: 'mariu',
    name: 'Mariu Bustamante',
    sector: 'Interior design',
    logo: '/clients/mariu.png',
    links: [{ channel: 'Instagram', href: 'https://www.instagram.com/mariubustamante/' }],
  },
  {
    key: 'vic',
    name: 'Victoria Poggioli',
    sector: 'Social media educator',
    logo: '/clients/vic.png',
    links: [{ channel: 'Instagram', href: 'https://www.instagram.com/victoria.poggioli/' }],
  },
  {
    key: 'viajes-premiere',
    name: 'Viajes Premiere',
    sector: 'Travel agency',
    links: [{ channel: 'Instagram', href: 'https://www.instagram.com/viajespremiereve/' }],
  },
] as const

/* ------------------------------------------------------------------- proof */

export type Proof = { value: string; label: string }

/**
 * Numbers from our own production systems. Keep them real and keep them few.
 */
export const PROOF: readonly Proof[] = [
  { value: '504', label: 'conversations our own agent handled in 30 days' },
  { value: '141', label: 'of them arrived after 8 pm and got answered' },
  { value: '2,505', label: 'automated tests in production' },
  { value: '13', label: 'agents live across hotels, clinics, retail and industry' },
] as const

/* --------------------------------------------------------------------- faq */

export type Faq = { q: string; a: string }

/**
 * Rendered ALWAYS OPEN, never inside <details>. Collapsed answers extract
 * worse for generative engines, and the FAQPage JSON-LD must match the
 * visible text exactly, which is why both read from this array.
 */
export const FAQ: readonly Faq[] = [
  {
    q: 'How long until an AI sales agent is live?',
    a: 'About five working days: one day mapping how you sell, two building, one pressure-testing and one shipping.',
  },
  {
    q: 'What does an AI sales agent cost?',
    a: 'Pricing depends on your message volume, the channels you need and how deep the integrations go, so we do not publish a number. Write to us on WhatsApp with what you sell and we will scope it honestly, including telling you if an agent is not worth it for you yet.',
  },
  {
    q: 'Which channels do the agents work on?',
    a: 'WhatsApp, Instagram direct messages and your own website. One agent brain serves every channel, so a customer who starts on Instagram and continues on WhatsApp is not asked to repeat themselves.',
  },
  {
    q: 'Will the agent sound like a robot?',
    a: 'No. The agent is trained on your real conversations and your best rep’s language, so it answers in your brand voice. You approve the tone before it goes live.',
  },
  {
    q: 'What happens when the agent does not know the answer?',
    a: 'It escalates to a person with the full conversation attached, instead of guessing. We set the handoff rules with you on day four, and the agent is biased toward escalating rather than answering wrong.',
  },
  {
    q: 'Does it connect to my CRM and calendar?',
    a: 'Yes. CRM, calendar and payments are wired in on day one of the build, not sold as an upgrade later.',
  },
  {
    q: 'Do the agents work in Spanish and English?',
    a: 'Yes. The agents answer in the language the customer writes in, and switch mid-conversation if the customer does.',
  },
  {
    q: 'How do I start?',
    a: 'Write to us on WhatsApp at +58 412 567 1953. Tell us what you sell and which channel is leaking, and we reply the same day.',
  },
] as const
