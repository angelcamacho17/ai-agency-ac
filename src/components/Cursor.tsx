import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { isStaticRender } from '../lib/staticMode'

/** Is this computed colour light enough that a lime dot would vanish on it? */
function isLight(c: string): boolean {
  const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/)
  if (!m) return false
  if (m[4] !== undefined && Number(m[4]) < 0.5) return false
  const lum = (0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3]) / 255
  return lum > 0.5
}

/** Walk up from the element under the pointer to the first painted background. */
function onLight(el: Element | null): boolean {
  let node: Element | null = el
  while (node && node !== document.documentElement) {
    const cs = getComputedStyle(node)
    const bg = cs.backgroundColor
    // Masked elements (the client logos) paint their colour through a mask,
    // so their background says nothing about the surface behind them.
    const masked = (cs.maskImage ?? '') !== 'none' || ((cs as { webkitMaskImage?: string }).webkitMaskImage ?? 'none') !== 'none'
    if (!masked && bg && bg !== 'transparent' && !/rgba\(\d+,\s*\d+,\s*\d+,\s*0\)/.test(bg)) return isLight(bg)
    node = node.parentElement
  }
  return false
}

/**
 * The cursor. A dot that reads lime on the dark page and black on lime or
 * any other light surface, sampled from whatever it is hovering; it opens into a ring over
 * links and buttons. Only on fine pointers, never under reduced motion.
 */
export function Cursor() {
  const reduce = usePrefersReducedMotion()
  const [fine, setFine] = useState(false)
  const dot = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const on = () => setFine(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const active = fine && !reduce && !isStaticRender()

  useEffect(() => {
    if (!active || !dot.current) return
    const el = dot.current
    document.documentElement.classList.add('cursor-custom')
    let x = -100
    let y = -100
    let raf = 0
    let dirty = false

    const paint = () => {
      raf = 0
      if (!dirty) return
      dirty = false
      const under = document.elementFromPoint(x, y)
      const dark = onLight(under)
      const link = !!under?.closest('a, button, [role="button"], [role="tab"]')
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      el.dataset.dark = dark ? '1' : ''
      el.dataset.link = link ? '1' : ''
    }
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      dirty = true
      el.style.opacity = '1'
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const leave = () => {
      el.style.opacity = '0'
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('blur', leave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('blur', leave)
      document.documentElement.classList.remove('cursor-custom')
    }
  }, [active])

  if (!active) return null
  return <div ref={dot} aria-hidden="true" className="cursor-dot" />
}
