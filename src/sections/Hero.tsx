import { ArrowRight, WhatsappLogo } from '@phosphor-icons/react'
import { ORG } from '../content/offer'
import { WA_PREFILL, waLinkProps } from '../lib/whatsapp'
import { useReveal } from '../hooks/useReveal'
import { scrollToChapter } from '../lib/chapters'

export default function Hero() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="top" ref={ref} className="chapter">
      <div className="mx-auto grid w-full max-w-[1600px] gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <img
            src="/m-mark.png"
            alt=""
            width={576}
            height={290}
            data-reveal
            className="mb-8 h-16 w-auto sm:h-20 lg:h-24"
          />
          <h1 data-reveal className="display-xl">
            AI agents that answer, qualify and close
            <span className="block text-neo">on WhatsApp, Instagram and your site.</span>
          </h1>
        </div>

        <div className="lg:col-span-4 lg:pb-2">
          <p data-reveal className="max-w-[34ch] text-base leading-relaxed text-mist sm:text-lg">
            {ORG.definition}
          </p>
          <div data-reveal className="mt-7 flex flex-wrap gap-3">
            <a {...waLinkProps('hero', WA_PREFILL.hero)} className="pill pill-solid">
              <WhatsappLogo weight="fill" size={16} />
              WhatsApp
            </a>
            <a
              href="#clients"
              onClick={(e) => {
                e.preventDefault()
                scrollToChapter('clients')
              }}
              className="pill"
            >
              See the work
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
