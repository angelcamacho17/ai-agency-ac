import { useReveal } from '../hooks/useReveal'
import { useLang } from '../lib/lang'

export default function Proof() {
  const ref = useReveal<HTMLElement>()
  const { t, ui } = useLang()
  const [a, b] = ui.proofH

  return (
    <section id="proof" ref={ref} className="chapter">
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h2 data-reveal className="display-lg max-w-[16ch]">
            {a}<span className="text-neo">{b}</span>
          </h2>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-14">
            {t.PROOF.map((p) => (
              <div key={p.label} data-reveal>
                <dd className="font-display text-5xl font-medium tracking-tight text-neo lg:text-6xl">{p.value}</dd>
                <dt className="mt-2 max-w-[28ch] text-[15px] leading-relaxed text-mist">{p.label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-5 lg:pt-2">
          <h3 data-reveal className="display-md">{ui.dashboardH}</h3>
          <ul className="mt-6 space-y-4">
            {t.DASHBOARD.map((d) => (
              <li key={d} data-reveal className="border-t border-grey pt-4 text-[15px] leading-relaxed text-paper">{d}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
