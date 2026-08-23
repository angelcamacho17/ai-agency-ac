import { animate, createTimeline, stagger, utils } from 'animejs'
import { WhatsappLogo } from '@phosphor-icons/react'
import { WA_PREFILL, waLinkProps } from '../lib/whatsapp'
import { useReveal } from '../hooks/useReveal'
import { useLang } from '../lib/lang'

/**
 * Five days on one line. When the chapter enters, the rail draws left to
 * right and each day lands on it in turn; hovering a day pulses its marker.
 */
export default function Process() {
  const { t, ui } = useLang()
  const [a, b] = ui.processH

  const ref = useReveal<HTMLElement>(() => {
    const root = ref.current
    if (!root) return
    const rail = root.querySelector<HTMLElement>('[data-rail]')
    const dots = root.querySelectorAll<HTMLElement>('[data-dot]')
    const days = root.querySelectorAll<HTMLElement>('[data-day]')
    if (!rail) return
    createTimeline({ defaults: { ease: 'outExpo' } })
      .add(rail, { scaleX: [0, 1], duration: 1400 }, 0)
      .add(dots, { scale: [0, 1], duration: 600, delay: stagger(260, { start: 200 }) }, 0)
      .add(days, { opacity: [0, 1], y: ['0.75rem', '0rem'], duration: 700, delay: stagger(260, { start: 260 }) }, 0)
  })

  const pulse = (i: number) => {
    const dot = ref.current?.querySelectorAll<HTMLElement>('[data-dot]')[i]
    if (!dot) return
    utils.remove(dot)
    animate(dot, { scale: [1, 1.9, 1], duration: 600, ease: 'outBack' })
  }

  return (
    <section id="process" ref={ref} className="chapter">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-reveal className="display-lg max-w-[14ch]">
            {a}<span className="text-neo">{b}</span>
          </h2>
          <a {...waLinkProps('process-day5', WA_PREFILL.process)} data-reveal className="pill pill-solid">
            <WhatsappLogo weight="fill" size={16} />
            {ui.whatsapp}
          </a>
        </div>

        <ol className="relative mt-12 grid gap-8 md:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-6">
          <span data-rail aria-hidden="true" className="absolute left-0 right-0 top-[2.35rem] hidden h-px origin-left bg-grey lg:block" />
          {t.PHASES.map((p, i) => (
            <li key={p.key} data-day onMouseEnter={() => pulse(i)} className="group relative lg:pt-14">
              <span data-dot aria-hidden="true" className="absolute left-0 top-[2.1rem] hidden h-2.5 w-2.5 rounded-full bg-neo lg:block" />
              <span className="font-display text-xs text-neo">{p.duration}</span>
              <h3 className="display-md mt-2 transition-colors group-hover:text-neo">{p.label}</h3>
              <p className="mt-3 max-w-[30ch] text-[15px] leading-relaxed text-mist">{p.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
