import { useEffect, useRef, type RefObject } from 'react'
import { createScope, type Scope } from 'animejs'

/**
 * Runs anime.js inside a scoped root tied to a ref, and reverts it on unmount.
 * `setup` receives the live anime Scope; register animations there with
 * scope.add(() => { animate(...) }). Everything is auto-cleaned via revert().
 *
 * Pass `enabled = false` (e.g. prefers-reduced-motion) to skip all animation.
 */
export function useAnimeScope<T extends HTMLElement>(
  setup: (scope: Scope, root: T) => void,
  enabled = true,
): RefObject<T | null> {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    if (!enabled || !ref.current) return
    const root = ref.current
    const scope = createScope({ root })
    scope.add(() => setup(scope, root))
    return () => {
      scope.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])
  return ref
}
