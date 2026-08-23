import { WhatsappLogo } from '@phosphor-icons/react'
import { PHASES } from '../content/offer'
import { WA_PREFILL, waLinkProps } from '../lib/whatsapp'
import { useReveal } from '../hooks/useReveal'

/**
 * Five days, four moves. A single horizontal line with the days hung on it,
 * so the whole process reads in one glance.
 */
export default function Process() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="process" ref={ref} className="chapter">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-reveal className="display-lg max-w-[14ch]">
            Live in <span className="text-neo">five days.</span>
          </h2>
          <a
            {...waLinkProps('process-day5', WA_PREFILL.process)}
            data-reveal
            className="pill pill-solid"
          >
            <WhatsappLogo weight="fill" size={16} />
            WhatsApp
          </a>
        </div>

        <ol className="relative mt-12 grid gap-8 md:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-6">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[2.35rem] hidden h-px bg-grey lg:block"
          />
          {PHASES.map((p) => (
            <li key={p.key} data-reveal className="relative lg:pt-14">
              <span
                aria-hidden="true"
                className="absolute left-0 top-[2.1rem] hidden h-2.5 w-2.5 rounded-full bg-neo lg:block"
              />
              <span className="font-display text-xs text-neo">{p.duration}</span>
              <h3 className="display-md mt-2">{p.label}</h3>
              <p className="mt-3 max-w-[30ch] text-[15px] leading-relaxed text-mist">{p.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
