# anime.js v4.5.0 — VERIFIED API CONTRACT (follow exactly)

This file is the source of truth. The package `animejs@4.5.0` is installed.
These signatures were verified against the actual installed module exports.
DO NOT write v3 syntax (`anime({ targets, ... })`). v3 is forbidden.

## Imports (all named, from 'animejs')

```ts
import {
  animate, createTimeline, stagger, onScroll, createDraggable,
  createSpring, createScope, svg, text, utils, eases, createTimer,
} from 'animejs'
```

## Core: animate(targets, params)  — TWO arguments

```ts
animate('.box', {
  x: 250,                 // shorthand for translateX
  rotate: '1turn',
  scale: [0.5, 1],        // [from, to]
  opacity: { to: 1, duration: 600 },   // per-property params
  duration: 800,
  delay: stagger(80),     // function-based / stagger delay
  ease: 'outExpo',        // string ease, or createSpring(...)
  loop: true,
  alternate: true,
})
```
- Targets: CSS selector string, Element, NodeList, or array.
- Transforms are individual props: `x, y, rotate, scale, skew`, etc.
- Per-property objects: `{ to, from, duration, ease, delay }`.
- Returns a JSAnimation instance (`.play() .pause() .restart() .seek()`).

## Timeline: createTimeline({ defaults })

```ts
const tl = createTimeline({ defaults: { duration: 750, ease: 'inOutQuad' } })
tl.label('start')
  .add('.a', { x: '15rem' }, 0)
  .add('.b', { x: '15rem' }, 'start')     // at label
  .add('.c', { rotate: '1turn' }, '+=200') // relative
  .add('.d', { opacity: 1 }, '<')          // with previous
```
Position arg: absolute ms `0`, relative `'+=200'`/`'-=200'`, label `'start'`,
`'<'` (with prev start), `'<<'` (after prev). Can take `stagger()`.

## stagger(value, options)

```ts
delay: stagger(80)
delay: stagger(80, { from: 'center', grid: [10, 5] })
x: stagger(['-1rem', '1rem'])             // range with units
delay: stagger(100, { start: 500, ease: 'inOut' })
```

## Scroll: onScroll(params) — pass as a property value or standalone

```ts
// As an animation's autoplay driver (scrubbed to scroll):
animate('.panel', {
  x: ['0%', '-300%'],
  autoplay: onScroll({
    target: '.panel-wrap',
    enter: 'top top',
    leave: 'bottom top',
    sync: 1,            // smooth scrub (number = smoothing)
    // sync: true       // 1:1 scrub
  }),
})

// Standalone observer with callbacks:
onScroll({
  target: '.section',
  enter: 'bottom top', leave: 'top bottom',
  onEnter: () => {}, onLeave: () => {},
  onUpdate: (self) => { self.progress }, // 0..1
})
```

## Draggable: createDraggable(target, params)

```ts
createDraggable('.card', {
  container: '.bounds',
  releaseEase: createSpring({ stiffness: 120, damping: 12 }),
  snap: 50,
  onGrab: () => {}, onRelease: () => {},
})
```

## Spring: createSpring(params) — use as an `ease`

```ts
animate('.box', { y: 200, ease: createSpring({ stiffness: 100, damping: 10, mass: 1 }) })
```

## Text: text.split(target, params) — split into chars/words/lines

```ts
const { chars, words, lines } = text.split('h1', {
  chars: true, words: true, lines: false,
})
animate(chars, { y: ['100%', '0%'], opacity: [0, 1], delay: stagger(30) })
```
(Equivalent named export `split` / `splitText` also exist.)

## SVG: svg.createDrawable / svg.morphTo / svg.createMotionPath

```ts
// Line drawing — animate the returned drawable's "draw" 0..1
const [draw] = svg.createDrawable('path')
animate(draw, { draw: ['0 0', '0 1'], duration: 2000, ease: 'inOutQuad' })

// Morph one path into another
animate('#from', { d: svg.morphTo('#to'), duration: 1000 })

// Motion path — drive an element along a path
const { translateX, translateY, rotate } = svg.createMotionPath('#path')
animate('.car', { translateX, translateY, rotate, duration: 4000, loop: true })
```

## Scope: createScope({ root, mediaQueries }) — responsive + cleanup

```ts
const scope = createScope({ root: containerEl }).add((self) => {
  animate('.x', { rotate: 360, loop: true })
  return () => {/* optional cleanup */}
})
// scope.revert() tears everything down — call in React useEffect cleanup.
```

## utils — utils.$ (query), utils.set, utils.remove, utils.random, utils.clamp, etc.

```ts
utils.set('.box', { opacity: 0 })
const r = utils.random(0, 100)
```

## REACT INTEGRATION RULE (mandatory)
Wrap every anime.js call in `useEffect` (or a `createScope` inside it) and
return cleanup that calls `scope.revert()` or `animation.revert()`. Never run
anime at module top level. Guard scroll/draggable with prefers-reduced-motion.
Run effects against refs, not global selectors, where possible.
