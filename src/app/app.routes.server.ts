import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Per-route render strategy.
 *
 * Content pages that AI crawlers and search engines should read are PRERENDERED
 * to static HTML at build time. The interactive ROI tool (disallowed in
 * robots.txt) falls through to live Server rendering.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'terms', renderMode: RenderMode.Prerender },
  { path: 'privacy', renderMode: RenderMode.Prerender },
  { path: 'blog', renderMode: RenderMode.Prerender },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const { ARTICLE_SLUGS } = await import('./pages/blog/articles.data');
      return ARTICLE_SLUGS.map((slug) => ({ slug }));
    },
  },
  // Interactive / non-indexed routes render live on the server.
  { path: 'roi', renderMode: RenderMode.Server },
  {
    // GEO answer pages — prerender the known slugs to static HTML.
    path: ':slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const { ANSWER_SLUGS } = await import('./pages/answer/answer-pages.data');
      return ANSWER_SLUGS.map((slug) => ({ slug }));
    },
  },
];
