# GEO Audit — michelangelodevs.com (T0)

**Date:** 2026-06-12
**Auditor:** Claude Code
**Status:** SPA problem CONFIRMED. T1 (server-rendered HTML) blocks all of Phase 2.

---

## 1. Stack

| Concern | Finding |
|---|---|
| Framework | **Angular 21** (standalone components, App Router via `@angular/router`). NOT React. |
| Build system | `@angular/build:application` (esbuild), output `dist/ai-agency-ac/browser/` |
| Rendering | **Client-side only.** Built `index.html` body is `<app-root></app-root>` — no server-rendered content. |
| Server | Custom **Express** server (`server.js`, 605 lines) — serves static `dist`, hosts a live Anthropic agent API (`/api/agent`), usage limiting, SQLite (`better-sqlite3`) counters. |
| LLM | `@anthropic-ai/sdk`, model `claude-haiku-4-5` (env `ANTHROPIC_MODEL`). |
| i18n | `@ngx-translate` — `public/i18n/{en,es}.json`. Default lang `es`. |
| Styling | Tailwind 3 + SCSS. |
| Hosting | **Render** (web service, free plan). `render.yaml`: `npm ci && npm run build` → `node server.js`. NOT static, NOT Vercel. |

## 2. SPA problem — CONFIRMED

- `dist/ai-agency-ac/browser/index.html` body = `<app-root></app-root>`. No `<h1>`/`<p>` content in raw HTML.
- `server.js:599` SPA fallback `app.get('/{*splat}')` sends that same empty `index.html` for every non-API route.
- **All page copy is rendered client-side.** AI crawlers (GPTBot, ClaudeBot, etc.) that don't execute JS see an empty shell. This is exactly the audit's golden-rule blocker.

## 3. Route inventory (`src/app/app.routes.ts`)

| Path | Component | In sitemap? |
|---|---|---|
| `/` | TerminalHomeComponent (the live terminal landing) | ✅ |
| `/classic` | HomeComponent (classic landing) | ❌ |
| `/links` | LinksComponent | ❌ |
| `/terms` | TermsComponent | ✅ |
| `/privacy` | PrivacyComponent | ✅ |
| `/roi` | RoiComponent | ❌ (and `Disallow: /roi` in robots) |

## 4. Current meta / schema (`src/index.html`)

- Static `<title>`, description, OG, Twitter, canonical — all good, all on the homepage only (single index.html, so every route shares them).
- Organization JSON-LD already present (name `Michelangelo Devs` ✅, with `sameAs` Instagram + LinkedIn, contactPoint).
- `public/robots.txt`: single `User-agent: *` block — **does NOT name the 8 AI crawlers** (T2 work).
- `public/sitemap.xml`: only 3 of 6 routes, hand-maintained, stale `lastmod` 2026-04-06.

## 5. Chosen migration path for T1 — DIVERGES FROM PLAN

**Plan recommends Next.js. I recommend AGAINST a Next.js rewrite. Use Angular's native SSR/prerender instead (`@angular/ssr`).**

Why diverge:
- The plan assumed a React SPA. This is Angular 21 with a **substantial custom Express backend** (live agent, rate limiting, SQLite, CSP) that is working production code. A Next.js migration means rewriting both the Angular frontend *and* re-homing the Express agent into Next route handlers — high risk, weeks of work, for zero GEO benefit over the Angular-native option.
- Angular 21 ships first-class SSR + **build-time prerendering (SSG)** via `@angular/ssr`, which integrates directly with the **existing Express server** (`CommonEngine` / `AngularNodeAppEngine`). The content pages we add in Phase 2 are static marketing/blog pages — perfect for prerender.
- File-based-routing / Metadata-API / sitemap concerns the plan attributes to Next are all solvable in Angular: route-level `title`/`meta` via `Title`/`Meta` services or route `data`, and a generated sitemap.

