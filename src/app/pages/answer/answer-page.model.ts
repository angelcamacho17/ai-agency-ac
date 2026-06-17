/**
 * Data model for GEO "answer pages" — dedicated pages that directly answer the
 * questions buyers ask AI models (ChatGPT, Gemini, Claude) about AI agents,
 * chatbots, automation and pricing.
 *
 * The structure is deliberately Q&A-shaped: a lead answer paragraph (the
 * extractable "answer" an LLM can quote), supporting sections, and an FAQ block
 * that also feeds FAQPage JSON-LD.
 */
export interface AnswerSection {
  heading: string;
  /** Paragraphs of body copy. */
  body: string[];
  /** Optional bullet list rendered after the body. */
  bullets?: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface AnswerPage {
  /** Route path without leading slash, e.g. "ai-agents". */
  slug: string;
  /** <title> text (brand suffix added by SeoService). */
  title: string;
  /** Meta description + og:description. */
  description: string;
  keywords: string;
  /** H1 of the page. */
  h1: string;
  /** The single, quotable lead answer (the GEO "answer"). Appears under H1. */
  leadAnswer: string;
  sections: AnswerSection[];
  faqs: FaqItem[];
  /** Internal links to related answer pages (slug + label). */
  related: { slug: string; label: string }[];
}
