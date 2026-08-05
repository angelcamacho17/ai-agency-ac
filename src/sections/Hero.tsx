import { useRef } from 'react'
import { animate, stagger, utils, spring, splitText } from 'animejs'
import { WhatsappLogo } from '@phosphor-icons/react'
import { useAnimeScope } from '../hooks/useAnimeScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { WA_PREFILL, waLinkProps } from '../lib/whatsapp'
import { ORG } from '../content/offer'

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

    // The H1 is the LCP element. Animate `y` only — the chars are clipped by
    // .split-line, so they still sweep in, but the text is never at opacity 0.
    // Fading it in would push LCP out by the full animation duration and would
    // leave the headline invisible if this script stalled.
    animate(chars, {
      y: ['110%', '0%'],
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

      {/* Soft left-weighted scrim behind the copy: the sculpture is centered
          now, so contrast is pinned only where the text column sits. */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(90% 75% at 18% 50%, color-mix(in srgb, var(--color-ink) 74%, transparent) 0%, color-mix(in srgb, var(--color-ink) 38%, transparent) 46%, transparent 70%)',
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
          AI agents that answer, qualify and close.
        </h1>

        {/* The entity sentence. Self-contained on purpose: it names the
            subject, the category, the channels and the timeline in one
            quotable line, so a generative engine can lift it with no
            surrounding context. Identical string in JSON-LD and llms.txt. */}
        <p
          data-hero-fade
          className="mt-7 max-w-lg font-display text-lg text-mist sm:text-xl"
        >
          {ORG.definition}
        </p>

        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-7">
          <a
            ref={pillRef}
            {...waLinkProps('hero', WA_PREFILL.hero)}
            onPointerEnter={onPillEnter}
            className="inline-flex items-center gap-2 rounded-2xl bg-acid px-7 py-3.5 font-mono text-sm font-medium uppercase tracking-wide text-ink"
          >
            <WhatsappLogo weight="fill" size={18} />
            Message us on WhatsApp
          </a>
          <a
            href="#agents"
            className="font-mono text-sm text-mist underline-offset-4 transition-colors hover:text-paper hover:underline"
          >
            See the agents
          </a>
        </div>

        <p data-hero-fade className="mt-5 font-mono text-xs text-faint">
          You write, a person answers — usually within the hour.
        </p>
      </div>
    </section>
  )
}
