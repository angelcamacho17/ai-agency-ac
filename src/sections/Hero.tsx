import { useRef } from 'react'
import { animate, stagger, utils, spring, splitText } from 'animejs'
import { ArrowUpRight } from '@phosphor-icons/react'
import { useAnimeScope } from '../hooks/useAnimeScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * Hero - Michelangelo Devs.
 * Kinetic split-type headline over the morphing 3D sculpture (which lives in
 * the fixed canvas behind, and is the hero's visual on the right). One CTA.
 */
export default function Hero() {
  const reduce = usePrefersReducedMotion()

  const h1Ref = useRef<HTMLHeadingElement | null>(null)
  const pillRef = useRef<HTMLAnchorElement | null>(null)

  const rootRef = useAnimeScope<HTMLElement>(() => {
    const h1 = h1Ref.current
    if (!h1) return

    // Kinetic type - split into chars + lines, clip-mask each line.
    const { chars, lines } = splitText(h1, { chars: true, lines: true })
    lines.forEach((line) => (line as HTMLElement).classList.add('split-line'))

    animate(chars, {
      y: ['110%', '0%'],
      opacity: [0, 1],
      delay: stagger(26, { from: 'center' }),
      duration: 900,
      ease: 'outExpo',
    })

    animate('[data-hero-fade]', {
      opacity: [0, 1],
      y: ['1.5rem', '0rem'],
      delay: stagger(120, { start: 600 }),
      duration: 800,
      ease: 'outExpo',
    })
  }, !reduce)

  // Reduced motion: everything visible at rest.
  const staticRef = useAnimeScope<HTMLElement>(() => {
    utils.set('[data-hero-fade]', { opacity: 1, y: '0rem' })
  }, reduce)

  const setRoot = (el: HTMLElement | null) => {
    rootRef.current = el
    staticRef.current = el
  }

  const onPillEnter = () => {
    if (reduce || !pillRef.current) return
    animate(pillRef.current, {
      scale: [1, 1.04, 1],
      ease: spring({ stiffness: 140, damping: 9 }),
    })
  }

  return (
    <section
      ref={setRoot}
      id="top"
      className="relative flex min-h-[100dvh] items-center overflow-hidden px-6 py-20 sm:px-10 lg:px-16"
    >
      {/* Faint dotted blueprint grid. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ opacity: 0.1 }}
      >
        <defs>
          <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="var(--color-faint)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Local scrim behind the copy so it reads over the sculpture at any width
          (the global left-gradient does not cover a centered object on mobile). */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] sm:hidden"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-ink) 72%, transparent) 22%, color-mix(in srgb, var(--color-ink) 72%, transparent) 78%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-2xl">
        <p
          data-hero-fade
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink-3 bg-ink-2/70 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-faint backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-acid" />
          AI agents agency
        </p>

        <h1
          ref={h1Ref}
          className="text-balance font-display text-[clamp(2.75rem,8.5vw,6.5rem)] leading-[0.95] text-paper"
        >
          We sculpt AI agents that sell.
        </h1>

        <p
          data-hero-fade
          className="mt-7 max-w-md font-display text-lg text-mist sm:text-xl"
        >
          Production agents that answer every message, qualify leads and close
          sales around the clock. Live in about five days.
        </p>

        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-7">
          <a
            ref={pillRef}
            href="#contact"
            onPointerEnter={onPillEnter}
            className="inline-flex items-center gap-2 rounded-2xl bg-acid px-7 py-3.5 font-mono text-sm font-medium uppercase tracking-wide text-ink"
          >
            Start a build
            <ArrowUpRight weight="bold" size={18} />
          </a>
          <a
            href="#work"
            className="font-mono text-sm text-mist underline-offset-4 transition-colors hover:text-paper hover:underline"
          >
            See the work
          </a>
        </div>
      </div>
    </section>
  )
}
