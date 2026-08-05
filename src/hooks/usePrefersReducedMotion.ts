import { useEffect, useState } from 'react'
import { isStaticRender } from '../lib/staticMode'

const REDUCE = '(prefers-reduced-motion: reduce)'

/**
 * True when the user has requested reduced motion.
 *
 * The initial value is read lazily during the FIRST render, not in an effect.
 * That ordering is load-bearing: sections call `birthReveal` (which sets
 * `opacity: 0` on every [data-birth] element) from the animated branch. If
 * this hook started at `false` and corrected in an effect, the animated branch
 * would mount and hide the copy before the correction landed — reduced-motion
 * users would get a blank page, and so would a prerender snapshot.
 *
 * The prerender pass (`?static=1`) forces this true so the snapshot captures
 * every section at rest, fully visible.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(
    () =>
      typeof window === 'undefined' ||
      isStaticRender() ||
      window.matchMedia(REDUCE).matches,
  )

  useEffect(() => {
    if (isStaticRender()) return
    const mq = window.matchMedia(REDUCE)
    setReduce(mq.matches)
    const on = () => setReduce(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  return reduce
}
