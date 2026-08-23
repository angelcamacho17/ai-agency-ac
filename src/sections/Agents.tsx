import { WhatsappLogo } from '@phosphor-icons/react'
import { AGENTS, agentWaPrefill } from '../content/offer'
import { waLinkProps } from '../lib/whatsapp'
import { useReveal } from '../hooks/useReveal'

/**
 * The five agents as five columns. Each column is quotable on its own: the
 * name, the channel, the one-line outcome and the definition sentence that
 * the JSON-LD OfferCatalog and llms.txt also carry.
 */
export default function Agents() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="agents" ref={ref} className="chapter">
      <div className="mx-auto w-full max-w-[1600px]">
        <h2 data-reveal className="display-lg max-w-[16ch]">
          Five agents. <span className="text-neo">One that fits your leak.</span>
        </h2>

        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-5 lg:gap-5">
          {AGENTS.map((a, i) => (
            <li
              key={a.slug}
              id={a.slug}
              data-reveal
              className="flex flex-col rounded-2xl bg-ink-2 p-5 lg:min-h-[22rem]"
            >
              <span className="font-display text-xs text-neo">{a.channel}</span>
              <h3 className="display-sm mt-3">{a.name}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-paper">{a.outcome}</p>
              <p className="mt-3 text-sm leading-relaxed text-faint">{a.definition}</p>
              <a
                {...waLinkProps('agent-card', agentWaPrefill(a))}
                className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-paper hover:text-neo"
                aria-label={`Ask about the ${a.name} on WhatsApp`}
              >
                <WhatsappLogo weight="fill" size={15} />
                Ask about this one
              </a>
              <span className="sr-only">{i + 1} of {AGENTS.length}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
