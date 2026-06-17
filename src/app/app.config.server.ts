import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { provideTranslateLoader } from '@ngx-translate/core';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { ServerTranslateLoader } from './services/server-translate.loader';

// On the server we swap the HttpClient translation loader for one that resolves
// the bundled JSON synchronously. This prevents the non-Error rejection that
// crashes build-time route extraction, and guarantees prerendered HTML contains
// real, extractable copy for AI crawlers (the plan's "Step 1").
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideTranslateLoader(ServerTranslateLoader),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
