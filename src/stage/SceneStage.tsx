import { Fragment, useEffect, useRef, type ReactNode } from 'react'

export type Scene = {
  key: string
  content: ReactNode
  /** Scroll length (in vh) the scene holds the stage before transforming. */
  dwell: number
  /** Anchor id for nav links, placed on this scene's scroll driver. */
  anchor?: string
  /** The sculpture morphs to its next state in the gap after this scene. */
  morphAfter?: boolean
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * The transformation stage: the viewport never travels. One sticky, pinned
 * screen holds every chapter as an absolutely-stacked layer, and an invisible
 * driver rail below provides the scroll length. As the user scrolls, the
 * outgoing chapter dissolves in place (opacity + blur + a breath of scale,
 * never a vertical slide) while the incoming one materializes on the opposite
 * column - so the page reads as one room that keeps reforming, not a page
 * scrolling by.
 *
 * The rail's [data-morph-gap] blocks are the same elements useJourney reads,
 * and both use the same progress window, so content dissolves are frame-locked
 * to the sculpture's morph flights.
 *
 * Layers receive:
 *  - 'scene:enter' (once, as the layer takes the stage) - entrance triggers
 *  - 'scene:progress' (0 fully entered -> 1 about to leave) - dwell scrubs
 */
export function SceneStage({ scenes }: { scenes: Scene[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const layers = Array.from(
      wrap.querySelectorAll<HTMLElement>('[data-scene-layer]'),
    )
    const gapEls = Array.from(
      wrap.querySelectorAll<HTMLElement>('[data-scene-gap]'),
    )

    type Zone = { top: number; bottom: number }
    let zones: Zone[] = []
    const measure = () => {
      const y = window.scrollY
      zones = gapEls.map((el) => {
        const r = el.getBoundingClientRect()
        return { top: r.top + y, bottom: r.bottom + y }
      })
    }
    measure()

    const entered = new Set<number>()
    let raf = 0

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (zones.length === 0) return
      const vh = window.innerHeight
      const y = window.scrollY

      // Same window useJourney maps morphs across: a gap's transition starts
      // as its top passes 85% of the viewport, ends as its bottom reaches 15%.
      const gp = zones.map((z) =>
        clamp01((y + vh * 0.85 - z.top) / (z.bottom - z.top + vh * 0.7)),
      )

      layers.forEach((el, i) => {
        const vIn = i === 0 ? 1 : gp[i - 1]
        const vOut = i === layers.length - 1 ? 0 : gp[i]
        const v = Math.min(vIn, 1 - vOut)
        const o = v * v * (3 - 2 * v)

        el.style.opacity = o.toFixed(3)
        el.style.filter = v >= 0.999 ? 'none' : `blur(${((1 - v) * 14).toFixed(1)}px)`
        el.style.transform =
          v >= 0.999 ? 'none' : `scale(${(0.94 + v * 0.06).toFixed(4)})`
        el.style.visibility = v <= 0.001 ? 'hidden' : 'visible'
        el.style.pointerEvents = v > 0.7 ? 'auto' : 'none'

        if (v > 0.6 && !entered.has(i)) {
          entered.add(i)
          el.dataset.sceneEntered = '1'
          el.dispatchEvent(new CustomEvent('scene:enter'))
        }

        if (v > 0) {
          // Dwell progress: 0 the moment the scene is fully on stage, 1 as
          // its outgoing transition begins. Drives in-scene scrubs.
          const start = i === 0 ? 0 : zones[i - 1].bottom - vh * 0.15
          const end =
            i === layers.length - 1
              ? document.body.scrollHeight - vh
              : zones[i].top - vh * 0.85
          const p = end > start ? clamp01((y - start) / (end - start)) : 1
          el.dispatchEvent(new CustomEvent('scene:progress', { detail: p }))
        }
      })
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      ro.disconnect()
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative">
      {/* The pinned stage: all chapters stacked, dissolving in place. */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {scenes.map((scene, i) => (
          <div
            key={scene.key}
            data-scene-layer={scene.key}
            className="absolute inset-0 flex items-center"
            style={{
              opacity: i === 0 ? 1 : 0,
              visibility: i === 0 ? 'visible' : 'hidden',
              pointerEvents: i === 0 ? 'auto' : 'none',
              willChange: 'opacity, filter, transform',
            }}
          >
            <div className="w-full">{scene.content}</div>
          </div>
        ))}
      </div>

      {/* Invisible driver rail: dwell blocks hold each scene on stage, gap
          blocks time the dissolves (and, when data-morph-gap, the sculpture's
          morphs via useJourney). Anchor ids live here so nav links land each
          scene correctly. */}
      <div aria-hidden="true" className="relative -z-10">
        {scenes.map((scene, i) => (
          <Fragment key={scene.key}>
            <div
              id={scene.anchor}
              data-scene-driver={scene.key}
              style={{ height: `${scene.dwell}vh` }}
            />
            {i < scenes.length - 1 && (
              <div
                data-scene-gap=""
                {...(scene.morphAfter ? { 'data-morph-gap': '' } : {})}
                className="h-[85vh]"
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
