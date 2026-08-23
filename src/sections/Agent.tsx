import { useState } from 'react'
import { CalendarCheck, ChatCircleDots, Funnel, Globe, WhatsappLogo, type Icon } from '@phosphor-icons/react'
import { agentPrefill, waLinkProps } from '../lib/whatsapp'
import { useReveal } from '../hooks/useReveal'
import { useLang } from '../lib/lang'

const ICON: Record<string, Icon> = {
  ventas: ChatCircleDots,
  califica: Funnel,
  concierge: Globe,
  agenda: CalendarCheck,
}

/** Where each job sits around the hub, as percentages of the square. */
const POS = [
  { x: 50, y: 8 },
  { x: 92, y: 50 },
  { x: 50, y: 92 },
  { x: 8, y: 50 },
]

/**
 * One agent, four jobs. Left: the jobs. Right: the hub, the brand mark wired
 * to the four jobs. Hovering a card lights its node and wire, hovering a node
 * lifts its card, so the "one agent" idea is felt, not just read.
 */
export default function Agent() {
  const ref = useReveal<HTMLElement>()
  const { t, ui } = useLang()
  const [a, b] = ui.agentH
  const [active, setActive] = useState<string | null>(null)

  return (
    <section id="agent" ref={ref} className="chapter">
      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <h2 data-reveal className="display-lg max-w-[14ch]">
            {a} <span className="text-neo">{b}</span>
          </h2>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10">
            {t.AGENTS.map((j) => {
              const I = ICON[j.slug]
              const on = active === j.slug
              return (
                <li
                  key={j.slug}
                  id={j.slug}
                  data-reveal
                  onMouseEnter={() => setActive(j.slug)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(j.slug)}
                  onBlur={() => setActive(null)}
                  className={`flex flex-col rounded-2xl p-5 transition-all duration-300 ${
                    on ? 'bg-neo text-ink lg:-translate-y-1' : 'bg-ink-2 text-paper'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <I size={20} className={on ? 'text-ink' : 'text-neo'} />
                    <h3 className="display-sm">{j.name}</h3>
                  </div>
                  <p className={`mt-2.5 text-[15px] leading-relaxed ${on ? 'text-ink/80' : 'text-mist'}`}>{j.outcome}</p>
                  <span className={`mt-2 text-xs ${on ? 'text-ink/60' : 'text-faint'}`}>{j.channel}</span>
                  <a
                    {...waLinkProps('agent-card', agentPrefill(j.name))}
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium hover:underline"
                  >
                    <WhatsappLogo weight="fill" size={15} />
                    {ui.agentAsk}
                  </a>
                </li>
              )
            })}
          </ol>
        </div>

        <div data-reveal className="mx-auto w-full max-w-[26rem] lg:col-span-6 lg:max-w-[min(30rem,60vh)]" aria-hidden="true">
          <div className="relative aspect-square">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              {t.AGENTS.map((j, i) => (
                <line
                  key={j.slug}
                  x1="50" y1="50" x2={POS[i].x} y2={POS[i].y}
                  stroke={active === j.slug ? 'var(--color-neo)' : 'var(--color-grey)'}
                  strokeWidth={active === j.slug ? 1 : 0.5}
                  style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                />
              ))}
              <circle cx="50" cy="50" r="30" fill="none" stroke="var(--color-grey)" strokeWidth="0.4" strokeDasharray="1.2 1.6" className="animate-[spin_90s_linear_infinite] origin-center" />
            </svg>
            <div className={`absolute left-1/2 top-1/2 flex h-[32%] w-[32%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neo transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
              <img src="/m-mark.png" alt="" className="w-[58%] brightness-0" />
            </div>
            {t.AGENTS.map((j, i) => {
              const I = ICON[j.slug]
              const on = active === j.slug
              return (
                <div
                  key={j.slug}
                  onMouseEnter={() => setActive(j.slug)}
                  onMouseLeave={() => setActive(null)}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-default flex-col items-center gap-1.5"
                  style={{ left: `${POS[i].x}%`, top: `${POS[i].y}%`, pointerEvents: 'auto' }}
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 sm:h-16 sm:w-16 ${
                      on ? 'scale-110 border-neo bg-neo text-ink' : 'border-grey bg-ink-2 text-paper'
                    }`}
                  >
                    <I size={26} />
                  </span>
                  <span className={`whitespace-nowrap font-display text-[11px] transition-colors ${on ? 'text-neo' : 'text-mist'}`}>{j.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
