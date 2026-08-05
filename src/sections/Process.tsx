import { createTimeline, spring, svg, utils } from 'animejs'
import { Note, Ruler, Cube, RocketLaunch, WhatsappLogo } from '@phosphor-icons/react'
import { useAnimeScope } from '../hooks/useAnimeScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { birthReveal, onSectionEnter } from '../motion/birth'
import { WA_PREFILL, waLinkProps } from '../lib/whatsapp'

type Phase = {
  key: string
  label: string
  duration: string
  copy: string
  Icon: typeof Note
}

const PHASES: Phase[] = [
  {
    key: 'map',
    label: 'Map',
    duration: 'Day 1',
    copy: 'We trace how your best rep sells and pick the channel with the most leakage.',
    Icon: Note,
  },
  {
    key: 'build',
    label: 'Build',
    duration: 'Day 2-3',
    copy: 'We train the agent on your data and voice, then wire it into your CRM, calendar and payments.',
    Icon: Ruler,
  },
  {
    key: 'pressure-test',
    label: 'Pressure-test',
    duration: 'Day 4',
    copy: 'We run it against real conversations, tune edge cases and set the human-handoff rules with you.',
    Icon: Cube,
  },
  {
    key: 'ship',
    label: 'Ship',
    duration: 'Day 5',
    copy: 'It goes live on your channels. You watch every conversation and we iterate weekly from real outcomes.',
    Icon: RocketLaunch,
  },
]

export default function Process() {
  const reduce = usePrefersReducedMotion()

  const sectionRef = useAnimeScope<HTMLElement>((_scope, root) => {
    birthReveal(root, 'left')

    const markers = utils.$('[data-marker]')
    const cards = utils.$('[data-card]')
    const [spine] = svg.createDrawable('[data-spine]')

    // Static start state for the play-once entrance; cards wait offset toward
    // the object so they read as born out of it.
    utils.set(spine, { draw: '0 0' })
    utils.set(markers, { scale: 0.4, opacity: 0 })
    utils.set(cards, { opacity: 0, x: -24 })
    utils.set('[data-dot]', { translateY: '0%', opacity: 0 })

    const tl = createTimeline({
      autoplay: false,
      defaults: { ease: 'outExpo', duration: 700 },
    })

    PHASES.forEach((phase, i) => {
      const beat = i === 0 ? 0 : '+=150'
      tl.label(phase.key, beat)
        .add(spine, { draw: ['0 0', `0 ${(i + 1) / PHASES.length}`] }, phase.key)
        .add(`[data-marker="${phase.key}"]`, { scale: [0.4, 1], opacity: [0, 1] }, '<')
        .add(`[data-card="${phase.key}"]`, { opacity: [0, 1], x: [-24, 0] }, '<')
    })

    // Spring-eased progress dot rides the spine to the end.
    tl.add(
      '[data-dot]',
      {
        opacity: [0, 1],
        translateY: ['0%', '100%'],
        ease: spring({ stiffness: 100, damping: 14 }),
        duration: 1100,
      },
      0,
    )

    onSectionEnter(root, () => tl.play(), 'bottom-=120 bottom')
  }, !reduce)

  return (
    <section
      ref={sectionRef}
      className="relative px-6 py-28 sm:py-36 lg:py-6"
      aria-labelledby="process-heading"
    >
      {/* Copy column on the right; the sculpture holds the left lane. */}
      <div className="lg:ml-auto lg:w-1/2 lg:max-w-xl">
      <span
        data-umbilical
        aria-hidden="true"
        className="mb-8 block h-px w-36 origin-left bg-gradient-to-r from-acid/70 to-transparent lg:mb-5"
      />

      <h2
        data-birth
        id="process-heading"
        className="max-w-xl font-display text-4xl text-paper text-balance sm:text-5xl lg:text-4xl"
      >
        From kickoff to live in five working days.
      </h2>

      <p data-birth className="mt-5 max-w-lg text-mist lg:mt-3 lg:text-sm">
        Not a chatbot flow. We train it on how your best closer actually sells,
        then wire it to your stack on day one.
      </p>

      <div className="relative mt-16 pl-14 sm:pl-20 lg:mt-8">
        {/* Spine rail — self-drawing SVG line + spring progress dot */}
        <div className="absolute left-[26px] top-2 bottom-2 w-px sm:left-[34px] lg:left-[20px]">
          <svg
            className="h-full w-full overflow-visible"
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="100"
              data-spine
              fill="none"
              stroke="var(--color-acid)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
          </svg>
          <span
            data-dot
            aria-hidden="true"
            className="absolute -left-[5px] top-0 block h-3 w-3 rounded-full bg-acid"
            style={reduce ? { top: 'auto', bottom: 0, opacity: 1 } : undefined}
          />
        </div>

        <ol className="flex flex-col gap-12 lg:gap-5">
          {PHASES.map((phase) => {
            const { Icon } = phase
            return (
              <li key={phase.key} className="relative">
                <span
                  data-marker={phase.key}
                  className="absolute -left-14 top-0 flex h-12 w-12 items-center justify-center rounded-2xl border border-ink-3 bg-ink-2 text-acid sm:-left-20 sm:h-14 sm:w-14 lg:-left-14 lg:h-10 lg:w-10"
                  aria-hidden="true"
                >
                  <Icon size={22} weight="duotone" />
                </span>

                <div
                  data-card={phase.key}
                  className="rounded-3xl border border-ink-3 bg-ink-2 p-6 sm:p-7 lg:p-4"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl text-paper lg:text-xl">{phase.label}</h3>
                    <span className="font-mono text-xs uppercase tracking-widest text-faint">
                      {phase.duration}
                    </span>
                  </div>
                  <p className="mt-3 max-w-md text-mist lg:mt-1.5 lg:text-sm">{phase.copy}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <a
          {...waLinkProps('process-day5', WA_PREFILL.process)}
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-acid px-5 py-3 font-mono text-xs font-medium uppercase tracking-wide text-ink lg:mt-6"
        >
          <WhatsappLogo weight="fill" size={16} />
          Start Day 1
        </a>
      </div>
      </div>
    </section>
  )
}
