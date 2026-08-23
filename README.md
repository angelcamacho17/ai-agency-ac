# Michelangelo - AI agents landing page

Landing page for Michelangelo Devs, an AI agents agency. A horizontal journey
(one full-viewport chapter at a time, panned by the scrollbar) through what we
build, how, and for whom, then a vertical close with the FAQ and an Instagram
call to action.

## Stack

- **Vite + React + TypeScript**
- **anime.js v4** - the scroll-synced horizontal track and chapter reveals
- **Tailwind v4** - brand tokens via `@theme` (black / neo lime / grey, Unbounded + Space Grotesk)
- **@phosphor-icons/react** - icons
- **puppeteer** (dev) - post-build prerender for crawlers

## Structure

| Chapter | File | Job |
|---|---|---|
| Hero | `src/sections/Hero.tsx` | Entity sentence + WhatsApp |
| Capabilities | `src/sections/Capabilities.tsx` | What every agent ships with |
| Agents | `src/sections/Agents.tsx` | The five productised agents |
| Process | `src/sections/Process.tsx` | Five days, four moves |
| Clients | `src/sections/Clients.tsx` | Bento of live agents, Lidotel featured |
| Proof | `src/sections/Proof.tsx` | Production numbers + the client dashboard |
| Questions | `src/sections/Questions.tsx` | FAQ, always open (vertical) |
| FinalCta | `src/sections/FinalCta.tsx` | Instagram close + footer |

- `src/content/offer.ts` is the single source of truth for all copy. It feeds
  the React sections, the JSON-LD graph and `llms.txt`, and is evaluated
  without a TS toolchain by `scripts/seo-data.mjs`, so keep it plain data.
- `src/components/HorizontalTrack.tsx` turns vertical scroll into the
  horizontal pan on `lg+` viewports. Below that, under
  `prefers-reduced-motion`, and during the prerender (`?static=1`) the chapters
  stack as a normal document. `src/lib/chapters.ts#scrollToChapter` makes nav
  anchors work in both modes.
- `src/hooks/useReveal.ts` plays the entrance for `[data-reveal]` elements via
  IntersectionObserver (document flow) or the track's `chapter:enter` event.
- `docs/ANIMEJS_V4_CONTRACT.md` is the verified v4 API reference.

## Conventions

- WhatsApp is the only conversion channel and the number lives in
  `src/lib/whatsapp.ts`. No forms, no mailto, no published prices.
  `scripts/verify-seo.mjs` fails the build if any of that regresses.
- Every anime.js call runs inside `useAnimeScope` and is reverted on unmount.
- Brand accent is `--color-neo`; nothing else gets a colour.

## Run

```bash
npm install
npm run dev      # http://localhost:5173 (or next free port)
npm run build    # tsc + vite + prerender + SEO/GEO gate
```
