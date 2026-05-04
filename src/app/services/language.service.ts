import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'es' | 'en';
const SUPPORTED: Lang[] = ['es', 'en'];
const STORAGE_KEY = 'mdevs.lang';
const DEFAULT_LANG: Lang = 'es';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  readonly current = signal<Lang>(DEFAULT_LANG);

  init(): void {
    this.translate.addLangs(SUPPORTED);
    this.translate.setFallbackLang(DEFAULT_LANG);

    const initial = this.detect();
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
