import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { ARTICLES } from './articles.data';

const ORIGIN = 'https://www.michelangelodevs.com';

/** Blog index — lists all articles. Prerendered to static HTML. */
@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-dark-900 text-text-secondary pt-32 pb-24 px-6">
      <div class="max-w-3xl mx-auto">
        <a routerLink="/" class="inline-block mb-8 text-neon-green hover:text-neon-teal transition-colors duration-300">&larr; Michelangelo Devs</a>

        <h1 class="text-3xl md:text-5xl font-bold text-text-primary mb-4">Blog</h1>
        <p class="text-body-lg mb-12">
          Practical guides on AI agents, chatbots and automation for businesses that sell on Instagram, WhatsApp and the web.
        </p>

        <ul class="space-y-10">
          @for (a of articles; track a.slug) {
            <li>
              <a [routerLink]="['/blog', a.slug]" class="group block">
                <h2 class="text-2xl font-semibold text-text-primary group-hover:text-neon-green transition-colors duration-300 mb-2">{{ a.title }}</h2>
                <p class="text-text-tertiary text-sm mb-3">{{ a.datePublished }} · {{ a.readingTime }}</p>
                <p class="leading-relaxed">{{ a.description }}</p>
              </a>
            </li>
          }
        </ul>
      </div>
    </main>
  `,
  styles: [`:host { display: block; }`],
})
export class BlogComponent {
  readonly articles = ARTICLES;
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.apply({
      title: 'Blog — AI Agents, Chatbots & Automation',
      description:
        'Practical guides on AI agents, chatbots and business automation for Instagram, WhatsApp and the web, from the Michelangelo Devs team.',
      keywords: 'ai agents blog, ai automation guides, chatbot guides, instagram automation, whatsapp automation',
      path: '/blog',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        url: `${ORIGIN}/blog`,
        name: 'Michelangelo Devs Blog',
        blogPost: ARTICLES.map((a) => ({
          '@type': 'BlogPosting',
          headline: a.title,
          datePublished: a.datePublished,
          url: `${ORIGIN}/blog/${a.slug}`,
        })),
      },
    });
  }
}
