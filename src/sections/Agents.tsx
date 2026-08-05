import { WhatsappLogo } from '@phosphor-icons/react'
import { useAnimeScope } from '../hooks/useAnimeScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { birthReveal } from '../motion/birth'
import { AGENTS, agentWaPrefill } from '../content/offer'
import { waLinkProps } from '../lib/whatsapp'

/**
 * The agent catalog — the offer itself, in buyer language.
 *
 * Every card is a real <article> with an <h3> named the way someone would
 * actually search for it ("WhatsApp Sales Agent", not a studio codename),
 * a self-contained definition sentence, and its own WhatsApp CTA carrying a
 * prefill that names the agent. Nothing here lives inside the canvas and
 * nothing is hidden in markup, so this section is fully extractable by
 * crawlers and generative engines whether or not any script runs.
 */
export default function Agents() {
  const reduce = usePrefersReducedMotion()

  const sectionRef = useAnimeScope<HTMLElement>((_scope, root) => {
    birthReveal(root, 'right')
  }, !reduce)

  return (
    <section
      ref={sectionRef}
      id="agents"
      aria-labelledby="agents-heading"
      className="relative px-6 py-28 sm:py-36 lg:py-6"
    >
      <div className="lg:mr-auto lg:w-1/2 lg:max-w-2xl">
        <span
          data-umbilical
          aria-hidden="true"
          className="mb-8 ml-auto block h-px w-36 origin-right bg-gradient-to-l from-acid/70 to-transparent lg:mb-5"
        />

        <h2
          data-birth
          id="agents-heading"
          className="max-w-xl text-balance text-4xl text-paper sm:text-5xl lg:text-4xl"
        >
          The agents we build.
        </h2>

        <p data-birth className="mt-5 max-w-lg text-mist lg:mt-3 lg:text-sm">
          Five production agents, each one trained on how you actually sell and
          wired into the tools you already run.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:mt-6">
          {AGENTS.map((agent) => (
            <article
              key={agent.slug}
              id={agent.slug}
              className="group relative rounded-3xl border border-ink-3 bg-ink-2 p-6 transition-colors duration-300 hover:border-acid/40 lg:p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-xl text-paper lg:text-lg">{agent.name}</h3>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-faint">
                  {agent.channel}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-mist">
                {agent.definition}
              </p>

              <p className="mt-3 font-mono text-xs text-acid">
                {agent.outcome}
              </p>

              {/* A plain list, not a <dl>: every item is one behaviour with no
                  term/definition pairing, and a repeated <dt> label would just
                  add noise to the text a crawler or an LLM extracts. */}
              <ul className="mt-5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {agent.behaviours.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-acid/70"
                    />
                    <span className="text-xs leading-relaxed text-mist">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink-3 pt-4">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-faint">
                  Connects: {agent.connects.join(' · ')}
                </p>
                <a
                  {...waLinkProps('agent-card', agentWaPrefill(agent))}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-acid/40 px-3.5 py-2 font-mono text-xs text-acid transition-colors hover:bg-acid hover:text-ink"
                >
                  <WhatsappLogo weight="fill" size={14} />
                  Ask about this agent
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
