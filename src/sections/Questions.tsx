import { useReveal } from '../hooks/useReveal'
import { useLang } from '../lib/lang'

/**
 * Every answer renders OPEN, never inside <details>: the FAQPage JSON-LD must
 * match the visible (Spanish) text exactly, and both read the same array.
 */
export default function Questions() {
  const ref = useReveal<HTMLElement>()
  const { t, ui } = useLang()
  const [a, b] = ui.faqH

  return (
    <section id="questions" ref={ref} aria-labelledby="questions-heading" className="px-5 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto w-full max-w-[1600px]">
        <h2 id="questions-heading" data-reveal className="display-lg max-w-[14ch]">
          {a}<span className="text-neo">{b}</span>
        </h2>
        <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {t.FAQ.map((item) => (
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
