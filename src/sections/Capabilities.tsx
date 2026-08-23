import { useReveal } from '../hooks/useReveal'
import { useLang } from '../lib/lang'

export default function Capabilities() {
  const ref = useReveal<HTMLElement>()
  const { t, ui } = useLang()
  const [a, b, c] = ui.capabilitiesH

  return (
    <section id="capabilities" ref={ref} className="chapter">
      <div className="mx-auto w-full max-w-[1600px]">
        <h2 data-reveal className="display-lg max-w-[18ch]">
          {a} {b}<span className="text-neo">{c}</span>
        </h2>

        <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:mt-14 lg:grid-cols-5 lg:gap-y-10">
          {t.CAPABILITIES.map((cap) => (
            <li key={cap.key} data-reveal className="border-t border-grey pt-4">
              <h3 className="display-sm">{cap.title}</h3>
              <p className="mt-1.5 text-sm leading-snug text-faint">{cap.copy}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
