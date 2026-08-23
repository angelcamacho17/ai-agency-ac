import { FAQ } from '../content/offer'
import { useReveal } from '../hooks/useReveal'

/**
 * Objection handling, deliberately calm, back in vertical flow after the
 * horizontal journey.
 *
 * Every answer renders OPEN. No <details>, ever: collapsed answers extract
 * worse for generative engines, and the FAQPage JSON-LD must match the visible
 * text exactly. Both this component and the build-time schema read the same
 * `FAQ` array, so they cannot drift.
 */
export default function Questions() {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      id="questions"
      ref={ref}
      aria-labelledby="questions-heading"
      className="px-5 py-24 sm:px-10 lg:px-16 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <h2 id="questions-heading" data-reveal className="display-lg max-w-[14ch]">
          Questions, <span className="text-neo">answered straight.</span>
        </h2>

        <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {FAQ.map((item) => (
            <div key={item.q} data-reveal className="border-t border-grey pt-4">
              <dt className="display-sm">{item.q}</dt>
              <dd className="mt-3 text-[15px] leading-relaxed text-mist">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
