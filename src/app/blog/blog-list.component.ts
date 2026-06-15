import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ARTICLES } from './blog.registry';
import { SeoService } from '../services/seo.service';

/** Blog index (T6) — lists all articles, server-rendered. */
@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-dark-900 text-text-secondary pt-32 pb-24 px-6">
      <div class="max-w-4xl mx-auto">
        <a
          routerLink="/"
          class="inline-block mb-8 text-neon-green hover:text-neon-teal transition-colors duration-300"
          >&larr; Volver al inicio</a
        >
        <h1 class="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Blog de <span class="text-neon-green">Michelangelo Devs</span>
        </h1>
        <p class="text-text-tertiary mb-12">
          Guías sobre AI agents, automatización de WhatsApp e Instagram, y eCommerce.
        </p>

        <ul class="space-y-8">
          @for (a of articles; track a.slug) {
            <li class="border-b border-white/10 pb-8">
              <a [routerLink]="['/blog', a.slug]" class="group block">
                <h2
                  class="text-xl md:text-2xl font-semibold text-text-primary group-hover:text-neon-green transition-colors"
                >
                  {{ a.title }}
                </h2>
                <p class="text-text-secondary mt-2">{{ a.description }}</p>
                <p class="text-text-tertiary text-sm mt-2">
                  <time [attr.datetime]="a.datePublished">{{ a.datePublished }}</time>
                  · {{ a.author.name }}
                </p>
              </a>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
})
export class BlogListComponent {
  readonly articles = ARTICLES;

  constructor() {
    inject(SeoService).setPage({
      title: 'Blog | Michelangelo Devs — AI Agents & Automation',
      description:
        'Guías de Michelangelo Devs sobre AI agents, automatización de WhatsApp e Instagram, chatbots y eCommerce.',
      path: '/blog',
    });
  }
}
