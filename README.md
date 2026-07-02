# Michelangelo Devs - AI agents landing page

An experimental landing page for Michelangelo Devs, an AI agents agency. A
single centered particle sculpture (~42k GPU particles) morphs through five
brand states as you scroll ("we sculpt AI agents"), over a kinetic
[anime.js](https://animejs.com) v4 content layer.

## Stack

- **Vite + React + TypeScript**
- **three.js + @react-three/fiber + drei + postprocessing** - the scroll-morphing 3D sculpture
- **anime.js v4.5.0** - the kinetic content layer (split type, draggable, scroll timelines, SVG draw)
- **Tailwind v4** - design tokens via `@theme` (warm near-black + acid-lime)
- **@phosphor-icons/react** - icons

## The 3D sculpture: five states of an agent

One particle system (a single draw call) morphs between five sampled point
clouds, each a chapter of the brand story:

| State | Shape | Chapter |
|---|---|---|
| Raw block | chiseled marble block | Hero: raw material |
| The core | carved sphere + orbital rings | Anatomy: structure, precision |
| The swarm | nucleus + six satellites | Capabilities: every channel, one brain |
| The stream | continuous torus knot | Process: the pipeline, always moving |
| The mark | extruded chrome "M" | Final CTA: the finished sculpture |

Each transformation plays on an open `[data-morph-gap]` stage between sections
(`src/three/journey.ts` maps scroll to a 0..4 journey value read per frame via
refs, no React re-renders). The vertex shader staggers each particle with a
back-out ease and a vortex swirl mid-flight; spark particles stay acid-lime in
every chapter and the "M" settles facing the camera. See
`src/three/targets.ts`, `src/three/Sculpture.tsx`,
`src/three/SculptureCanvas.tsx`. The WebGL chunk is code-split and
lazy-loaded so the hero copy paints first; the whole thing collapses to a
static frame under `prefers-reduced-motion`.
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
