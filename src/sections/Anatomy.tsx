import { createTimeline, onScroll, svg, utils } from 'animejs'
import { useAnimeScope } from '../hooks/useAnimeScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { birthReveal, onSceneProgress } from '../motion/birth'

type Spec = {
  key: string
  label: string
  value: string
}

const SPECS: Spec[] = [
  { key: 'listens', label: 'Listens', value: 'reads intent across the whole thread' },
  { key: 'replies', label: 'Replies', value: 'in your brand voice, sub-second' },
  { key: 'qualifies', label: 'Qualifies', value: 'scores and books the ready-to-buy' },
  { key: 'connects', label: 'Connects', value: 'CRM, calendar, payments' },
  { key: 'escalates', label: 'Escalates', value: 'hands off to a human with context' },
]

/**
 * Anatomy - chapter 1. The sculpture holds the left lane, so all copy lives
 * in the right column and is born out of the object: the umbilical rule grows
 * from its side, the heading emerges from the same direction, and each spec
 * slides in from the left as its leader line draws.
 */
export default function Anatomy() {
  const reduce = usePrefersReducedMotion()

  const ref = useAnimeScope<HTMLElement>((_scope, root) => {
    birthReveal(root, 'left')

    const leaders = utils.$('[data-leader]')
    const drawables = leaders.flatMap((el) => svg.createDrawable(el as SVGElement))

    // On the pinned stage the timeline scrubs across the scene's dwell; in
    // document flow it scrubs across the section's own scroll span.
    const staged = !!root.closest('[data-scene-layer]')
    const tl = createTimeline({
      defaults: { ease: 'outExpo', duration: 1 },
      autoplay: staged
        ? false
        : onScroll({
            target: root,
            enter: 'top top',
            leave: 'bottom bottom',
            sync: 1,
          }),
    })

    // Stagger across the FIRST HALF of the scrub, and never place a beat at
    // exactly 0. A beat at progress 0 has no scroll distance in which to play,
    // so the first spec would sit at opacity 0 until the user scrolled past
    // it — the same "text hidden behind an animation" failure the crawler
    // safety net exists to prevent, but for sighted users.
    const span = 0.5
    drawables.forEach((d, i) => {
      const lineDelay = ((i + 1) / (drawables.length + 1)) * span
      tl.add(d, { draw: ['0 0', '0 1'] }, lineDelay)
      tl.add(
        `[data-spec="${SPECS[i].key}"]`,
        { opacity: [0, 1], x: ['-1.5rem', '0rem'] },
        lineDelay,
      )
    })

    if (staged) {
      tl.seek(0)
      onSceneProgress(root, (p) => tl.seek(p * tl.duration))
    }
  }, !reduce)

  // Reduced motion: draw every leader fully, show every spec line.
  const reducedRef = useAnimeScope<HTMLElement>(() => {
    utils.$('[data-leader]').forEach((el) => {
      utils.set(svg.createDrawable(el as SVGElement), { draw: '0 1' })
    })
    utils.set('[data-spec]', { opacity: 1, x: '0rem' })
  }, reduce)

  // Pick whichever ref is active for this motion preference.
  const sectionRef = reduce ? reducedRef : ref

  return (
    <section
      ref={sectionRef}
      aria-labelledby="anatomy-heading"
      className="relative w-full px-6 py-28 md:px-12 md:py-40 lg:py-6"
    >
      <div className="lg:ml-auto lg:w-1/2 lg:max-w-2xl">
        <span
          data-umbilical
          aria-hidden="true"
          className="mb-8 block h-px w-36 origin-left bg-gradient-to-r from-acid/70 to-transparent lg:mb-5"
        />

        <div data-birth>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-acid">
            ANATOMY
          </p>
          <h2
            id="anatomy-heading"
            className="mt-5 max-w-md text-balance text-4xl text-paper md:text-5xl"
          >
            The anatomy of an agent.
          </h2>
        </div>

        <div data-birth className="mt-12 max-w-md lg:mt-6 lg:max-w-[300px]">
          <svg
            viewBox="0 0 400 300"
            className="w-full"
            role="img"
            aria-label="Annotated diagram of an incoming customer message and how the agent handles it"
          >
            {/* the object under inspection: an incoming customer message */}
            <rect
              x="120"
              y="120"
              width="160"
              height="56"
              rx="14"
              fill="#1a1a16"
              stroke="#8a897e"
              strokeWidth="1.25"
            />
            {/* bubble tail, so it reads as a message rather than a button */}
            <path d="M132 176 L132 190 L148 176 Z" fill="#1a1a16" stroke="#8a897e" strokeWidth="1.25" strokeLinejoin="round" />
            <text
              x="200"
              y="146"
              textAnchor="middle"
              fill="#f4f3ea"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="13"
            >
              “¿Está disponible?”
            </text>
            <text
              x="200"
              y="164"
              textAnchor="middle"
              fill="#8a897e"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="10"
            >
              WhatsApp · 02:14
            </text>

            {/* dimension + callout leader lines (drawn on scroll) */}
            {/* listens -> top-left corner */}
            <path
              data-leader
              d="M120 120 L70 70 L20 70"
              fill="none"
              stroke="#d9ff3d"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* replies -> width dimension under the bubble */}
            <path
              data-leader
              d="M120 196 L120 210 L280 210 L280 196"
              fill="none"
              stroke="#d9ff3d"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* qualifies -> right edge */}
            <path
              data-leader
              d="M280 148 L340 148 L380 120"
              fill="none"
              stroke="#d9ff3d"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* connects -> height dimension on the left */}
            <path
              data-leader
              d="M120 120 L96 120 L96 176 L120 176"
              fill="none"
              stroke="#7b5cff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* escalates -> handoff line out of the bubble */}
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

        <ol className="mt-14 flex flex-col gap-10 lg:mt-8 lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-5">
          {SPECS.map((spec) => (
            <li
              key={spec.key}
              data-spec={spec.key}
              className="border-l border-ink-3 pl-6"
            >
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-acid">
                {spec.label}
              </span>
              <p className="mt-3 max-w-sm text-lg leading-snug text-mist lg:mt-1.5 lg:text-base">
                {spec.value}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
