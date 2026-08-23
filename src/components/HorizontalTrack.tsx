import { Children, useEffect, useState, type ReactNode } from 'react'
import { animate, onScroll } from 'animejs'
import { useAnimeScope } from '../hooks/useAnimeScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { isStaticRender } from '../lib/staticMode'

const WIDE = '(min-width: 1024px)'

/** True when the page should pan sideways: wide viewport, motion allowed, not the prerender. */
function useTrackMode(): boolean {
  const reduce = usePrefersReducedMotion()
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(WIDE).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(WIDE)
    const on = () => setWide(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return wide && !reduce && !isStaticRender()
}

/**
 * The horizontal journey. Vertical scroll pans a row of full-viewport chapters
 * sideways, gdrinkme-style. The wrapper is as tall as the track is wide, so
 * the page's scrollbar still means "how far along am I".
 *
 * Each chapter keeps its `id`, so nav anchors and crawlers see the same
 * document either way; `scrollToChapter` translates an anchor into the right
 * vertical offset while the track is active.
 */
export function HorizontalTrack({ children }: { children: ReactNode }) {
  const track = useTrackMode()
  const chapters = Children.toArray(children)
  const count = chapters.length

  const ref = useAnimeScope<HTMLDivElement>((_scope, wrapper) => {
    const rail = wrapper.querySelector<HTMLElement>('[data-track]')
    if (!rail) return
    const panels = Array.from(rail.children) as HTMLElement[]
    let current = -1
    const enter = (i: number) => {
      if (i === current || !panels[i]) return
      current = i
      panels[i].dispatchEvent(new CustomEvent('chapter:enter'))
    }
    enter(0)

    const distance = () => rail.scrollWidth - window.innerWidth
    animate(rail, {
      x: () => [0, -distance()],
      ease: 'linear',
      autoplay: onScroll({
        target: wrapper,
        enter: 'top top',
        leave: 'bottom bottom',
        sync: 0.35,
        onUpdate: (self) => enter(Math.round(self.progress * (count - 1))),
      }),
    })
  }, track)

  if (!track) {
    return <div data-chapters>{chapters}</div>
  }

  return (
    <div ref={ref} data-chapters style={{ height: `${count * 100}vh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div data-track className="flex h-[100dvh] will-change-transform">
          {chapters}
        </div>
      </div>
    </div>
  )
}
