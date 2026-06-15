import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getArticle } from './blog.registry';
import { Article } from './blog.types';
import { AuthorBioComponent } from './author-bio.component';
import { SeoService, SITE_ORIGIN } from '../services/seo.service';

/** Single article (T6) — dynamic /blog/:slug, prerendered per slug. */
@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterLink, AuthorBioComponent],
  template: `
    @if (article; as a) {
      <div class="min-h-screen bg-dark-900 text-text-secondary pt-32 pb-24 px-6">
        <article class="max-w-3xl mx-auto">
          <a
            routerLink="/blog"
            class="inline-block mb-8 text-neon-green hover:text-neon-teal transition-colors duration-300"
            >&larr; Todos los artículos</a
          >
          <h1 class="text-3xl md:text-5xl font-bold text-text-primary mb-4">{{ a.title }}</h1>
          <p class="text-text-tertiary text-sm mb-2">
            Publicado <time [attr.datetime]="a.datePublished">{{ a.datePublished }}</time>
            · Actualizado <time [attr.datetime]="a.dateModified">{{ a.dateModified }}</time>
            · {{ a.author.name }}
          </p>
          <div class="flex flex-wrap gap-2 mb-10">
            @for (t of a.tags; track t) {
              <span class="text-xs px-2 py-1 rounded bg-white/5 text-text-tertiary">{{ t }}</span>
            }
          </div>

          <div class="article-body space-y-5 text-text-secondary leading-relaxed" [innerHTML]="a.body"></div>

          <app-author-bio [author]="a.author" />
        </article>
      </div>
    } @else {
      <div class="min-h-screen bg-dark-900 text-text-secondary pt-32 pb-24 px-6">
        <div class="max-w-3xl mx-auto">
          <h1 class="text-3xl font-bold text-text-primary mb-4">Artículo no encontrado</h1>
          <a routerLink="/blog" class="text-neon-green hover:text-neon-teal">&larr; Volver al blog</a>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .article-body :is(h2, h3) {
        color: #fff;
        font-weight: 600;
        margin-top: 1.75rem;
      }
      .article-body h2 {
        font-size: 1.5rem;
      }
      .article-body h3 {
        font-size: 1.25rem;
      }
      .article-body p.lead {
        font-size: 1.125rem;
        color: #e5e7eb;
      }
      .article-body table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.25rem 0;
      }
      .article-body :is(th, td) {
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 0.5rem 0.75rem;
        text-align: left;
      }
      .article-body th {
        color: #fff;
      }
      .article-body code {
        background: rgba(255, 255, 255, 0.07);
        padding: 0.1rem 0.35rem;
        border-radius: 0.25rem;
      }
      .article-body a {
        color: rgb(var(--brand-rgb));
      }
    `,
  ],
})
export class BlogPostComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  readonly article: Article | undefined;

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.article = getArticle(slug);
    if (this.article) this.applySeo(this.article);
  }

  private applySeo(a: Article): void {
    const url = `${SITE_ORIGIN}/blog/${a.slug}`;
    this.seo.setPage({
      title: `${a.title} | Michelangelo Devs`,
      description: a.description,
      path: `/blog/${a.slug}`,
      image: a.image,
    });
    this.seo.setJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: a.title,
        description: a.description,
        datePublished: a.datePublished,
        dateModified: a.dateModified,
        author: {
          '@type': 'Person',
          name: a.author.name,
          jobTitle: a.author.title,
          url: a.author.linkedin,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Michelangelo Devs',
          url: SITE_ORIGIN,
          logo: `${SITE_ORIGIN}/logo_white.png`,
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        keywords: a.tags.join(', '),
      },
    ]);
  }
}
