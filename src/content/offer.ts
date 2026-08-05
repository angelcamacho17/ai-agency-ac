/**
 * THE SINGLE SOURCE OF TRUTH for what Michelangelo Devs sells.
 *
 * This file feeds three consumers that must never drift apart:
 *   1. The React sections (agent cards, process, FAQ)
 *   2. The JSON-LD @graph injected at build time
 *   3. public/llms.txt
 *
 * Rules enforced by structure, not by discipline:
 *   - There is NO price field. Pricing is never published; scope and quote are
 *     agreed over WhatsApp. Nothing here can populate a priceSpecification.
 *   - Every `definition` must survive being quoted with zero surrounding
 *     context — an LLM should be able to lift one sentence and have it still
 *     name the subject, the channel and the outcome. That is the GEO contract.
 */

import { agentPrefill } from '../lib/whatsapp'

/* ---------------------------------------------------------------- identity */

export const ORG = {
  name: 'Michelangelo Devs',
  url: 'https://michelangelodevs.com',
  /** The entity sentence. Must appear verbatim in the hero, JSON-LD and llms.txt. */
  definition:
    'Michelangelo Devs is an AI agents agency that builds production sales agents for WhatsApp, Instagram and web, live in about five days.',
  tagline: 'AI agents that answer, qualify and close — on WhatsApp, Instagram and your site.',
  areaServed: ['Venezuela', 'Latin America'],
  languages: ['es', 'en'],
} as const

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
  /** Five observable behaviours, rendered as a <dl> on the card. */
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
      'The Booking Agent handles scheduling end to end — it offers real availability, confirms the appointment, sends the reminder and reschedules when the customer asks.',
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
      'The Recovery Agent follows up on conversations that went cold — abandoned carts, unanswered quotes and stalled threads — and reopens them with a message that sounds like your team.',
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

/** Convenience for card CTAs — keeps prefill wording in one place. */
export const agentWaPrefill = (agent: Agent) => agentPrefill(agent.name)

/* ----------------------------------------------------------------- process */

export type Phase = {
  key: string
  label: string
  duration: string
  /** Kept verbatim from the existing Process section — this copy already works. */
  copy: string
}

export const PHASES: readonly Phase[] = [
  {
    key: 'map',
    label: 'Map',
    duration: 'Day 1',
    copy: 'We trace how your best rep sells and pick the channel with the most leakage.',
  },
  {
    key: 'build',
    label: 'Build',
    duration: 'Day 2-3',
    copy: 'We train the agent on your data and voice, then wire it into your CRM, calendar and payments.',
  },
  {
    key: 'pressure-test',
    label: 'Pressure-test',
    duration: 'Day 4',
    copy: 'We run it against real conversations, tune edge cases and set the human-handoff rules with you.',
  },
  {
    key: 'ship',
    label: 'Ship',
    duration: 'Day 5',
    copy: 'It goes live on your channels. You watch every conversation and we iterate weekly from real outcomes.',
  },
] as const

/* --------------------------------------------------------------------- faq */

export type Faq = { q: string; a: string }

/**
 * Rendered ALWAYS OPEN — never inside <details>. Collapsed answers extract
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
    a: 'Pricing depends on your message volume, the channels you need and how deep the integrations go, so we do not publish a number. Write to us on WhatsApp with what you sell and we will scope it honestly — including telling you if an agent is not worth it for you yet.',
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
