/**
 * English mirror of offer.ts for the in-page language toggle. Same shape,
 * same keys, same links. Not read by the build scripts: Spanish is what the
 * prerender and structured data carry.
 */
import type { Agent, Capability, Client, Faq, Phase } from './offer'
import { CLIENTS as CLIENTS_ES, ORG as ORG_ES } from './offer'

export const ORG = {
  ...ORG_ES,
  definition:
    'Michelangelo Devs is an AI agents agency that builds production sales agents for WhatsApp, Instagram and web, live in less than two weeks.',
  tagline: 'One AI agent that answers, qualifies and closes on WhatsApp, Instagram and your site.',
  areaServed: ['Venezuela', 'Latin America'],
} as const

export const CAPABILITIES: readonly Capability[] = [
  { key: 'channels', title: 'One brain, three channels', copy: 'Instagram, WhatsApp and web share one memory.' },
  { key: 'knowledge', title: 'Answers from your catalog', copy: 'Prices and stock from your own sheets.' },
  { key: 'booking', title: 'Books and reschedules', copy: 'Real availability, several locations.' },
  { key: 'payments', title: 'Closes with a payment link', copy: 'Paid inside the chat.' },
  { key: 'crm', title: 'Keeps your CRM honest', copy: 'Every lead lands in the right stage.' },
  { key: 'handoff', title: 'Hands off to a human', copy: 'With the full context attached.' },
  { key: 'languages', title: 'Spanish, English, Portuguese', copy: 'Switches when the customer does.' },
  { key: 'followup', title: 'Follows up twice, then stops', copy: 'Never after a no.' },
  { key: 'review', title: 'Reviews its own answers', copy: 'A second model checks every draft.' },
]

export const AGENTS: readonly Agent[] = [
  {
    slug: 'ventas',
    name: 'Sells',
    channel: 'WhatsApp and Instagram',
    definition:
      'The Michelangelo Devs agent answers WhatsApp and Instagram messages in under a second, in Spanish or English, and carries the conversation through to the sale.',
    outcome: 'Replies instantly, day or night, in your voice.',
  },
  {
    slug: 'califica',
    name: 'Qualifies',
    channel: 'Any channel',
    definition:
      'The Michelangelo Devs agent separates buyers from browsers, scores intent and drops every lead into the right CRM stage.',
    outcome: 'Your team only talks to people ready to buy.',
  },
  {
    slug: 'concierge',
    name: 'Runs your site',
    channel: 'Your website',
    definition:
      'The Michelangelo Devs agent lives on your website, answers product and pricing questions from your own documentation, and captures the visitor before they leave.',
    outcome: 'Catches the visitor who was leaving in silence.',
  },
  {
    slug: 'agenda',
    name: 'Books',
    channel: 'Any channel',
    definition:
      'The Michelangelo Devs agent offers real availability, confirms the appointment, sends the reminder and reschedules when the customer asks.',
    outcome: 'Fills the calendar and cuts the no-shows.',
  },
]

export const PHASES: readonly Phase[] = [
  { key: 'map', label: 'Map', duration: 'Days 1-2', copy: 'We trace how your best rep sells.' },
  { key: 'build', label: 'Build', duration: 'Days 3-8', copy: 'Your data, your voice, your CRM and calendar.' },
  { key: 'pressure-test', label: 'Test', duration: 'Days 9-12', copy: 'Real conversations, edge cases, handoff rules.' },
  { key: 'ship', label: 'Ship', duration: 'Day 13', copy: 'Live on your channels. We iterate weekly.' },
]

const SECTOR_EN: Record<string, string> = {
  lidotel: 'Hotel chain',
  terracota: 'Clothing, retail and wholesale',
  renaissence: 'Medical clinic',
  topone: 'Wholesale auto parts',
  coloreal: 'Paint manufacturer',
  mariu: 'Interior design',
  vic: 'Social media educator',
  'viajes-premiere': 'Travel agency',
}

export const CLIENTS: readonly Client[] = CLIENTS_ES.map((c) => ({
  ...c,
  sector: SECTOR_EN[c.key] ?? c.sector,
  copy: c.featured
    ? 'Quotes real rooms and takes the payment, on Instagram, WhatsApp and lidotel.com.'
    : undefined,
}))

export const FAQ: readonly Faq[] = [
  {
    q: 'How long until an AI sales agent is live?',
    a: 'Less than two weeks: a couple of days mapping how you sell, a week building, a few days testing and the launch.',
  },
  {
    q: 'What does an AI sales agent cost?',
    a: 'It is a monthly plan. Before quoting we evaluate your business to understand whether the agent will bring in more revenue than it costs. If it qualifies, you get two weeks of free use; if you do not like how it works, it is disconnected with no commitment.',
  },
  {
    q: 'Which channels does the agent work on?',
    a: 'WhatsApp, Instagram direct messages and your own website. One agent serves every channel, so a customer who starts on Instagram and continues on WhatsApp never repeats themselves.',
  },
  {
    q: 'Will it sound like a robot?',
    a: 'No. The agent is trained on your real conversations and your best rep’s language, so it answers in your brand voice. You approve the tone before it goes live.',
  },
  {
    q: 'What happens when the agent does not know the answer?',
    a: 'It escalates to a person with the full conversation attached, instead of guessing. We set the handoff rules with you on day four, and the agent prefers escalating to answering wrong.',
  },
  {
    q: 'Does it connect to my CRM and calendar?',
    a: 'Yes. CRM and calendar are wired in on day one of the build, not sold as an upgrade later.',
  },
  {
    q: 'Does it work in Spanish and English?',
    a: 'Yes. The agent answers in the language the customer writes in, and switches mid-conversation if the customer does.',
  },
  {
    q: 'How do I start?',
    a: 'Write to us on WhatsApp at +58 412 567 1953. Tell us what you sell and which channel is leaking sales, and we reply the same day.',
  },
]
