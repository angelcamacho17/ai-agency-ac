import { PROOF } from '../content/offer'
import { useReveal } from '../hooks/useReveal'

const DASHBOARD = [
  'Every conversation in one inbox, with the ones that need a human ranked first',
  'Take over any chat, pause the agent, hand it back',
  'A pipeline that moves leads on its own and tells you why',
  'Hours saved, conversations automated, hot leads and their value',
]

/**
 * Real numbers from our own production systems, then what the owner actually
 * gets to look at every morning.
 */
export default function Proof() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="proof" ref={ref} className="chapter">
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h2 data-reveal className="display-lg max-w-[16ch]">
            Built like software, <span className="text-neo">not like a demo.</span>
          </h2>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-14">
            {PROOF.map((p) => (
              <div key={p.label} data-reveal>
                <dd className="font-display text-5xl font-medium tracking-tight text-neo lg:text-6xl">
                  {p.value}
                </dd>
                <dt className="mt-2 max-w-[28ch] text-[15px] leading-relaxed text-mist">{p.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5 lg:pt-2">
          <h3 data-reveal className="display-md">You see everything.</h3>
          <p data-reveal className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-mist">
            Every agent ships with a dashboard for your team, in Spanish, on your phone.
          </p>
          <ul className="mt-6 space-y-4">
            {DASHBOARD.map((d) => (
              <li key={d} data-reveal className="border-t border-grey pt-4 text-[15px] leading-relaxed text-paper">
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