**Path:** Add `@angular/ssr` with **prerendering (SSG)** for all content routes; keep the Express server as the host (it already serves dist and the agent API — we swap the static-only handler for the Angular SSR/prerender output). Interactive widgets (terminal, ROI calc) stay client components and hydrate. Blog (Phase 2) uses Angular routes generated from MDX/Markdown content files + a `getPrerenderParams` for `/blog/[slug]`.

> **DECISION NEEDED FROM ANDRES:** Approve the Angular-native SSR/SSG path (recommended) vs. a full Next.js migration per the literal plan. I recommend Angular-native. Everything downstream (T1 implementation) depends on this.

## 6. Acceptance (T0)

✅ `geo/AUDIT.md` exists with stack, hosting, route inventory, current meta, and chosen path.

---

## 7. Implementation status (updated 2026-06-12)

**Path approved by Andres:** Angular-native SSR/SSG (NOT Next.js).

### T1 — Migrate to SSR/SSG (Angular prerender) — ✅ DONE
- Added `@angular/ssr` + `@angular/platform-server` (21.0.x, matched to core).
- `angular.json`: `outputMode: "static"` + `server: src/main.server.ts` → build **prerenders all routes to static HTML** under `dist/ai-agency-ac/browser/<route>/index.html`. Deleted the generated `src/server.ts`; the existing Express `server.js` stays the host.
- `src/app/app.routes.server.ts`: `**` → `RenderMode.Prerender`.
- `app.config.ts`: enabled `provideClientHydration(withEventReplay())`, switched `provideHttpClient(withFetch())`, **removed `withHashLocation()`** (hash routing is incompatible with per-route SSG and uncrawlable). Routes are now clean paths.
- SSR-safety: guarded browser-only APIs behind `isPlatformBrowser` in cursor/scroll-reveal directives, particles, stats (final counter values rendered server-side), process, hands-scroll. Added inert `requestAnimationFrame`/`cancelAnimationFrame` shims in `main.server.ts` for prerender teardown.
- `server.js`: `express.static(..., { redirect:false })` + route handler serves prerendered `<route>/index.html` at the clean URL (no 301 redirects).
- **Acceptance (local, port 4321): PASS** — `curl /` returns "Michelangelo Devs" from raw HTML; all 6 routes HTTP 200 with full server-rendered content; `curl /sitemap.xml` returns 6 routes.

### T2 — robots.txt for AI crawlers — ✅ DONE
- `public/robots.txt`: 8 independent `Allow: /` blocks (OAI-SearchBot, ChatGPT-User, GPTBot, Claude-SearchBot, Claude-User, ClaudeBot, Googlebot, Google-Extended) + wildcard + Sitemap. `/roi` now allowed (per Andres). **Acceptance: PASS** (8 UAs).

### T3 — Organization JSON-LD — ✅ DONE
- `src/index.html`: added required `description` + `serviceType[]` to existing Organization schema (kept logo/sameAs/contactPoint). Validate at search.google.com/test/rich-results after deploy.
- Also added (T4 prep) a commented `google-site-verification` meta slot for Andres.

### Tests
- `npm test`: green (updated `app.spec.ts` — nav is hidden on `/` by design).

## 8. Phase 2 status (updated 2026-06-12)

