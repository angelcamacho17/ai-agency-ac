import { useRef } from 'react'
import { animate, createTimeline, stagger, svg, utils, spring, splitText } from 'animejs'
import { WhatsappLogo } from '@phosphor-icons/react'
import { useAnimeScope } from '../hooks/useAnimeScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { onSectionEnter } from '../motion/birth'
import { WA_DISPLAY, WA_PREFILL, waHref, waLinkProps } from '../lib/whatsapp'

/**
 * FinalCta - Michelangelo Devs closing lockup.
 * The sculpture settles top-center as the brand "m." while this copy anchors
 * to the bottom of the viewport beneath it, rising out of the mark like the
 * rest of the page. On enter one createTimeline splits the headline into
 * line-masked reveals, draws a single acid "signature" underline stroke
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

    onSectionEnter(root, () => tl.play(), 'bottom bottom')
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
      // min-h-[100dvh] is for document flow. Inside the pinned stage the layer
      // already supplies the height and adds nav padding on top, so forcing a
      // full viewport here overflows it — hence lg:min-h-0.
      className="relative flex min-h-[100dvh] flex-col items-center justify-end overflow-hidden px-6 pb-16 pt-32 text-center sm:px-10 lg:min-h-0 lg:px-16 lg:pb-0 lg:pt-0"
    >
      {/* Recap curve that exhales flat behind the title-block, kept in the
          lower half so the mark above stays pristine. */}
      <svg
        aria-hidden
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-[10%] mx-auto h-40 w-full max-w-3xl"
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
          className="text-balance font-display text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[0.95] text-paper"
        >
          Write to us on WhatsApp.
        </h2>

        <p className="mt-6 max-w-lg text-balance font-display text-lg text-mist">
          Tell us what you sell and which channel is leaking. We reply the same
          day and tell you straight whether an agent helps.
        </p>

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
          {...waLinkProps('final-cta', WA_PREFILL.default)}
          onPointerEnter={onPillEnter}
          className="mt-8 inline-flex items-center gap-2.5 rounded-2xl bg-acid px-8 py-4 font-mono text-sm font-medium uppercase tracking-wide text-ink"
        >
          <WhatsappLogo weight="fill" size={20} />
          WhatsApp {WA_DISPLAY}
        </a>

        <p className="mt-4 font-mono text-xs text-faint">
          You write, a person answers — usually within the hour.
        </p>

        {/* Mono footer arranged as a drawing title block; also the NAP block
            that search engines read for the business entity. */}
        <footer className="w-full">
          <dl className="mt-12 grid w-full max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-3 bg-ink-3 font-mono text-xs text-faint sm:grid-cols-4">
            {(
              [
                ['Studio', 'Michelangelo Devs', null],
                ['Focus', 'AI sales agents', null],
                ['WhatsApp', WA_DISPLAY, waHref(WA_PREFILL.default)],
                ['Reply', 'Usually within the hour', null],
              ] as const
            ).map(([label, value, href]) => (
              <div
                key={label}
                className="flex flex-col gap-2 bg-ink px-5 py-4 text-left"
              >
                <dt className="text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                  {label}
                </dt>
                <dd className="break-all text-paper">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cta-source="footer"
                      className="underline-offset-4 hover:text-acid hover:underline"
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </footer>
      </div>
    </section>
  )
}
