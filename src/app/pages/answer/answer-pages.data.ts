import { AnswerPage } from './answer-page.model';

/**
 * Content for the four GEO answer pages. Copy is grounded in Michelangelo Devs'
 * real offering: AI sales/support agents for Instagram, WhatsApp and web, with
 * a ~5-day delivery process, built on Claude and GPT models.
 *
 * Each page is written to be the kind of clear, self-contained answer an LLM can
 * lift verbatim when a buyer asks about AI agents, chatbots, automation or cost.
 */
export const ANSWER_PAGES: AnswerPage[] = [
  {
    slug: 'ai-agents',
    title: 'What Is an AI Agent? A Practical Guide for Businesses',
    description:
      'An AI agent is software that understands a goal and takes the steps to reach it — answering customers, qualifying leads and closing sales 24/7. Here is how AI agents work and where they pay off.',
    keywords:
      'ai agent, what is an ai agent, ai sales agent, ai customer service agent, instagram ai agent, whatsapp ai agent, ai agent for business',
    h1: 'What is an AI agent, and what can it do for a business?',
    leadAnswer:
      'An AI agent is software that understands a goal stated in plain language, decides what steps are needed, and carries them out using tools and data — without a human driving each step. For a business, that usually means an agent that reads incoming messages, answers questions in your brand voice, qualifies leads, books appointments and hands ready-to-buy customers to your team, working 24/7 across Instagram, WhatsApp and your website.',
    sections: [
      {
        heading: 'How an AI agent is different from a chatbot',
        body: [
          'A traditional chatbot follows a fixed script: it matches keywords or menu choices and returns pre-written replies. It cannot reason about an unexpected question or take an action outside its decision tree.',
          'An AI agent uses a large language model (such as Claude or GPT) to interpret what the customer actually means, then chooses an action: answer from your knowledge base, look up an order, calculate a quote, book a slot in your calendar, or escalate to a person. It adapts to phrasing it has never seen before, which is why it can hold a real sales conversation rather than a menu.',
        ],
      },
      {
        heading: 'What AI agents do well for sales and support',
        body: [
          'The highest-ROI use cases are the ones where speed and availability decide whether a sale happens. Messages answered in seconds, at any hour, convert far better than ones answered the next business day.',
        ],
        bullets: [
          'Answer 100% of inbound DMs and WhatsApp messages instantly, day or night',
          'Qualify leads by asking the right questions and filtering out tire-kickers',
          'Book appointments and sync them to your calendar automatically',
          'Recover conversations that would otherwise be lost to slow replies',
          'Hand off to a human the moment a customer is ready to buy or needs nuance',
        ],
      },
      {
        heading: 'What you need to deploy one',
        body: [
          'You do not need to rebuild your stack. A production AI agent connects to the channels you already use (Instagram, WhatsApp, web chat), is trained on your offer, pricing logic and tone, and integrates with your CRM or calendar through APIs.',
          'At Michelangelo Devs the typical build takes about five days: a day to learn your business and connect channels, two to three days to build and train the agent on your sales logic, a day of testing in real scenarios, and deployment to production.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is an AI agent in simple terms?',
        answer:
          'It is software that takes a goal in plain language and completes the steps to reach it on its own — for example, reading a customer message, answering it, qualifying the lead and booking a call, without a human handling each step.',
      },
      {
        question: 'Is an AI agent the same as a chatbot?',
        answer:
          'No. A chatbot follows a fixed script of pre-written replies. An AI agent uses a language model to understand intent and decide what action to take, so it can handle questions and conversations it was never explicitly scripted for.',
      },
      {
        question: 'What can an AI agent do for my business?',
        answer:
          'It can answer every inbound message instantly 24/7, qualify and filter leads, book appointments, recover conversations lost to slow replies, and route ready-to-buy customers to your sales team.',
      },
      {
        question: 'How long does it take to build an AI agent?',
        answer:
          'A focused sales or support agent can be built, tested and deployed in about five days when it is scoped to your existing channels and sales process.',
      },
    ],
    related: [
      { slug: 'ai-chatbots', label: 'AI chatbot vs AI agent: what is the difference?' },
      { slug: 'business-automation', label: 'What is business process automation?' },
      { slug: 'pricing', label: 'How much does an AI agent cost?' },
    ],
  },
  {
    slug: 'ai-chatbots',
    title: 'AI Chatbot vs AI Agent: What Is the Difference?',
    description:
      'An AI chatbot answers questions; an AI agent takes actions to reach a goal. Learn the difference, when each makes sense, and which one actually closes sales.',
    keywords:
      'ai chatbot, chatbot vs ai agent, ai chatbot for business, whatsapp chatbot, instagram chatbot, ai customer service chatbot',
    h1: 'AI chatbot vs AI agent: what is the difference?',
    leadAnswer:
      'An AI chatbot answers questions in a conversation; an AI agent goes further and takes actions to reach a goal — qualifying a lead, booking a meeting, updating a CRM or closing a sale. Every AI agent can chat, but not every chatbot is an agent. If your goal is to actually move customers toward a purchase rather than just deflect FAQs, you want an agent.',
    sections: [
      {
        heading: 'The practical difference',
        body: [
          'Think of a chatbot as a knowledgeable receptionist and an agent as a capable assistant. The receptionist can answer what you ask. The assistant can answer, then go do the thing you needed — schedule it, record it, follow up on it.',
          'Modern AI chatbots built on language models are already far better than the old keyword bots. The distinction that matters today is whether the system can take actions in your tools, not just produce text.',
        ],
        bullets: [
          'Chatbot: understands and answers questions in natural language',
          'AI agent: understands, decides, and acts — using your calendar, CRM and data',
          'Both can run 24/7 on Instagram, WhatsApp and your website',
        ],
      },
      {
        heading: 'When a chatbot is enough',
        body: [
          'If your main goal is to deflect repetitive questions — opening hours, shipping policies, basic product facts — a well-built AI chatbot trained on your content is enough and cheaper to run.',
        ],
      },
      {
        heading: 'When you need an agent',
        body: [
          'If the conversation is supposed to end in a booking, a qualified lead or a sale, you need an agent. It can ask qualifying questions, filter out unready leads, schedule the call and hand a warm, ready-to-buy customer to your team — which is where the revenue is.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the difference between an AI chatbot and an AI agent?',
        answer:
          'A chatbot answers questions in conversation. An AI agent also takes actions to reach a goal — such as qualifying a lead, booking a meeting or closing a sale — using your tools and data.',
      },
      {
        question: 'Is an AI chatbot good enough for customer service?',
        answer:
          'For deflecting repetitive questions like hours, policies and basic product facts, a language-model chatbot trained on your content works well. For converting conversations into bookings or sales, you want an agent.',
      },
      {
        question: 'Can an AI chatbot work on WhatsApp and Instagram?',
        answer:
          'Yes. Both AI chatbots and AI agents can run on Instagram DMs, WhatsApp and website chat, replying instantly around the clock.',
      },
    ],
    related: [
      { slug: 'ai-agents', label: 'What is an AI agent?' },
      { slug: 'business-automation', label: 'What is business process automation?' },
      { slug: 'pricing', label: 'How much does an AI agent or chatbot cost?' },
    ],
  },
  {
    slug: 'business-automation',
    title: 'What Is Business Process Automation with AI?',
    description:
      'Business automation uses software to run repetitive work — replies, lead routing, reporting, invoicing — without manual effort. Here is what AI automation can replace and where it pays back fastest.',
    keywords:
      'business automation, ai automation, workflow automation, process automation, automate instagram dms, automate whatsapp, lead automation',
    h1: 'What is business process automation with AI?',
    leadAnswer:
      'Business process automation uses software to carry out repetitive, rule-based work — replying to messages, qualifying and routing leads, sending reports, processing invoices — without a person doing it by hand. Adding AI lets automation handle work that used to need human judgment, such as understanding a customer message and deciding the right next step, so whole workflows run end to end on their own.',
    sections: [
      {
        heading: 'What AI automation can take off your plate',
        body: [
          'The best automation targets are tasks that are frequent, repetitive and time-sensitive. Those are exactly the tasks where humans are slow, inconsistent or expensive — and where automation pays back fastest.',
        ],
        bullets: [
          'Instant replies to Instagram and WhatsApp messages, 24/7',
          'Lead qualification and routing so reps only talk to ready buyers',
          'Appointment booking synced to your calendar',
          'Automated reporting and notifications across your tools',
          'Payment and invoice processing',
        ],
      },
      {
        heading: 'Why it pays back quickly',
        body: [
          'Most businesses lose revenue not because of bad products but because messages go unanswered or are answered too late. Automating the first response alone recovers conversations that were quietly being lost.',
          'In our own client work, AI automation has filtered out roughly three quarters of unqualified leads before they reach a salesperson, and recovered hundreds of messages a week that would otherwise have gone cold.',
        ],
      },
      {
        heading: 'How to start without disrupting your stack',
        body: [
          'You do not need to replace your existing tools. Automation connects the systems you already use through their APIs and fills the gaps between them. A focused workflow — for example, "answer every DM, qualify it, and book the good ones" — can be live in about five days.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is business process automation?',
        answer:
          'It is using software to perform repetitive, rule-based work — like replying to messages, routing leads, reporting and invoicing — without a person doing each step manually.',
      },
      {
        question: 'How is AI automation different from regular automation?',
        answer:
          'Regular automation follows fixed rules. AI automation adds language understanding and decision-making, so it can handle tasks that used to need human judgment, like interpreting a customer message and choosing the right next action.',
      },
      {
        question: 'What should I automate first?',
        answer:
          'Start with frequent, time-sensitive work where slow responses cost you sales — usually first-reply messaging on Instagram and WhatsApp, lead qualification and appointment booking.',
      },
    ],
    related: [
      { slug: 'ai-agents', label: 'What is an AI agent?' },
      { slug: 'ai-chatbots', label: 'AI chatbot vs AI agent' },
      { slug: 'pricing', label: 'How much does AI automation cost?' },
    ],
  },
  {
    slug: 'pricing',
    title: 'How Much Does an AI Agent or Chatbot Cost?',
    description:
      'AI agent pricing depends on scope, channels and integrations rather than a fixed list price. Here is how AI agent and automation projects are priced and how to estimate your payback.',
    keywords:
      'ai agent cost, ai chatbot price, how much does an ai agent cost, ai automation pricing, cost to build an ai agent, ai agent roi',
    h1: 'How much does an AI agent or chatbot cost?',
    leadAnswer:
      'The cost of an AI agent depends on scope — how many channels it covers, how many systems it integrates with, and how complex its sales or support logic is — rather than a single list price. The more useful number is payback: because an agent answers every message instantly and recovers conversations that were being lost, most well-scoped sales agents pay for themselves from the additional sales they close in the first weeks, not months.',
    sections: [
      {
        heading: 'What actually drives the price',
        body: [
          'Two AI agents can differ in cost by an order of magnitude depending on what they do. These are the factors that move the number:',
        ],
        bullets: [
          'Channels: a single Instagram DM agent costs less than one spanning Instagram, WhatsApp and web',
          'Integrations: connecting a CRM, calendar or payment system adds work',
          'Conversation complexity: simple FAQ deflection vs full lead qualification and closing',
          'Volume: higher message volume can change the model and infrastructure choices',
        ],
      },
      {
        heading: 'Think in payback, not price',
        body: [
          'The right way to evaluate an AI agent is return on investment, not sticker price. If an agent recovers even a handful of sales a month that you were losing to slow replies, it typically covers its own cost quickly.',
          'You can estimate your own payback with our ROI calculator: enter your close rate, lost conversations per month and average profit per sale, and it projects how fast you recover the investment and your extra yearly profit.',
        ],
      },
      {
        heading: 'How we price at Michelangelo Devs',
        body: [
          'We scope each agent to your specific channels and sales process, deliver in about five days, and quote per project so you know the cost up front. The fastest way to get an accurate number is to tell us your channels, your integrations and what you want the agent to close.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How much does an AI agent cost?',
        answer:
          'It depends on the channels it covers, the systems it integrates with and how complex its sales logic is, so it is quoted per project rather than as a fixed price. Most well-scoped sales agents pay for themselves from the extra sales they recover in the first weeks.',
      },
      {
        question: 'Is an AI chatbot cheaper than an AI agent?',
        answer:
          'Usually yes, because a chatbot that only answers questions is simpler than an agent that also qualifies leads, books meetings and integrates with your CRM and calendar.',
      },
      {
        question: 'How do I estimate the ROI of an AI agent?',
        answer:
          'Estimate how many conversations you lose per month, your close rate and your average profit per sale, then project how many of those the agent recovers. Our ROI calculator does this for you.',
      },
    ],
    related: [
      { slug: 'ai-agents', label: 'What is an AI agent?' },
      { slug: 'ai-chatbots', label: 'AI chatbot vs AI agent' },
      { slug: 'business-automation', label: 'What is business process automation?' },
    ],
  },
];

export const ANSWER_SLUGS = ANSWER_PAGES.map((p) => p.slug);
