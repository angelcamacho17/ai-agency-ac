import { useRef } from 'react'
import { animate, onScroll, utils } from 'animejs'
import { useAnimeScope } from '../hooks/useAnimeScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const WORDS = ['INSTAGRAM', 'WHATSAPP', 'WEB', 'QUALIFY', 'CLOSE', '24/7'] as const

/** One unit of the band: verbs separated by acid tick slashes. */
function BandRun({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-baseline gap-8 pr-8 sm:gap-12 sm:pr-12"
      aria-hidden={ariaHidden}
    >
      {WORDS.map((word) => (
        <span key={word} className="flex items-baseline gap-8 sm:gap-12">
          <span className="font-display text-5xl font-semibold tracking-tight text-paper sm:text-7xl lg:text-8xl">
            {word}
          </span>
          <span className="font-display text-5xl font-semibold text-acid sm:text-7xl lg:text-8xl">
            /
          </span>
        </span>
      ))}
    </div>
  )
}

export default function WordBand() {
  const reduce = usePrefersReducedMotion()
  const trackRef = useRef<HTMLDivElement | null>(null)

  const rootRef = useAnimeScope<HTMLElement>(() => {
    const track = trackRef.current
    if (!track) return

    const loop = animate(track, {
      x: ['0%', '-50%'],
      loop: true,
      ease: 'linear',
      duration: window.innerWidth < 640 ? 26000 : 18000,
    })

    // Scroll velocity steers the band: down speeds it forward, up nudges back.
    let raf = 0
    const observer = onScroll({
      onUpdate: (self) => {
        const v = (self as unknown as { velocity?: number }).velocity ?? 0
        const rate = utils.clamp(1 + v * 0.6, -3, 6)
        loop.speed = rate
        cancelAnimationFrame(raf)
        // Decay back to the resting forward speed once scrolling settles.
        raf = requestAnimationFrame(() => {
          loop.speed = 1
        })
      },
    })

    return () => {
      cancelAnimationFrame(raf)
      observer.revert()
    }
  }, !reduce)

  return (
    <section
      ref={rootRef}
      aria-label="Motion craft band"
      className="relative overflow-hidden border-y border-ink-3 bg-ink/70 py-10 sm:py-16"
    >
      {/* Ruled measurement baseline the verbs sit on. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-10 h-px bg-ink-3 sm:bottom-16" />

      {reduce ? (
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-4 px-6 sm:px-10">
          <BandRun />
        </div>
      ) : (
        <div ref={trackRef} className="flex w-max flex-nowrap will-change-transform">
          <BandRun />
          <BandRun ariaHidden />
        </div>
      )}
    </section>
  )
}
