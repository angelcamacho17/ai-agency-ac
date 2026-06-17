import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { ARTICLES } from './articles.data';
import { Article } from './articles.data';

const ORIGIN = 'https://www.michelangelodevs.com';

/**
 * Renders a single blog article from ARTICLES, keyed by the :slug route param.
 * Prerendered to static HTML with BlogPosting + FAQPage JSON-LD so the full
 * article text is extractable and citable by AI crawlers.
 */
@Component({
  selector: 'app-article',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (article(); as a) {
      <main class="min-h-screen bg-dark-900 text-text-secondary pt-32 pb-24 px-6">
        <article class="max-w-3xl mx-auto">
          <a routerLink="/blog" class="inline-block mb-8 text-neon-green hover:text-neon-teal transition-colors duration-300">&larr; Blog</a>

          <h1 class="text-3xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">{{ a.title }}</h1>
          <p class="text-text-tertiary text-sm mb-8">{{ a.datePublished }} · {{ a.readingTime }} · Michelangelo Devs</p>

          <p class="text-body-lg text-text-secondary mb-12 leading-relaxed border-l-2 border-neon-green pl-5">
            {{ a.keyTakeaway }}
          </p>

          @for (section of a.sections; track section.heading) {
            <section class="mb-12">
              <h2 class="text-2xl font-semibold text-text-primary mb-4">{{ section.heading }}</h2>
              @for (para of section.body; track para) {
                <p class="mb-4 leading-relaxed">{{ para }}</p>
              }
              @if (section.bullets) {
                <ul class="list-disc pl-6 space-y-2 mt-4">
                  @for (b of section.bullets; track b) {
                    <li>{{ b }}</li>
                  }
                </ul>
              }
            </section>
          }

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-text-primary mb-6">Frequently asked questions</h2>
            <div class="space-y-6">
              @for (faq of a.faqs; track faq.question) {
                <div>
                  <h3 class="text-lg font-semibold text-text-primary mb-2">{{ faq.question }}</h3>
                  <p class="leading-relaxed">{{ faq.answer }}</p>
                </div>
              }
            </div>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-text-primary mb-4">Sources &amp; references</h2>
            <ul class="list-disc pl-6 space-y-2">
              @for (s of a.sources; track s.url) {
                <li>
                  <a [href]="s.url" target="_blank" rel="noopener noreferrer"
                     class="text-neon-green hover:text-neon-teal transition-colors duration-300">{{ s.label }}</a>
                </li>
              }
            </ul>
          </section>

          <div class="mt-16 p-8 rounded-2xl glassmorphism-card text-center">
            <p class="text-text-primary text-xl font-semibold mb-2">Want this for your business?</p>
            <p class="mb-6">We build and deploy AI agents in about five days.</p>
            <a href="https://www.instagram.com/michelangelo.devs" target="_blank" rel="noopener noreferrer"
               class="inline-block px-8 py-3 rounded-full bg-neon-green text-dark-950 font-semibold hover:shadow-glow-green transition-shadow duration-300">
              Message us on Instagram
            </a>
          </div>
        </article>
      </main>
    }
  `,
  styles: [`:host { display: block; }`],
})
export class ArticleComponent {
  readonly slug = input.required<string>();
  private readonly seo = inject(SeoService);

  readonly article = computed<Article | undefined>(() => {
    const a = ARTICLES.find((x) => x.slug === this.slug());
    if (a) this.applySeo(a);
    return a;
  });

  private applySeo(a: Article): void {
    const url = `${ORIGIN}/blog/${a.slug}`;
    this.seo.apply({
      title: a.title,
      description: a.description,
      keywords: a.keywords,
      path: `/blog/${a.slug}`,
      type: 'article',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: a.title,
          description: a.description,
          datePublished: a.datePublished,
          url,
          author: { '@type': 'Organization', name: 'Michelangelo Devs', url: ORIGIN },
          publisher: {
            '@type': 'Organization',
            name: 'Michelangelo Devs',
            logo: { '@type': 'ImageObject', url: `${ORIGIN}/logo_white.png` },
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: a.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        },
      ],
    });
  }
}
