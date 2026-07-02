import { useRef } from 'react'
import { animate, createTimeline, stagger, svg, utils, spring, splitText, onScroll } from 'animejs'
import { ArrowUpRight } from '@phosphor-icons/react'
import { useAnimeScope } from '../hooks/useAnimeScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * FinalCta - Michelangelo Devs closing title-block.
 * The breath metaphor exhales: on enter one createTimeline splits the headline
 * into line-masked reveals, draws a single acid "signature" underline stroke
 * (svg.createDrawable) as the final beat, then morphs the recap curve flat
 * (svg.morphTo) so the page settles to a calm baseline.
 */
export default function FinalCta() {
  const reduce = usePrefersReducedMotion()

  const h2Ref = useRef<HTMLHeadingElement | null>(null)
  const underlineRef = useRef<SVGPathElement | null>(null)
  const curveRef = useRef<SVGPathElement | null>(null)
  const flatRef = useRef<SVGPathElement | null>(null)
  const pillRef = useRef<HTMLAnchorElement | null>(null)

  const rootRef = useAnimeScope<HTMLElement>((_scope, root) => {
    const h2 = h2Ref.current
    const underline = underlineRef.current
    const curve = curveRef.current
    const flat = flatRef.current
    if (!h2 || !underline || !curve || !flat) return

    const { lines } = splitText(h2, { lines: true })
    lines.forEach((line) => (line as HTMLElement).classList.add('split-line'))
    utils.set(lines, { opacity: 0 })

    const [underlineDraw] = svg.createDrawable(underline)
    utils.set(underlineDraw, { draw: '0 0' })

    const tl = createTimeline({ autoplay: false })

    tl.add(lines, {
      y: ['110%', '0%'],
      opacity: [0, 1],
      delay: stagger(120),
      duration: 850,
      ease: 'outExpo',
    })
      .add(
        underlineDraw,
        { draw: ['0 0', '0 1'], duration: 700, ease: 'inOutQuad' },
        '-=150',
      )
      .add(curve, { d: svg.morphTo(flat), duration: 900, ease: 'inOutSine' }, '<')

    onScroll({
      target: root,
      enter: 'bottom bottom',
      onEnter: () => tl.play(),
    })
  }, !reduce)

  // Reduced motion: headline visible, underline drawn static, curve already flat.
  const staticRef = useAnimeScope<HTMLElement>(() => {
    const underline = underlineRef.current
    const curve = curveRef.current
    const flat = flatRef.current
    if (underline) {
      const [d] = svg.createDrawable(underline)
      utils.set(d, { draw: '0 1' })
    }
    if (curve && flat) {
      utils.set(curve, { d: flat.getAttribute('d') ?? '' })
    }
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
      id="contact"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center sm:px-10 lg:px-16"
    >
      {/* Readability scrim so the headline reads over the sculpture behind it. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 56% 46% at 50% 50%, color-mix(in srgb, var(--color-ink) 66%, transparent) 26%, transparent 74%)',
        }}
      />
      {/* Recap curve that exhales flat behind the title-block. */}
      <svg
        aria-hidden
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-40 w-full max-w-3xl -translate-y-1/2"
        style={{ opacity: 0.14 }}
        fill="none"
      >
        <path
          ref={curveRef}
          d="M0,180 C150,20 300,200 450,60 C520,0 560,140 600,100"
          stroke="var(--color-violet)"
          strokeWidth="1.5"
        />
        {/* Hidden flat baseline target for morphTo. */}
        <path
          ref={flatRef}
          className="hidden"
          d="M0,100 C150,100 300,100 450,100 C520,100 560,100 600,100"
        />
      </svg>

      <div className="relative z-10 flex flex-col items-center">
        <h2
          ref={h2Ref}
          className="text-balance font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] text-paper"
        >
          Let us build your agent.
        </h2>

        {/* Single acid signature underline stroke, drawn as the final beat. */}
        <svg
          aria-hidden
          viewBox="0 0 320 24"
          className="mt-6 h-5 w-56 sm:w-72"
          fill="none"
        >
          <path
            ref={underlineRef}
            d="M4,16 C70,4 130,22 180,12 C230,4 280,18 316,8"
            stroke="var(--color-acid)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <a
          ref={pillRef}
          href="mailto:hello@michelangelodevs.com"
          onPointerEnter={onPillEnter}
          className="mt-12 inline-flex items-center gap-2 rounded-2xl bg-acid px-8 py-4 font-mono text-sm font-medium uppercase tracking-wide text-ink"
        >
          Start a build
          <ArrowUpRight weight="bold" size={18} />
        </a>

        {/* Mono footer arranged as a drawing title block. */}
        <dl className="mt-20 grid w-full max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-3 bg-ink-3 font-mono text-xs text-faint sm:grid-cols-4">
          {(
            [
              ['Studio', 'Michelangelo Devs'],
              ['Focus', 'AI sales agents'],
              ['Email', 'hello@michelangelodevs.com'],
              ['Reply', 'Within a day'],
            ] as const
          ).map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col gap-2 bg-ink px-5 py-4 text-left"
            >
              <dt className="text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                {label}
              </dt>
              <dd className="break-all text-paper">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
