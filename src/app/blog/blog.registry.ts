import { Article } from './blog.types';
import { article as blogInfraTest } from './content/blog-infra-test-2026';

/**
 * Article registry (T6). Register every article here; the list/index page,
 * the dynamic post route's prerender params, and the sitemap all read from it.
 * Newest first.
 */
export const ARTICLES: Article[] = [
  blogInfraTest,
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticleSlugs(): string[] {
  return ARTICLES.map((a) => a.slug);
}
