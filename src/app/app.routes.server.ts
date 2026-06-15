import { RenderMode, ServerRoute } from '@angular/ssr';
import { getArticleSlugs } from './blog/blog.registry';

export const serverRoutes: ServerRoute[] = [
  {
    // Prerender one static page per blog article (T6).
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => getArticleSlugs().map((slug) => ({ slug }))
  },
  {
    // Everything else is prerendered too (static SSG).
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
