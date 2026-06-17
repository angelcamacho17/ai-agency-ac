import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { ANSWER_PAGES } from './answer-pages.data';
import { AnswerPage } from './answer-page.model';

const ORIGIN = 'https://www.michelangelodevs.com';

/**
 * Renders a single GEO answer page from ANSWER_PAGES, keyed by the :slug route
 * param (bound via withComponentInputBinding). Prerendered to static HTML so the
 * full Q&A text and FAQPage JSON-LD are extractable by AI crawlers.
 */
@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (page(); as p) {
      <main class="min-h-screen bg-dark-900 text-text-secondary pt-32 pb-24 px-6">
        <article class="max-w-3xl mx-auto">
          <a routerLink="/" class="inline-block mb-8 text-neon-green hover:text-neon-teal transition-colors duration-300">&larr; Michelangelo Devs</a>

          <h1 class="text-3xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">{{ p.h1 }}</h1>

          <p class="text-body-lg text-text-secondary mb-12 leading-relaxed border-l-2 border-neon-green pl-5">
            {{ p.leadAnswer }}
          </p>

          @for (section of p.sections; track section.heading) {
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
              @for (faq of p.faqs; track faq.question) {
                <div>
                  <h3 class="text-lg font-semibold text-text-primary mb-2">{{ faq.question }}</h3>
                  <p class="leading-relaxed">{{ faq.answer }}</p>
                </div>
              }
            </div>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-text-primary mb-4">Related</h2>
            <ul class="space-y-2">
              @for (r of p.related; track r.slug) {
                <li>
                  <a [routerLink]="['/', r.slug]" class="text-neon-green hover:text-neon-teal transition-colors duration-300">{{ r.label }}</a>
                </li>
              }
              <li>
                <a routerLink="/blog" class="text-neon-green hover:text-neon-teal transition-colors duration-300">Read the blog</a>
              </li>
            </ul>
          </section>

          <div class="mt-16 p-8 rounded-2xl glassmorphism-card text-center">
            <p class="text-text-primary text-xl font-semibold mb-2">Want an AI agent built for your business?</p>
            <p class="mb-6">We design, build and deploy in about five days.</p>
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
export class AnswerComponent {
  /** Bound from the :slug route param via withComponentInputBinding. */
  readonly slug = input.required<string>();

  private readonly seo = inject(SeoService);

  readonly page = computed<AnswerPage | undefined>(() => {
    const p = ANSWER_PAGES.find((a) => a.slug === this.slug());
    if (p) this.applySeo(p);
    return p;
  });

  private applySeo(p: AnswerPage): void {
    this.seo.apply({
      title: p.title,
      description: p.description,
      keywords: p.keywords,
      path: `/${p.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        url: `${ORIGIN}/${p.slug}`,
        name: p.title,
        mainEntity: p.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    });
  }
}
