import { useEffect, useState } from 'react'
import { animate } from 'animejs'
import { ArrowRight } from '@phosphor-icons/react'
import { useReveal } from '../hooks/useReveal'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useLang } from '../lib/lang'

/**
 * Questions as an index. Wide screens: the questions run down the left as a
 * list you hover or focus, and the chosen answer reads large on the right.
 * Every answer stays in the DOM (the inactive ones carry `hidden`) and the
 * prerender / reduced-motion path renders the plain all-open list, so the
 * FAQPage JSON-LD still matches what a crawler sees.
 */
export default function Questions() {
  const ref = useReveal<HTMLElement>()
  const reduce = usePrefersReducedMotion()
  const { t, ui, lang } = useLang()
  const [a, b] = ui.faqH
  const [active, setActive] = useState(0)

  useEffect(() => setActive(0), [lang])

  useEffect(() => {
    if (reduce) return
    const el = ref.current?.querySelector<HTMLElement>(`[data-answer="${active}"]`)
    if (el) animate(el, { opacity: [0, 1], x: ['0.75rem', '0rem'], duration: 600, ease: 'outExpo' })
  }, [active, reduce, ref])

  return (
    <section id="questions" ref={ref} aria-labelledby="questions-heading" className="px-5 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto w-full max-w-[1600px]">
        <h2 id="questions-heading" data-reveal className="display-lg max-w-[14ch]">
          {a}<span className="text-neo">{b}</span>
        </h2>

        {reduce ? (
          <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {t.FAQ.map((item) => (
              <div key={item.q} className="border-t border-grey pt-4">
                <dt className="display-sm">{item.q}</dt>
                <dd className="mt-3 text-[15px] leading-relaxed text-mist">{item.a}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
            <ol data-reveal className="lg:col-span-5" role="tablist" aria-orientation="vertical">
              {t.FAQ.map((item, i) => {
                const on = i === active
                return (
                  <li key={item.q}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={on}
                      aria-controls={`faq-${i}`}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={`group flex w-full items-center justify-between gap-4 border-t border-grey py-4 text-left transition-colors ${
                        on ? 'text-neo' : 'text-paper hover:text-neo'
                      }`}
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-display text-xs text-faint">{String(i + 1).padStart(2, '0')}</span>
                        <span className="display-sm">{item.q}</span>
                      </span>
                      <ArrowRight size={18} className={`shrink-0 transition-transform ${on ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                    </button>
                    {/* Mobile: the answer sits under its own question. */}
                    <p className={`pb-5 text-[15px] leading-relaxed text-mist lg:hidden ${on ? '' : 'hidden'}`}>{item.a}</p>
                  </li>
                )
              })}
            </ol>

            <div data-reveal className="hidden lg:col-span-7 lg:block">
              <div className="sticky top-28 rounded-[2rem] bg-ink-2 p-10 xl:p-14">
                {t.FAQ.map((item, i) => (
                  <div key={item.q} id={`faq-${i}`} role="tabpanel" data-answer={i} hidden={i !== active}>
                    <p className="font-display text-xs text-neo">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="display-md mt-4">{item.q}</h3>
                    <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-mist xl:text-xl">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
