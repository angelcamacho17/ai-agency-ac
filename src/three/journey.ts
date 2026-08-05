import { useEffect, useRef, type MutableRefObject } from 'react'

export type JourneyRefs = {
  /** 0..4 chapter value: holds at integers inside sections, sweeps across gaps. */
  journey: MutableRefObject<number>
  /** 0..1: 1 while a text-heavy section owns the viewport (particles recede). */
  dim: MutableRefObject<number>
}

/**
 * Scroll -> sculpture-journey mapping, exposed as refs the R3F frame loop
 * reads without React re-renders.
 *
 * The page places four `[data-morph-gap]` "stage" elements between content
 * sections. Each morph (state i -> i+1) plays exactly while its gap crosses
 * the viewport, so transformations always happen on an open stage and the
 * object rests in a chapter shape while its section is being read.
 * `[data-dim-zone]` wrappers mark the sections where copy needs to win over
 * the particles; on desktop (>= 1024px) the sculpture rides its own lane
 * beside the copy, nothing overlaps it, and the dim never engages.
 */
export function useJourney(): JourneyRefs {
  const journey = useRef(0)
  const dim = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    type Zone = { top: number; bottom: number }
    let gaps: Zone[] = []
    let dimZones: Zone[] = []
    let targetJourney = 0
    let targetDim = 0

    const measure = () => {
      const y = window.scrollY
      const toZone = (el: Element): Zone => {
        const r = el.getBoundingClientRect()
        return { top: r.top + y, bottom: r.bottom + y }
      }
      gaps = Array.from(document.querySelectorAll('[data-morph-gap]')).map(toZone)
      dimZones = Array.from(document.querySelectorAll('[data-dim-zone]')).map(toZone)
      read()
    }

    const read = () => {
      const vh = window.innerHeight
      const y = window.scrollY
      // A morph starts as its gap's top passes 85% of the viewport and
      // completes as its bottom reaches 15%, stretching each transformation
      // across the gap's full journey through the screen.
      // Gaps are sequential, so the journey is the sum of each gap's own
      // 0..1 progress: 0 before gap0, i inside section i, i+t crossing gap i.
      let j = 0
      for (const g of gaps) {
        const span = g.bottom - g.top + vh * 0.7
        const t = span > 0 ? (y + vh * 0.85 - g.top) / span : 1
        j += Math.min(1, Math.max(0, t))
      }
      targetJourney = j

      // Dim only matters on stacked layouts, where copy sits over the object.
      const stacked = window.innerWidth < 1024
      const center = y + vh * 0.5
      targetDim =
        stacked && dimZones.some((z) => center > z.top && center < z.bottom)
          ? 1
          : 0
    }

    measure()

    let raf = 0
    const tick = () => {
      const kj = reduce ? 1 : 0.075
      const kd = reduce ? 1 : 0.06
      journey.current += (targetJourney - journey.current) * kj
      dim.current += (targetDim - dim.current) * kd
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
      ro.disconnect()
    }
  }, [])

  return { journey, dim }
}
