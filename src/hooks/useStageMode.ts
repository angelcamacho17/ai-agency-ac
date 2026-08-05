import { useEffect, useState } from 'react'
import { isStaticRender } from '../lib/staticMode'

const WIDE = '(min-width: 1024px)'
const REDUCE = '(prefers-reduced-motion: reduce)'

/**
 * True when the landing should run as a pinned transformation stage (scenes
 * dissolve in place, the viewport never travels). Requires a desktop-width
 * viewport (the stage composes copy beside the sculpture's lanes) and full
 * motion; phones and reduced-motion users get the normal document flow.
 *
 * Forced false under `?static=1` so the prerender snapshot captures the plain
 * scrolling document — every chapter in flow, nothing pinned or off-stage.
 */
export function useStageMode(): boolean {
  const [staged, setStaged] = useState(
    () =>
      typeof window !== 'undefined' &&
      !isStaticRender() &&
      window.matchMedia(WIDE).matches &&
      !window.matchMedia(REDUCE).matches,
  )

  useEffect(() => {
    if (isStaticRender()) return
    const wide = window.matchMedia(WIDE)
    const reduce = window.matchMedia(REDUCE)
    const update = () => setStaged(wide.matches && !reduce.matches)
    wide.addEventListener('change', update)
    reduce.addEventListener('change', update)
    return () => {
      wide.removeEventListener('change', update)
      reduce.removeEventListener('change', update)
    }
  }, [])

  return staged
}
