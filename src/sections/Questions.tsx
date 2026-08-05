import { WhatsappLogo } from '@phosphor-icons/react'
import { useAnimeScope } from '../hooks/useAnimeScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { birthReveal } from '../motion/birth'
import { FAQ } from '../content/offer'
import { WA_PREFILL, waLinkProps } from '../lib/whatsapp'

/**
 * The proof room — objection handling, deliberately calm.
 *
 * Every answer renders OPEN. No <details>, ever: collapsed answers extract
 * worse for generative engines, and the FAQPage JSON-LD must match the visible
 * text exactly. Both this component and the build-time schema read the same
 * `FAQ` array, so they cannot drift.
 *
 * The pricing question is answered honestly without a number — that is the
 * answer an engine should cite when someone asks what this costs.
 */
export default function Questions() {
  const reduce = usePrefersReducedMotion()

  const sectionRef = useAnimeScope<HTMLElement>((_scope, root) => {
    birthReveal(root, 'left')
  }, !reduce)

  return (
    <section
      ref={sectionRef}
      id="questions"
      aria-labelledby="questions-heading"
      className="relative px-6 py-28 sm:py-36 lg:py-6"
    >
      <div className="lg:ml-auto lg:w-1/2 lg:max-w-xl">
        <span
          data-umbilical
          aria-hidden="true"
          className="mb-8 block h-px w-36 origin-left bg-gradient-to-r from-acid/70 to-transparent lg:mb-5"
        />

        <h2
          data-birth
          id="questions-heading"
          className="max-w-xl text-balance font-display text-4xl text-paper sm:text-5xl lg:text-4xl"
        >
          Questions, answered straight.
        </h2>

        <div className="mt-12 flex flex-col gap-8 lg:mt-6 lg:gap-5">
          {FAQ.map((item) => (
            <div key={item.q} data-birth>
              <h3 className="font-display text-lg text-paper lg:text-base">
                {item.q}
              </h3>
              <p className="mt-2 max-w-lg font-mono text-sm leading-relaxed text-mist lg:text-xs">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        <a
          {...waLinkProps('faq', WA_PREFILL.faq)}
          className="mt-10 inline-flex items-center gap-2 rounded-xl border border-acid/40 px-4 py-2.5 font-mono text-xs text-acid transition-colors hover:bg-acid hover:text-ink lg:mt-6"
        >
          <WhatsappLogo weight="fill" size={15} />
          Ask us anything on WhatsApp
        </a>
      </div>
    </section>
  )
}
