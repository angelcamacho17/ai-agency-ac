import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { isStaticRender } from '../lib/staticMode'

const STEP = 34 // grid pitch in px
const TRAIL = 28 // remembered cursor positions
const RADIUS = 150 // glow radius in px

type Point = { x: number; y: number; t: number }

/**
 * Retro dot-matrix field behind the page. Dots sit dim until the cursor
 * passes; each remembered position leaves a lime stain that cools down over
 * a second or so, so the pointer writes a fading trail across the grid.
 * Fixed, non-interactive, one canvas, no React state per frame. Off under
 * reduced motion and in the prerender.
 */
export function CursorField() {
  const reduce = usePrefersReducedMotion()
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (reduce || isStaticRender() || !ref.current) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const trail: Point[] = []
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let last = performance.now()
    let idle = 0

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (e: PointerEvent) => {
      const head = trail[trail.length - 1]
      // Subsample so a fast sweep still leaves an evenly spaced trail.
      if (head && Math.hypot(e.clientX - head.x, e.clientY - head.y) < 10) return
      trail.push({ x: e.clientX, y: e.clientY, t: performance.now() })
      if (trail.length > TRAIL) trail.shift()
      idle = 0
    }

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      const dt = now - last
      last = now
      idle += dt
      // Nothing warm on screen: keep the grid but stop repainting.
      if (idle > 1600 && trail.length === 0) return
      while (trail.length && now - trail[0].t > 1400) trail.shift()

      ctx.clearRect(0, 0, w, h)
      const ox = (w % STEP) / 2
      const oy = (h % STEP) / 2
      for (let y = oy; y < h; y += STEP) {
        for (let x = ox; x < w; x += STEP) {
          let heat = 0
          for (let i = 0; i < trail.length; i++) {
            const p = trail[i]
            const d = Math.hypot(p.x - x, p.y - y)
            if (d > RADIUS) continue
            const age = 1 - (now - p.t) / 1400
            heat = Math.max(heat, (1 - d / RADIUS) * age)
          }
          if (heat <= 0.01) {
            ctx.fillStyle = 'rgba(243,243,238,0.07)'
            ctx.fillRect(x - 0.5, y - 0.5, 1, 1)
          } else {
            const r = 1 + heat * 2.2
            ctx.fillStyle = `rgba(212,224,74,${0.12 + heat * 0.85})`
            ctx.beginPath()
            ctx.arc(x, y, r, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduce])

  if (reduce || isStaticRender()) return null
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />
}
