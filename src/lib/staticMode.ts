/**
 * Static render mode — the flag the prerender pass sets.
 *
 * `scripts/prerender.mjs` loads the built site at `/?static=1` and snapshots
 * `#root`. Under that flag the app must render the plain document: no WebGL,
 * no pinned stage, every section visible at rest. Two hooks read this —
 * `useStageMode` (forced false) and `usePrefersReducedMotion` (forced true) —
 * which together produce exactly that markup with no separate code path to
 * maintain.
 *
 * Guarded for `typeof window` so it is safe to call during render.
 */
export function isStaticRender(): boolean {
  if (typeof window === 'undefined') return true
  return new URLSearchParams(window.location.search).has('static')
}
