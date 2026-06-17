import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: 'roi',
    loadComponent: () => import('./pages/roi/roi.component').then(m => m.RoiComponent)
  },
  // GEO blog
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent)
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/blog/article.component').then(m => m.ArticleComponent)
  },
  // GEO answer pages (slug-driven). Keep LAST so it doesn't shadow the routes above.
  {
    path: ':slug',
    loadComponent: () => import('./pages/answer/answer.component').then(m => m.AnswerComponent)
  }
];
