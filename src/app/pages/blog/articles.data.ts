/**
 * Blog articles.
 *
 * The Article interface IS the "article template" from the GEO plan — copy this
 * shape for every new post. Each article opens with a one-paragraph
 * `keyTakeaway` (the quotable answer an LLM lifts), then sections, an FAQ block,
 * and explicit sources. Articles are prerendered to static HTML via
 * getPrerenderParams over ARTICLE_SLUGS.
 */
export interface ArticleSection {
  heading: string;
  body: string[];
  bullets?: string[];
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface ArticleSource {
  label: string;
  url: string;
}

export interface Article {
  slug: string;
  title: string;
  /** Meta + og description. */
  description: string;
  keywords: string;
  /** ISO date, e.g. "2026-06-17". */
  datePublished: string;
  /** Reading time label, e.g. "6 min read". */
  readingTime: string;
  /** The quotable, self-contained answer. Rendered right under the H1. */
  keyTakeaway: string;
  sections: ArticleSection[];
  faqs: ArticleFaq[];
  sources: ArticleSource[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'ai-agents-for-instagram-whatsapp-sales',
    title: 'How AI Agents Close Sales on Instagram and WhatsApp',
    description:
      'AI agents answer every Instagram DM and WhatsApp message in seconds, qualify the lead and book the call — recovering sales lost to slow replies. Here is how they work and what to expect.',
    keywords:
      'ai agent instagram, ai agent whatsapp, instagram dm automation, whatsapp sales automation, ai sales agent, recover lost leads',
    datePublished: '2026-06-17',
    readingTime: '6 min read',
    keyTakeaway:
      'On Instagram and WhatsApp, the business that replies first usually wins the sale. An AI agent answers every message in seconds, 24/7, qualifies the lead with the right questions, books the call and hands warm buyers to your team — recovering the conversations that slow manual replies quietly lose every week.',
    sections: [
      {
        heading: 'Why speed of reply decides the sale',
        body: [
          'In direct-message channels, intent is highest in the first few minutes. A customer who messages "is this available?" at 11pm is ready to buy now — but if the first reply lands the next morning, the moment, and often the sale, is gone.',
          'Most businesses are not losing sales to competitors with better products. They are losing them to unanswered or late-answered messages. Closing that gap is the single highest-leverage thing an AI agent does.',
        ],
      },
      {
        heading: 'What the agent actually does in a conversation',
        body: [
          'A well-built sales agent does not just answer questions — it runs the conversation toward a booking or a sale, the way a good rep would.',
        ],
        bullets: [
          'Replies instantly to every DM and WhatsApp message, day or night',
          'Answers product and pricing questions in your brand voice',
          'Asks qualifying questions and filters out unready leads',
          'Books the call or appointment and syncs it to your calendar',
          'Escalates to a human the moment the customer is ready to buy',
        ],
      },
      {
        heading: 'What results look like in practice',
        body: [
          'In our client work, AI agents have handled around 200 messages a week that previously went unanswered or were answered too late, filtered out roughly three quarters of unqualified leads before a salesperson got involved, and lifted conversion meaningfully by replying instantly instead of after a 30-minute delay.',
          'The pattern is consistent: the agent does not replace your sales team, it makes sure no opportunity is dropped before your team gets to it.',
        ],
      },
      {
        heading: 'How to get one live',
        body: [
          'You do not need to change the channels you sell on. The agent plugs into your existing Instagram, WhatsApp and web chat, is trained on your offer and tone, and connects to your calendar or CRM. A focused build takes about five days from kickoff to production.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can an AI agent reply to Instagram DMs and WhatsApp automatically?',
        answer:
          'Yes. An AI agent connects to your Instagram and WhatsApp and replies to every message instantly, 24/7, in your brand voice, then qualifies the lead and books the call.',
      },
      {
        question: 'Will an AI agent replace my sales team?',
        answer:
          'No. It handles first response, qualification and booking so no lead is dropped, then hands ready-to-buy customers to your team to close.',
      },
      {
        question: 'How fast can a sales agent be deployed?',
        answer:
          'A focused Instagram and WhatsApp sales agent can be built, tested and deployed in about five days.',
      },
    ],
    sources: [
      {
        label: 'Michelangelo Devs — AI agents for business (overview)',
        url: 'https://www.michelangelodevs.com/ai-agents',
      },
      {
        label: 'Michelangelo Devs — ROI calculator',
        url: 'https://www.michelangelodevs.com/roi',
      },
    ],
  },
];

export const ARTICLE_SLUGS = ARTICLES.map((a) => a.slug);
