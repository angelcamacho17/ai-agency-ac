import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

const SITE = 'https://www.michelangelodevs.com';

export interface PageSeo {
  /** Full <title>. Should contain "Michelangelo Devs". */
  title: string;
  /** Meta description (<= ~160 chars). */
  description: string;
  /** Absolute path, e.g. "/ai-agents". Used for canonical + og:url. */
  path: string;
  /** Optional OG image absolute URL. */
  image?: string;
}

/**
 * Per-route SEO: sets <title>, description, canonical, OpenGraph/Twitter, and
 * injects one or more JSON-LD blocks into <head>. Works during SSR/prerender so
 * AI crawlers see real metadata in the raw HTML.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private injectedLd: HTMLScriptElement[] = [];

  /** Apply page metadata + canonical + OG/Twitter. */
  setPage(seo: PageSeo): void {
    const url = SITE + seo.path;
    const image = seo.image ?? `${SITE}/assets/og-nebula.jpg`;

    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });

    this.setCanonical(url);

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:image', content: image });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
  }

  /** Replace all JSON-LD blocks this service previously injected with `blocks`. */
  setJsonLd(blocks: Record<string, unknown>[]): void {
    this.clearJsonLd();
    for (const block of blocks) {
      const script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-ld', '');
      script.textContent = JSON.stringify(block);
      this.doc.head.appendChild(script);
      this.injectedLd.push(script);
    }
  }

  clearJsonLd(): void {
    for (const s of this.injectedLd) s.remove();
    this.injectedLd = [];
  }

  private setCanonical(url: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}

/** Canonical site origin, for building absolute URLs in schema. */
export const SITE_ORIGIN = SITE;
