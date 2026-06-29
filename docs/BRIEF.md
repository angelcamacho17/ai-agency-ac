# PROJECT BRIEF — "Studio Animae" kinetic landing page

## Design read
Awwwards-experimental landing for a motion-engineering studio, kinetic-type +
SVG-line language, built on Vite + React + TypeScript + Tailwind v4 + anime.js
v4.5.0. Dials: VARIANCE 10 / MOTION 10 / DENSITY 3. The animations are the
product, so motion must be the spine of every section — but every animation is
MOTIVATED (hierarchy / storytelling / feedback / state). No motion for show.

## The brand (invented, premium, not "Acme")
**Studio Animae** — a studio that engineers the *motion layer* of software:
the micro-interactions, transitions and physics that make a product feel alive.
Voice: confident, technical, a little playful. Tagline energy: "We make
software breathe." Avoid filler verbs (elevate/seamless/unleash).

## Theme lock (do not deviate)
- ONE dark theme, warm near-black `--color-ink`, never invert a section.
- ONE accent: `--color-acid` (acid lime). `--color-violet` only for gradient
  depth, never as a second CTA color.
- Type: `font-display` (Space Grotesk) for headings, `font-mono` (JetBrains
  Mono) for technical labels/code, body in Space Grotesk.
- Corner radius: pick soft (rounded-2xl/3xl) and stay consistent.
- Real hyphens only. ZERO em-dashes/en-dashes anywhere visible. Non-negotiable.

## anime.js usage (the whole point — go crazy, stay correct)
Read docs/ANIMEJS_V4_CONTRACT.md. Use v4 API ONLY (`animate(targets, params)`,
`createTimeline`, `stagger`, `onScroll`, `createDraggable`, `createSpring`,
`text.split`, `svg.createDrawable/morphTo/createMotionPath`, `createScope`).
Each section should showcase a DIFFERENT anime.js capability so the page is a
living demo reel of the studio's craft:
- Hero: kinetic type via `text.split` + a morphing/looping SVG mark.
- Capabilities: scroll-scrubbed `onScroll({ sync })` reveals + grid stagger.
- Showcase: SVG line-drawing (`createDrawable`) on scroll.
- Playground: `createDraggable` with `createSpring` release (interactive, FEEDBACK).
- Process / timeline: `createTimeline` orchestrated sequence.
- Marquee (max ONE on page): continuous kinetic word band.

## React rules
- Every anime call inside `useEffect`/`useAnimeScope`; revert on unmount.
- Guard every animation behind prefers-reduced-motion (usePrefersReducedMotion);
  reduced motion = content fully visible, static, no scrub/drag/loop.
- Animate transform/opacity only. No layout-animating top/left/width.
- Components are isolated leaves; no global selectors that leak across sections.

## Shared primitives already built (REUSE, do not recreate)
- `src/index.css` — all tokens + utilities (.acid-glow, .grain, .split-line).
- `src/hooks/usePrefersReducedMotion.ts`
- `src/hooks/useAnimeScope.ts` — scoped anime runner with auto-revert.
- Icons: `@phosphor-icons/react` (the ONLY icon library; one family).

## Anti-slop pre-flight (every section must pass)
Hero fits viewport, headline <=2 lines, subtext <=20 words, 1 primary CTA.
Max 1 eyebrow per 3 sections. No 3 equal feature cards. No fake screenshots
(use real SVG/canvas/anime demos, not div-mocks). No section-number eyebrows,
no scroll cues, no decorative status dots, no locale/weather strips, no version
labels. Distinct layout family per section (>=4 families across the page).
Bento has exact cell count. CTA labels one line, contrast WCAG AA on acid bg
(dark text on acid). Mobile: every multi-col collapses to single col explicitly.

## CTA intent (pick ONE label, use everywhere)
Primary intent = "start a project". Use the label **"Start a build"** in nav,
hero, and final CTA. Do not add "Contact us"/"Let's talk" variants.
