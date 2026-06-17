import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'es' | 'en';
const SUPPORTED: Lang[] = ['es', 'en'];
const STORAGE_KEY = 'mdevs.lang';
const DEFAULT_LANG: Lang = 'es';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly current = signal<Lang>(DEFAULT_LANG);

  init(): void {
    this.translate.addLangs(SUPPORTED);
    this.translate.setFallbackLang(DEFAULT_LANG);

    // On the server the language can't be detected from localStorage/navigator,
    // so we render the default language. Its translations are provided by the
    // server-side in-memory loader (resolves synchronously, no HTTP), so this is
    // safe during prerender. The real language is detected & loaded on the client.
    const initial = this.isBrowser ? this.detect() : DEFAULT_LANG;
    this.use(initial);
  }

  use(lang: Lang): void {
    this.translate.use(lang);
    this.current.set(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }

  toggle(): void {
    this.use(this.current() === 'es' ? 'en' : 'es');
  }

  private detect(): Lang {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'es' || saved === 'en') return saved;
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
      const code = navigator.language.slice(0, 2).toLowerCase();
      if (code === 'en') return 'en';
      if (code === 'es') return 'es';
    }
    return DEFAULT_LANG;
  }
}