### T6 — Blog infrastructure — ✅ DONE
- Content model in `src/app/blog/blog.types.ts` (frontmatter: title, description, datePublished, dateModified, author, tags, body HTML). Registry `blog.registry.ts`.
- Routes: `/blog` (list) + `/blog/:slug` (post). Dynamic route prerendered per slug via `getPrerenderParams` in `app.routes.server.ts`.
- Per-article Article JSON-LD (Person author + Organization publisher + dates), OpenGraph, canonical via `SeoService` (`src/app/services/seo.service.ts`).
- `AuthorBioComponent` (full name, title, years, LinkedIn) on every article. Visible publish + "last updated" dates.
- Test article `blog-infrastructure-test-2026` proves it. **Acceptance: PASS** — prerenders with valid Article schema (Person author, datePublished/dateModified), author bio, visible dates; blog index lists it. (Test article intentionally NOT in sitemap.)
- **Author = Angel Camacho, "Founder & AI Solutions Architect", 10+ yrs** (from facts.private.js, not the plan's placeholder name).

### T7 — Four service pages — ✅ DONE (pending [REAL-METRIC] fill by Andres)
- `/ai-agents`, `/whatsapp-automation`, `/instagram-automation`, `/chatbot-development` — standalone components in `src/app/pages/services/`, each: ≤60-word direct-answer lead, question/claim H2s, real stack (n8n, Claude, Supabase, Meta Graph/WhatsApp Cloud/Evolution API, Redis debouncing), WhatsApp CTA (wa.me/584125671953), Service JSON-LD, per-page meta title with "Michelangelo Devs". Added to sitemap (priority 0.9).
- **Acceptance: PASS** — all 4 serve HTTP 200 with full content, no JS, each opens with a direct answer.
- **[REAL-METRIC] placeholders to fill before publish (do NOT publish placeholders):**
  - ai-agents: avg ROI % (×2), avg response time, % conversations automated, conversion lift %
  - whatsapp-automation: conversations/day, avg response time, % tickets deflected, active clients/instances
  - instagram-automation: leads in 30 days, qualified leads/month
  - chatbot-development: % of queries resolved (×2)

Build: 12 routes prerendered, `npm test` green.

## 9. Homepage = scrollable landing + performance (2026-06-15)

**Decision (Andres):** make the scrollable landing the homepage so all content is
server-rendered and accessible by scrolling from first load — the interactive
terminal hid the rich sections behind chat interaction (a crawler saw only the
terminal intro).

- Routes swapped: `/` → `HomeComponent` (scrollable: hero, demo, ROI, work, process, calculator, brands, CTA, footer — all prerendered). Terminal moved to `/terminal`. `/classic` kept as alias.
- `App.showNav()` flipped: global nav shows on `/`, hidden on `/terminal` + `/links`.
- Home prerendered HTML grew 1322 → ~2160 words with real visible headings (QUÉ CONSTRUIMOS, Agentes/Automatizaciones/Aplicaciones, proceso de 5 días, Calculadora de impacto, Marcas que confían incl. Terraccotta). `app.spec.ts` updated.

**Performance investigation ("tarda al cargar"):**
- Server TTFB local ~1–9 ms; JS initial 98 KB gzip; images small. Code is NOT the bottleneck.
- **FIXED — render-blocking fonts:** `styles.scss` had a sequential `@import url(googleapis…)` for Inter+Playfair AND `index.html` separately loaded JetBrains Mono. Consolidated into ONE combined `<link>` in `index.html`; Angular inlines all @font-face into the HTML (no external CSS round-trip). Unused unicode subsets aren't downloaded (unicode-range gates them).
- **FIXED — caching:** `express.static` now sets `Cache-Control: immutable, max-age=1y` on hashed assets and `no-cache` on prerendered HTML.
- **NOT code — likely prod cause:** `render.yaml` is `plan: free`, which sleeps after ~15 min idle; first request cold-starts in 30–50 s. **Recommend: upgrade to Starter ($7/mo) or add an uptime pinger.** This is the most probable "tarda al cargar" in production.

Build: 13 routes prerendered, `npm test` green, all 12 routes serve HTTP 200.

### NOT yet done (next sessions)
- **T4/T5 [HUMAN]**: GSC verify + submit sitemap; Brave Webmaster. Slot prepared.
- T8–T12: 5 cornerstone articles (T11 case study needs real campaign data from Andres).
- T13: FAQ page + FAQPage schema.
- Phase 3–4 (T14–T22): entity kit, profiles, Hackernoon, tracking files.

### Deploy note
`render.yaml` build (`npm ci && npm run build` → `node server.js`) is unchanged and compatible. Verify Render's `npm ci` resolves the new SSR deps — they were installed with `--legacy-peer-deps` locally due to npm's strict peer resolver (installed Angular is uniformly 21.0.7; the conflict is only the registry's "latest 21.x" pull). If Render's `npm ci` fails on peers, add `legacy-peer-deps=true` to an `.npmrc`.
