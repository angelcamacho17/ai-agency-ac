import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // Home is the scrollable landing — all sections server-rendered from first
    // load so AI crawlers and users can access everything by scrolling (GEO).
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    // The interactive terminal experience moved off the homepage.
    path: 'terminal',
    loadComponent: () => import('./pages/terminal-home/terminal-home.component').then(m => m.TerminalHomeComponent)
  },
  {
    // Keep /classic as an alias for the scrollable landing (back-compat).
    path: 'classic',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'links',
    loadComponent: () => import('./pages/links/links.component').then(m => m.LinksComponent)
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
  // GEO service pages (T7) — one route per service, server-rendered (prerendered).
  {
    path: 'ai-agents',
    loadComponent: () => import('./pages/services/ai-agents.component').then(m => m.AiAgentsComponent)
  },
  {
    path: 'whatsapp-automation',
    loadComponent: () => import('./pages/services/whatsapp-automation.component').then(m => m.WhatsappAutomationComponent)
  },
  {
    path: 'instagram-automation',
    loadComponent: () => import('./pages/services/instagram-automation.component').then(m => m.InstagramAutomationComponent)
  },
  {
    path: 'chatbot-development',
    loadComponent: () => import('./pages/services/chatbot-development.component').then(m => m.ChatbotDevelopmentComponent)
  },
  // Blog (T6)
  {
    path: 'blog',
    loadComponent: () => import('./blog/blog-list.component').then(m => m.BlogListComponent)
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./blog/blog-post.component').then(m => m.BlogPostComponent)
  }
];
