import { useRef } from 'react'
import { animate, stagger, svg, utils, spring, splitText } from 'animejs'
import { ArrowUpRight } from '@phosphor-icons/react'
import { useAnimeScope } from '../hooks/useAnimeScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * Hero - Studio Animae.
 * The hero literally diagrams what an easing function is: a self-plotting
 * cubic-bezier ease curve with its control-point handles, a dot that rides
 * the exact curve forever, kinetic split-type headline, one acid CTA.
 */
export default function Hero() {
  const reduce = usePrefersReducedMotion()

  // Refs for the signature anime.js moment.
  const h1Ref = useRef<HTMLHeadingElement | null>(null)
  const curveRef = useRef<SVGPathElement | null>(null)
  const handleARef = useRef<SVGLineElement | null>(null)
  const handleBRef = useRef<SVGLineElement | null>(null)
  const dotRef = useRef<SVGCircleElement | null>(null)
  const pillRef = useRef<HTMLAnchorElement | null>(null)

  const rootRef = useAnimeScope<HTMLElement>(() => {
    const h1 = h1Ref.current
    const curve = curveRef.current
    if (!h1 || !curve) return

    // Kinetic type - split into chars + lines, clip-mask each line.
    const { chars, lines } = splitText(h1, { chars: true, lines: true })
    lines.forEach((line) => (line as HTMLElement).classList.add('split-line'))

    animate(chars, {
      y: ['110%', '0%'],
      opacity: [0, 1],
      delay: stagger(28, { from: 'center' }),
      duration: 900,
      ease: 'outExpo',
    })

    // Self-drawing ease curve + its two control-point handles.
    const drawTargets = [curve, handleARef.current, handleBRef.current].filter(
      (el): el is SVGGeometryElement => el != null,
    )
    const drawables = drawTargets.flatMap((el) => svg.createDrawable(el))
    animate(drawables, {
      draw: ['0 0', '0 1'],
      duration: 1400,
      ease: 'inOutQuad',
      delay: stagger(120),
      onComplete: () => {
        // Once drawn, a dot rides the exact ease curve forever.
        const dot = dotRef.current
        if (!dot) return
        const { translateX, translateY } = svg.createMotionPath(curve)
        animate(dot, {
          translateX,
          translateY,
          loop: true,
          duration: 3200,
          ease: 'inOutSine',
        })
      },
    })
  }, !reduce)

  // Reduced motion: everything visible + curve fully drawn at rest.
  const staticRef = useAnimeScope<HTMLElement>(() => {
    const curve = curveRef.current
    const targets = [curve, handleARef.current, handleBRef.current].filter(
      (el): el is SVGGeometryElement => el != null,
    )
    const drawables = targets.flatMap((el) => svg.createDrawable(el))
    utils.set(drawables, { draw: '0 1' })
  }, reduce)

  // Merge both scope refs onto the section element.
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
      className="relative grid min-h-[100dvh] grid-cols-1 items-center gap-12 overflow-hidden px-6 py-20 sm:px-10 lg:grid-cols-3 lg:gap-8 lg:px-16"
    >
      {/* Faint dotted blueprint grid + corner registration ticks. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ opacity: 0.12 }}
      >
        <defs>
          <pattern
            id="hero-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="var(--color-faint)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
      {/* Surgical acid registration ticks in the four corners. */}
      {(
        [
          'left-6 top-6',
          'right-6 top-6 rotate-90',
          'left-6 bottom-6 -rotate-90',
          'right-6 bottom-6 rotate-180',
        ] as const
      ).map((pos) => (
        <svg
          key={pos}
          aria-hidden
          className={`pointer-events-none absolute h-6 w-6 ${pos}`}
          style={{ opacity: 0.12 }}
          viewBox="0 0 24 24"
          stroke="var(--color-acid)"
          strokeWidth="1.5"
        >
          <line x1="0" y1="0" x2="16" y2="0" />
          <line x1="0" y1="0" x2="0" y2="16" />
        </svg>
      ))}

      {/* Left two-thirds: title-block headline + kicker + subtext + CTA. */}
      <div className="relative z-10 lg:col-span-2">
        <p className="mb-6 border-b border-ink-3 pb-3 font-mono text-xs uppercase tracking-[0.2em] text-faint">
          motion-layer engineering / since 2019
        </p>

        <h1
          ref={h1Ref}
          className="text-balance font-display text-[clamp(2.75rem,9vw,7rem)] leading-[0.95] text-paper"
        >
          We make software breathe.
        </h1>

        <p className="mt-7 max-w-md font-display text-lg text-mist sm:text-xl">
          We engineer the transitions, physics and micro-interactions that make
          a product feel alive.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-7">
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

      {/* Right third: the self-plotting cubic-bezier ease curve diagram. */}
      <div className="relative z-10 lg:col-span-1">
        <svg
          viewBox="0 0 200 200"
          className="h-auto w-full max-w-sm lg:max-w-none"
          fill="none"
        >
          {/* axes / frame */}
          <rect
            x="20"
            y="20"
            width="160"
            height="160"
            stroke="var(--color-ink-3)"
            strokeWidth="1"
          />
          {/* control-point handle lines */}
          <line
            ref={handleARef}
            x1="20"
            y1="180"
            x2="84"
            y2="180"
            stroke="var(--color-violet)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            ref={handleBRef}
            x1="180"
            y1="20"
            x2="116"
            y2="20"
            stroke="var(--color-violet)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {/* the ease curve itself */}
          <path
            ref={curveRef}
            d="M 20 180 C 84 180 116 20 180 20"
            stroke="var(--color-acid)"
            strokeWidth="2"
          />
          {/* control points */}
          <circle cx="84" cy="180" r="3" fill="var(--color-violet)" />
          <circle cx="116" cy="20" r="3" fill="var(--color-violet)" />
          {/* the dot that rides the curve forever, anchored at curve start */}
          <circle ref={dotRef} cx="20" cy="180" r="4" fill="var(--color-paper)" />
        </svg>
        <p className="mt-4 font-mono text-xs text-faint">
          fig.01 / cubic-bezier ease, plotted live
        </p>
      </div>
    </section>
  )
}
