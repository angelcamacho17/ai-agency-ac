import { animate, stagger } from 'animejs'
import { useAnimeScope } from './useAnimeScope'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { isStaticRender } from '../lib/staticMode'

/**
 * Entrance reveal for a chapter: every [data-reveal] descendant rises in once
 * the chapter is mostly on screen. One IntersectionObserver per chapter, no
 * scroll listeners. Reduced motion and the prerender leave everything at rest.
 *
 * Inside the horizontal track the chapter is never "in view" by the observer's
 * definition (the track translates, the viewport does not scroll over it), so
 * the track dispatches a `chapter:enter` event instead; both paths converge on
 * the same `play`.
 */
export function useReveal<T extends HTMLElement>() {
  const reduce = usePrefersReducedMotion()

  return useAnimeScope<T>((_scope, root) => {
    if (isStaticRender()) return
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!targets.length) return

    let played = false
    const play = () => {
      if (played) return
      played = true
      animate(targets, {
        opacity: [0, 1],
        y: ['1.25rem', '0rem'],
        duration: 900,
        ease: 'outExpo',
        delay: stagger(70),
      })
    }

    root.addEventListener('chapter:enter', play, { once: true })

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          play()
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, !reduce)
}
