import { ArrowUpRight, InstagramLogo, WhatsappLogo } from '@phosphor-icons/react'
import { WA_DISPLAY, WA_PREFILL, waLinkProps } from '../lib/whatsapp'
import { useReveal } from '../hooks/useReveal'
import { useLang } from '../lib/lang'

export default function FinalCta() {
  const ref = useReveal<HTMLElement>()
  const { t, ui } = useLang()

  return (
    <section id="contact" ref={ref} className="px-5 pb-10 pt-12 sm:px-10 lg:px-16 lg:pt-16">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="rounded-[2rem] bg-neo px-6 py-16 text-ink sm:px-12 sm:py-24 lg:px-20 lg:py-28">
          <h2 data-reveal className="display-xl max-w-[12ch]">{ui.ctaH}</h2>
          <p data-reveal className="mt-6 max-w-[44ch] text-base leading-relaxed sm:text-lg">{ui.ctaP}</p>
          <div data-reveal className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={t.ORG.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-base font-semibold text-paper transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <InstagramLogo weight="fill" size={20} />
              {t.ORG.instagramHandle}
              <ArrowUpRight size={16} />
            </a>
            <a
              {...waLinkProps('final-cta', WA_PREFILL.default)}
              className="inline-flex items-center gap-2 rounded-full border border-ink/40 px-5 py-3 text-sm font-semibold text-ink hover:border-ink"
            >
              <WhatsappLogo weight="fill" size={16} />
              {ui.whatsapp}
            </a>
          </div>
        </div>

        <footer className="mt-10 flex flex-col gap-4 text-sm text-faint sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5 text-paper">
            <img src="/m-mark.png" alt="" width={30} height={15} className="h-[15px] w-auto" />
            <span className="font-display text-[13px] font-medium">michelangelo.</span>
          </div>
          <p>
            {t.ORG.name}. {ui.footer}{' '}
            <a {...waLinkProps('footer', WA_PREFILL.default)} className="text-paper hover:text-neo">{WA_DISPLAY}</a>
          </p>
        </footer>
      </div>
    </section>
  )
}
