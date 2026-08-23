import { CAPABILITIES } from '../content/offer'
import { useReveal } from '../hooks/useReveal'

/**
 * What every agent ships with. Ten behaviours in a plain five-column grid,
 * no cards: the headline carries the chapter, the grid is the evidence.
 */
export default function Capabilities() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="capabilities" ref={ref} className="chapter">
      <div className="mx-auto w-full max-w-[1600px]">
        <h2 data-reveal className="display-lg max-w-[18ch]">
          Not a chatbot. A salesperson that <span className="text-neo">never sleeps.</span>
        </h2>

        <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:mt-14 lg:grid-cols-5 lg:gap-y-10">
          {CAPABILITIES.map((c) => (
            <li key={c.key} data-reveal className="border-t border-grey pt-4">
              <h3 className="display-sm">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-snug text-faint">{c.copy}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
