/**
 * Blog content model (T6). Each article is a typed module registered in
 * blog.registry.ts. Body is trusted HTML authored by us (no user input), so it
 * is rendered with [innerHTML]. Frontmatter drives Article JSON-LD, OpenGraph,
 * visible dates, and the sitemap.
 */
export interface ArticleAuthor {
  name: string;
  title: string;
  /** Years of professional experience, shown in the bio (e.g. "8+"). */
  experience: string;
  linkedin: string;
}

export interface Article {
  /** URL slug — must contain the year token per the Article Template. */
  slug: string;
  title: string;
  /** Meta description + list excerpt. */
  description: string;
  /** ISO date (YYYY-MM-DD). */
  datePublished: string;
  /** ISO date (YYYY-MM-DD). */
  dateModified: string;
  author: ArticleAuthor;
  tags: string[];
  /** Optional absolute OG image URL. */
  image?: string;
  /** Trusted HTML body (headings, paragraphs, tables). Authored by us. */
  body: string;
}

/** The single canonical author for Michelangelo Devs articles. */
export const DEFAULT_AUTHOR: ArticleAuthor = {
  name: 'Angel Camacho',
  title: 'Founder & AI Solutions Architect at Michelangelo Devs',
  experience: '10+',
  linkedin: 'https://www.linkedin.com/company/michelangelo.devs',
};
