import { useEffect, useRef, type MutableRefObject } from 'react'

/**
 * Document scroll progress (0..1) exposed as a ref the R3F render loop reads
 * every frame WITHOUT causing React re-renders. A single passive listener +
 * rAF smoothing keeps it cheap. Honors reduced motion by snapping instantly.
 */
export function useScrollProgressRef(): MutableRefObject<number> {
  const target = useRef(0)
  const smooth = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const read = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      target.current = max > 0 ? window.scrollY / max : 0
    }
    read()

    let raf = 0
    const tick = () => {
      // ease the smoothed value toward the target for buttery morphs
      const k = reduce ? 1 : 0.08
      smooth.current += (target.current - smooth.current) * k
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [])

  return smooth
}
