import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const ORIGIN = 'https://www.michelangelodevs.com';
const DEFAULT_OG_IMAGE = `${ORIGIN}/assets/og-nebula.jpg`;

export interface SeoConfig {
  /** Full page title (without the brand suffix, which is appended automatically). */
  title: string;
  description: string;
  /** Path beginning with "/" — used to build the canonical URL. */
  path: string;
  /** Optional comma-separated keywords. */
  keywords?: string;
  /** Optional absolute OG image URL. Falls back to the brand nebula image. */
  image?: string;
  /** og:type — "website" (default) or "article". */
  type?: 'website' | 'article';
  /** One or more JSON-LD objects to inject into <head> for this page. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Per-route SEO/GEO metadata.
 *
 * Sets title, description, canonical, Open Graph, Twitter tags and per-page
 * JSON-LD. Runs on the server during prerender so AI crawlers and search
 * engines see correct, page-specific metadata in the static HTML.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  private readonly JSONLD_ID = 'page-jsonld';

  apply(config: SeoConfig): void {
    const fullTitle = `${config.title} | Michelangelo Devs`;
    const url = `${ORIGIN}${config.path}`;
    const image = config.image ?? DEFAULT_OG_IMAGE;
    const type = config.type ?? 'website';

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: config.description });
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonical(url);
    this.setJsonLd(config.jsonLd);
  }

  private setCanonical(url: string): void {
    const head = this.doc.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(data?: Record<string, unknown> | Record<string, unknown>[]): void {
    // Remove any JSON-LD previously injected by this service (client navigation).
    this.doc.head
      .querySelectorAll(`script[data-seo="${this.JSONLD_ID}"]`)
      .forEach((el) => el.remove());

    if (!data) return;
    const blocks = Array.isArray(data) ? data : [data];
    for (const block of blocks) {
      const script = this.doc.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-seo', this.JSONLD_ID);
      script.textContent = JSON.stringify(block);
      this.doc.head.appendChild(script);
    }
  }
}
