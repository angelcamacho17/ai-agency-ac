import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import esTranslations from '../../../public/i18n/es.json';
import enTranslations from '../../../public/i18n/en.json';

/**
 * SSR/prerender translation loader.
 *
 * On the server there is no HTTP origin to fetch `/i18n/*.json` from, and the
 * default HttpClient-based loader rejects (with a non-Error event object) during
 * build-time route extraction. This loader resolves translations synchronously
 * from the bundled JSON so prerendered HTML contains real, extractable copy.
 *
 * Only included in the server bundle — the browser keeps using the HTTP loader.
 */
export class ServerTranslateLoader implements TranslateLoader {
  private readonly dict: Record<string, TranslationObject> = {
    es: esTranslations as unknown as TranslationObject,
    en: enTranslations as unknown as TranslationObject,
  };

  getTranslation(lang: string): Observable<TranslationObject> {
    return of(this.dict[lang] ?? this.dict['es']);
  }
}
