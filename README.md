# Michelangelo Devs - AI agents landing page

An experimental landing page for Michelangelo Devs, an AI agents agency. A
single 3D sculpture morphs from a rough chiseled stone block into a refined,
metallic form as you scroll ("we sculpt AI agents"), over a kinetic
[anime.js](https://animejs.com) v4 content layer.

## Stack

- **Vite + React + TypeScript**
- **three.js + @react-three/fiber + drei + postprocessing** - the scroll-morphing 3D sculpture
- **anime.js v4.5.0** - the kinetic content layer (split type, draggable, scroll timelines, SVG draw)
- **Tailwind v4** - design tokens via `@theme` (warm near-black + acid-lime)
- **@phosphor-icons/react** - icons

## The 3D sculpture

A shader-displaced icosphere reads the document scroll progress every frame
(via a ref, no React re-renders) and transforms continuously: chisel/facet
amplitude falls off while fine detail grows, and the material lerps from matte
marble to a glowing metallic sheen. See `src/three/Sculpture.tsx` and
`src/three/SculptureCanvas.tsx`. The WebGL chunk is code-split and lazy-loaded
so the hero copy paints first; the whole thing collapses to a static frame
under `prefers-reduced-motion`.
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
