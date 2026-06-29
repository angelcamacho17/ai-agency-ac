import { createTimeline, onScroll, svg, utils } from 'animejs'
import { useAnimeScope } from '../hooks/useAnimeScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Spec = {
  key: string
  label: string
  value: string
}

const SPECS: Spec[] = [
  { key: 'trigger', label: 'trigger', value: 'Pointer press, not hover. Intent over accident.' },
  { key: 'duration', label: 'duration', value: '180ms down, 240ms back. Fast in, calm out.' },
  { key: 'easing', label: 'easing', value: 'Out-expo on release so it settles, never snaps.' },
  { key: 'spring', label: 'spring', value: 'Stiffness 220, damping 18. One soft overshoot.' },
  { key: 'payoff', label: 'payoff', value: 'The label commits. You felt it before you read it.' },
]

export default function Anatomy() {
  const reduce = usePrefersReducedMotion()

  const ref = useAnimeScope<HTMLElement>((_scope, root) => {
    const leaders = utils.$('[data-leader]')
    const drawables = leaders.flatMap((el) => svg.createDrawable(el as SVGElement))

    const tl = createTimeline({
      defaults: { ease: 'outExpo', duration: 1 },
      autoplay: onScroll({
        target: root,
        enter: 'top top',
        leave: 'bottom bottom',
        sync: 1,
      }),
    })

    drawables.forEach((d, i) => {
      const lineDelay = i / drawables.length
      tl.add(d, { draw: ['0 0', '0 1'] }, lineDelay)
      tl.add(
        `[data-spec="${SPECS[i].key}"]`,
        { opacity: [0, 1], y: ['1.25rem', '0rem'] },
        lineDelay,
      )
    })
  }, !reduce)

  // Reduced motion: draw every leader fully, show every spec line.
  const reducedRef = useAnimeScope<HTMLElement>(() => {
    utils.$('[data-leader]').forEach((el) => {
      utils.set(svg.createDrawable(el as SVGElement), { draw: '0 1' })
    })
    utils.set('[data-spec]', { opacity: 1, y: '0rem' })
  }, reduce)

  // Pick whichever ref is active for this motion preference.
  const sectionRef = reduce ? reducedRef : ref

  return (
    <section
      ref={sectionRef}
      aria-labelledby="anatomy-heading"
      className="relative w-full bg-ink px-6 py-28 md:px-12 md:py-40"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 md:grid-cols-2 md:gap-20">
        {/* LEFT: sticky annotated diagram */}
        <div className="md:sticky md:top-24 md:self-start">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-acid">
            ANATOMY
          </p>
          <h2
            id="anatomy-heading"
            className="mt-5 max-w-md text-balance text-4xl text-paper md:text-5xl"
          >
            Every interaction has a spec.
          </h2>

          <div className="mt-12">
            <svg
              viewBox="0 0 400 300"
              className="w-full"
              role="img"
              aria-label="Annotated diagram of a button interaction spec"
            >
              {/* the UI element: a button */}
              <rect
                x="120"
                y="120"
                width="160"
                height="56"
                rx="14"
                fill="#1a1a16"
                stroke="#75746b"
                strokeWidth="1.25"
              />
              <text
                x="200"
                y="153"
                textAnchor="middle"
                fill="#f4f3ea"
                fontFamily="'Space Grotesk', sans-serif"
                fontSize="17"
                fontWeight="600"
              >
                Start a build
              </text>

              {/* dimension + callout leader lines (drawn on scroll) */}
              {/* trigger -> top-left corner */}
              <path
                data-leader
                d="M120 120 L70 70 L20 70"
                fill="none"
                stroke="#d9ff3d"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* duration -> width dimension under the button */}
              <path
                data-leader
                d="M120 196 L120 210 L280 210 L280 196"
                fill="none"
                stroke="#d9ff3d"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* easing -> right edge */}
              <path
                data-leader
                d="M280 148 L340 148 L380 120"
                fill="none"
                stroke="#d9ff3d"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* spring -> height dimension on the left */}
              <path
                data-leader
                d="M120 120 L96 120 L96 176 L120 176"
                fill="none"
                stroke="#7b5cff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* payoff -> center label underline */}
              <path
                data-leader
                d="M200 176 L200 250 L300 250"
                fill="none"
                stroke="#d9ff3d"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* RIGHT: scroll-scrubbed spec stack */}
        <ol className="flex flex-col gap-10 pt-2 md:pt-32">
          {SPECS.map((spec) => (
            <li
              key={spec.key}
              data-spec={spec.key}
              className="border-l border-ink-3 pl-6"
            >
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-acid">
                {spec.label}
              </span>
              <p className="mt-3 max-w-sm text-lg leading-snug text-mist">
                {spec.value}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
