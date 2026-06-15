import { Article, DEFAULT_AUTHOR } from '../blog.types';

/**
 * Infrastructure smoke-test article (T6 acceptance). Proves an article renders
 * server-side with valid Article JSON-LD, author bio, and visible dates.
 * Real cornerstone articles (T8–T12) are added as separate content modules.
 */
export const article: Article = {
  slug: 'blog-infrastructure-test-2026',
  title: 'Blog infrastructure test — Michelangelo Devs (2026)',
  description:
    'Internal smoke-test article verifying the Michelangelo Devs blog renders server-side with valid Article schema, author bio, and dates.',
  datePublished: '2026-06-12',
  dateModified: '2026-06-12',
  author: DEFAULT_AUTHOR,
  tags: ['Infrastructure', 'Test'],
  body: `
    <p class="lead">This is a server-rendered test article. If you can read this in the raw HTML response, the Michelangelo Devs blog infrastructure (Task T6) is working: prerendered content, Article JSON-LD, OpenGraph tags, author bio, and visible publish/updated dates.</p>
    <h2>Why does server-rendered content matter?</h2>
    <p>AI answer engines such as ChatGPT, Gemini, and Claude largely do not execute JavaScript when crawling. Content that exists only after client-side hydration is invisible to them. Every Michelangelo Devs article is prerendered to static HTML so the full text is citable.</p>
    <h2>What does this article prove?</h2>
    <p>It confirms the content registry, the dynamic <code>/blog/:slug</code> route, the Article schema generator, and the author-bio component all function end to end. Replace this placeholder with real cornerstone content.</p>
  `,
};
