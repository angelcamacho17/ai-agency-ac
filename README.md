# Studio Animae — kinetic landing page

An experimental, motion-first landing page for a fictional motion-engineering
studio. The animations *are* the product: every section is a live demo of a
different [anime.js](https://animejs.com) v4 capability.

## Stack

- **Vite + React + TypeScript**
- **anime.js v4.5.0** — the entire motion layer
- **Tailwind v4** — design tokens via `@theme` (warm near-black + acid-lime)
- **@phosphor-icons/react** — icons
- Type: Space Grotesk (display) / JetBrains Mono (technical voice)

## Sections (each showcases a distinct anime.js feature)

| Section | anime.js feature |
|---|---|
| Hero | `splitText` kinetic type + a live-plotted cubic-bezier ease curve |
| Anatomy | `onScroll({ sync })` scrubbing a `createTimeline` of dimension-line reveals |
| Capabilities | `stagger({ grid, from })` entrance + per-cell `svg.createDrawable` line icons |
| Playground | `createDraggable` + `spring` release, live displacement plot (the signature interactive) |
| Process | `createTimeline` orchestrated sequence + self-drawing SVG spine |
| WordBand | continuous translate loop, speed steered by scroll velocity (one marquee) |
| FinalCta | `splitText` line reveal + `svg.createDrawable` signature underline |

## Conventions

- Every anime.js call runs inside `useAnimeScope` (a `createScope` wrapper that
  `revert()`s on unmount). See `src/hooks/useAnimeScope.ts`.
- All motion is guarded by `usePrefersReducedMotion`; reduced motion renders
  every section fully visible and static.
- `docs/ANIMEJS_V4_CONTRACT.md` is the verified v4 API reference (no v3 syntax).

## Run

```bash
npm install
npm run dev      # http://localhost:5173 (or next free port)
npm run build
```
