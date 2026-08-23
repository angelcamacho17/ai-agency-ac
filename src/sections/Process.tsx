import { useState } from 'react'
import { animate, createTimeline, splitText, stagger, utils } from 'animejs'
import { WhatsappLogo } from '@phosphor-icons/react'
import { WA_PREFILL, waLinkProps } from '../lib/whatsapp'
import { useReveal } from '../hooks/useReveal'
import { useLang } from '../lib/lang'

/**
 * Five days on one line, told in motion.
 *
 * On chapter enter: the headline's letters slam in, the rail draws left to
 * right with a pulse that then keeps travelling along it, and each day lands
 * in turn: its ghost number wipes in, its marker pops, its copy rises and a
 * small looping sketch starts (a trace, a stack, checks, a launch). Hovering
 * a day lights the rail up to it and lifts its sketch.
 */
export default function Process() {
  const { t, ui, lang } = useLang()
  const [a, b] = ui.processH
  const [hover, setHover] = useState<number | null>(null)

  const ref = useReveal<HTMLElement>(() => {
    const root = ref.current
    if (!root) return
    const q = <T extends HTMLElement>(s: string) => Array.from(root.querySelectorAll<T>(s))

    // Headline: characters slam in from below with a little overshoot.
    const h2 = root.querySelector<HTMLElement>('[data-headline]')
    if (h2 && !h2.dataset.split) {
      h2.dataset.split = '1'
      const { chars } = splitText(h2, { chars: true })
      utils.set(chars, { display: 'inline-block' })
      animate(chars, {
        y: ['0.6em', '0em'],
        opacity: [0, 1],
        rotate: [8, 0],
        duration: 800,
        ease: 'outBack(1.4)',
        delay: stagger(28),
      })
    }

    const rail = root.querySelector<HTMLElement>('[data-rail]')
    const pulse = root.querySelector<HTMLElement>('[data-pulse]')
    const tl = createTimeline({ defaults: { ease: 'outExpo' } })
    if (rail) tl.add(rail, { scaleX: [0, 1], duration: 1500 }, 0)
    tl.add(q('[data-dot]'), { scale: [0, 1], duration: 600, delay: stagger(300, { start: 250 }) }, 0)
    tl.add(q('[data-ghost]'), { clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'], duration: 900, delay: stagger(300, { start: 250 }) }, 0)
    tl.add(q('[data-day]'), { opacity: [0, 1], y: ['1rem', '0rem'], duration: 800, delay: stagger(300, { start: 350 }) }, 0)
    tl.add(q('[data-sketch]'), { opacity: [0, 1], duration: 600, delay: stagger(300, { start: 700 }) }, 0)

    // The pulse: after the draw, a spark keeps riding the rail.
    if (pulse) {
      tl.add(pulse, { opacity: [0, 1], duration: 300 }, 1300)
      tl.call(() => {
        animate(pulse, { left: ['0%', '100%'], duration: 4200, ease: 'inOutSine', loop: true })
      }, 1500)
    }

    // Day counters tick up to their number.
    q<HTMLElement>('[data-count]').forEach((el, i) => {
      const n = Number(el.dataset.count)
      if (!n) return
      const o = { v: 0 }
      animate(o, {
        v: n,
        duration: 900,
        delay: 400 + i * 300,
        ease: 'outExpo',
        modifier: utils.round(0),
        onUpdate: () => {
          el.textContent = String(o.v)
        },
      })
    })

    /* Sketches: tiny looping scenes, one per phase. */
    // Mapear: three lines traced one after another, like reading a sales thread.
    animate(q('[data-sk="map"] i'), { scaleX: [0, 1], duration: 900, delay: stagger(260), loopDelay: 900, loop: true, alternate: true, ease: 'inOutSine' })
    // Construir: blocks stacking up.
    animate(q('[data-sk="build"] i'), { y: ['-1.4rem', '0rem'], opacity: [0, 1], duration: 700, delay: stagger(220), loopDelay: 1400, loop: true, ease: 'outBack(2)' })
    // Probar: dots travelling their rows and turning lime as they pass.
    animate(q('[data-sk="test"] i'), { left: ['0%', '100%'], backgroundColor: ['#3a3a3a', '#d4e04a'], duration: 1100, delay: stagger(240), loopDelay: 700, loop: true, ease: 'inOutSine' })
    // Lanzar: bar fills, arrow lifts off.
    animate(q('[data-sk="ship"] i:first-child'), { scaleX: [0, 1], duration: 1200, loopDelay: 1200, loop: true, ease: 'inOutSine' })
    animate(q('[data-sk="ship"] i:last-child'), { y: ['0rem', '-1.6rem'], opacity: [1, 0], duration: 1200, delay: 900, loopDelay: 300, loop: true, ease: 'inQuad' })
  })

  const railLit = hover === null ? 0 : (hover + 0.5) / t.PHASES.length

  return (
    <section id="process" ref={ref} className="chapter">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-reveal className="display-lg max-w-[14ch]">
            {/* Remounted per language so the split characters never fight React. */}
            <span key={lang} data-headline>
              {a}<span className="text-neo">{b}</span>
            </span>
          </h2>
          <a {...waLinkProps('process-day5', WA_PREFILL.process)} data-reveal className="pill pill-solid">
            <WhatsappLogo weight="fill" size={16} />
            {ui.whatsapp}
          </a>
        </div>

        <ol className="relative mt-12 grid gap-8 md:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-6">
          {/* The rail, its lit segment and the travelling pulse. Desktop only. */}
          <span data-rail aria-hidden="true" className="absolute left-0 right-0 top-[2.35rem] hidden h-px origin-left bg-grey lg:block" />
          <span
            aria-hidden="true"
            className="absolute left-0 top-[2.35rem] hidden h-px w-full origin-left bg-neo transition-transform duration-500 ease-out lg:block"
            style={{ transform: `scaleX(${railLit})` }}
          />
          <span
            data-pulse
            aria-hidden="true"
            className="absolute top-[2.35rem] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neo opacity-0 shadow-[0_0_12px_2px_rgba(212,224,74,0.8)] lg:block"
          />

          {t.PHASES.map((p, i) => {
            const on = hover === i
            const num = p.duration.match(/\d+/)?.[0] ?? ''
            const [pre, post] = p.duration.split(num)
            return (
              <li
                key={p.key}
                data-day
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="group relative lg:pt-14"
              >
                <span
                  data-ghost
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-3 left-0 select-none font-display text-[7rem] font-semibold leading-none tracking-tighter transition-colors duration-500 lg:-top-1 ${
                    on ? 'text-neo/25' : 'text-grey/40'
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  data-dot
                  aria-hidden="true"
                  className={`absolute left-0 top-[2.1rem] hidden h-2.5 w-2.5 rounded-full transition-all duration-300 lg:block ${
                    on ? 'scale-150 bg-paper shadow-[0_0_0_4px_rgba(212,224,74,0.35)]' : 'bg-neo'
                  }`}
                />
                <span className="relative font-display text-xs text-neo">
                  {pre}
                  <span data-count={num}>{num}</span>
                  {post}
                </span>
                <h3 className={`display-md relative mt-2 transition-colors ${on ? 'text-neo' : ''}`}>{p.label}</h3>
                <p className="relative mt-3 max-w-[30ch] text-[15px] leading-relaxed text-mist">{p.copy}</p>

                {/* The sketch for this phase. */}
                <div
                  data-sketch
                  aria-hidden="true"
                  className={`relative mt-5 h-12 w-32 transition-transform duration-300 ${on ? '-translate-y-1' : ''}`}
                >
                  {p.key === 'map' && (
                    <div data-sk="map" className="flex h-full flex-col justify-center gap-2">
                      <i className="block h-1 w-full origin-left rounded bg-neo" />
                      <i className="block h-1 w-3/4 origin-left rounded bg-neo/70" />
                      <i className="block h-1 w-1/2 origin-left rounded bg-neo/40" />
                    </div>
                  )}
                  {p.key === 'build' && (
                    <div data-sk="build" className="flex h-full items-end gap-1.5">
                      <i className="block h-4 w-5 rounded-sm bg-neo" />
                      <i className="block h-7 w-5 rounded-sm bg-neo" />
                      <i className="block h-5 w-5 rounded-sm bg-neo" />
                      <i className="block h-10 w-5 rounded-sm bg-neo" />
                    </div>
                  )}
                  {p.key === 'pressure-test' && (
                    <div data-sk="test" className="flex h-full flex-col justify-center gap-2.5">
                      {[0, 1, 2].map((r) => (
                        <span key={r} className="relative block h-px w-full bg-grey">
                          <i className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-grey" />
                        </span>
                      ))}
                    </div>
                  )}
                  {p.key === 'ship' && (
                    <div data-sk="ship" className="relative flex h-full items-end">
                      <i className="block h-1.5 w-full origin-left rounded bg-neo" />
                      <i className="absolute bottom-3 right-0 block h-3 w-3 rotate-45 border-r-2 border-t-2 border-neo" />
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
