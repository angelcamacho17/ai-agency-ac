import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

// SSR/prerender safety net: some components schedule/cancel animation frames in
// their lifecycle teardown. These globals don't exist in the Node prerender
// environment, so provide inert no-ops to keep prerendering from crashing.
// (Components still guard real browser work behind isPlatformBrowser.)
const g = globalThis as unknown as Record<string, unknown>;
if (typeof g['requestAnimationFrame'] === 'undefined') {
  g['requestAnimationFrame'] = (cb: (t: number) => void): number => {
    void cb;
    return 0;
  };
}
if (typeof g['cancelAnimationFrame'] === 'undefined') {
  g['cancelAnimationFrame'] = (id: number): void => {
    void id;
  };
}

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;
