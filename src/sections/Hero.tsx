import { ArrowRight, WhatsappLogo } from '@phosphor-icons/react'
import { PartnerBadge } from '../components/PartnerBadge'
import { WA_PREFILL, waLinkProps } from '../lib/whatsapp'
import { useReveal } from '../hooks/useReveal'
import { scrollToChapter } from '../lib/chapters'
import { useLang } from '../lib/lang'

export default function Hero() {
  const ref = useReveal<HTMLElement>()
  const { t, ui } = useLang()
  // Split the tagline at the channel clause so the channels take the accent.
  const [lead, rest] = splitTagline(t.ORG.tagline)

  return (
    <section id="top" ref={ref} className="chapter">
      <div className="mx-auto grid w-full max-w-[1600px] gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <img src="/m-mark.png" alt="" width={576} height={290} data-reveal className="mb-6 h-14 w-auto sm:h-16 lg:h-20" />
          <h1 data-reveal className="display-xl lg:text-[clamp(2.2rem,4.9vw,5.6rem)]">
            {lead}
            <span className="block text-neo">{rest}</span>
          </h1>

          <div data-reveal className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 lg:mt-10">
            <PartnerBadge className="h-14 sm:h-16" />
            <p className="font-display text-lg font-medium leading-snug tracking-tight sm:text-xl">
              {ui.partnerH[0]}
              <span className="text-neo">{ui.partnerH[1]}</span>
              <span className="block text-sm font-normal text-mist sm:text-base">{ui.partnerSub}</span>
            </p>
          </div>
        </div>

        <div className="lg:col-span-4 lg:pb-2">
          <p data-reveal className="max-w-[34ch] text-base leading-relaxed text-mist sm:text-lg">
            {t.ORG.definition}
          </p>
          <div data-reveal className="mt-7 flex flex-wrap gap-3">
            <a {...waLinkProps('hero', WA_PREFILL.hero)} className="pill pill-solid">
              <WhatsappLogo weight="fill" size={16} />
              {ui.whatsapp}
            </a>
            <a
              href="#clients"
              onClick={(e) => {
                e.preventDefault()
                scrollToChapter('clients')
              }}
              className="pill"
            >
              {ui.seeWork}
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function splitTagline(s: string): [string, string] {
  const i = Math.max(s.indexOf(' en WhatsApp'), s.indexOf(' on WhatsApp'))
  return i > 0 ? [s.slice(0, i), s.slice(i + 1)] : [s, '']
}
