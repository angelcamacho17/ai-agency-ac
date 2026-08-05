import { animate, onScroll, stagger, utils } from 'animejs'

const layerOf = (el: HTMLElement) =>
  el.closest<HTMLElement>('[data-scene-layer]')

/**
 * Fire `cb` once when the section takes the stage. Inside a SceneStage layer
 * that's the 'scene:enter' event (dispatched as the layer materializes); in
 * normal document flow it falls back to an anime.js scroll trigger.
 */
export function onSectionEnter(
  root: HTMLElement,
  cb: () => void,
  enter = 'bottom-=120 top',
): void {
  const layer = layerOf(root)
  if (layer) {
    if (layer.dataset.sceneEntered) {
      cb()
      return
    }
    layer.addEventListener('scene:enter', () => cb(), { once: true })
    return
  }
  let played = false
  onScroll({
    target: root,
    enter,
    onEnter: () => {
      if (played) return
      played = true
      cb()
    },
  })
}

/**
 * Subscribe to the scene's dwell progress (0 = fully on stage, 1 = about to
 * leave). Returns false outside a SceneStage layer so callers can fall back
 * to a scroll-synced timeline in document flow.
 */
export function onSceneProgress(
  root: HTMLElement,
  cb: (p: number) => void,
): boolean {
  const layer = layerOf(root)
  if (!layer) return false
  layer.addEventListener('scene:progress', (e) =>
    cb((e as CustomEvent<number>).detail),
  )
  return true
}

/**
 * "Born from the object" reveal, shared by every chapter section.
 *
 * `side` is where the sculpture rides for that chapter. The [data-umbilical]
 * hairline grows out of that side first, then every [data-birth] element
 * emerges from the same direction, blur-to-sharp on an outExpo ease, as if
 * the object is extruding the copy onto the page. All motion is horizontal:
 * nothing translates vertically, preserving the fixed-stage illusion.
 *
 * Call inside an active anime scope (useAnimeScope) so it reverts on unmount.
 * Nothing is hidden outside the scope, so reduced-motion renders at rest.
 *
 * CRAWLER SAFETY: the copy ships VISIBLE in markup. We only hide it here, at
 * runtime, in the same function that owns un-hiding it — so a crawler with no
 * JS, a failed chunk, or a thrown error can never leave text at opacity 0.
 * `index.css` carries a `html:not(.jsready)` net for the same reason.
 */
export function birthReveal(root: HTMLElement, side: 'left' | 'right'): void {
  const items = root.querySelectorAll<HTMLElement>('[data-birth]')
  const rules = root.querySelectorAll<HTMLElement>('[data-umbilical]')
  if (items.length === 0 && rules.length === 0) return

  // The reveal parks every item 44px to one side while it waits. Unclipped,
  // that offset widens the document — on a 390px phone it produced 20px of
  // horizontal scroll and pushed copy past the edge. Clip it at the section
  // root so the wait state can never contribute to page width, on any
  // viewport. Set here rather than in markup so it is scoped to sections that
  // actually animate, and reverts with the anime scope.
  root.style.overflowX = 'clip'

  const fromX = side === 'left' ? '-2.75rem' : '2.75rem'
  utils.set(items, { opacity: 0, x: fromX, filter: 'blur(10px)' })
  utils.set(rules, { scaleX: 0 })

  onSectionEnter(root, () => {
    animate(rules, { scaleX: [0, 1], duration: 800, ease: 'inOutQuad' })
    animate(items, {
      opacity: [0, 1],
      x: [fromX, '0rem'],
      filter: ['blur(10px)', 'blur(0px)'],
      delay: stagger(90, { start: 120 }),
      duration: 1000,
      ease: 'outExpo',
    })
  })
}
