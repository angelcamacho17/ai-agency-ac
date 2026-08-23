import { PlayCircle, WhatsappLogo } from '@phosphor-icons/react'
import { WA_PREFILL, waLinkProps } from '../lib/whatsapp'
import { useReveal } from '../hooks/useReveal'
import { useLang } from '../lib/lang'

/**
 * The agent on video. Each slot embeds a Loom by share id; a slot without an
 * id renders as a quiet placeholder that points at WhatsApp instead.
 */
export default function Demo() {
  const ref = useReveal<HTMLElement>()
  const { t, ui } = useLang()
  const [a, b] = ui.demoH

  return (
    <section id="demo" ref={ref} className="chapter">
      <div className="mx-auto w-full max-w-[1600px]">
        <h2 data-reveal className="display-lg max-w-[14ch]">
          {a}<span className="text-neo">{b}</span>
        </h2>
        <ul className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-2 lg:gap-6">
          {t.DEMOS.map((d) => (
            <li key={d.key} data-reveal>
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink-2">
                {d.loomId ? (
                  <iframe
                    src={`https://www.loom.com/embed/${d.loomId}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`}
                    title={d.title}
                    allow="fullscreen"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-faint">
                    <PlayCircle size={48} weight="thin" />
                    <span className="text-sm">{ui.demoEmpty}</span>
                    <a {...waLinkProps('demo-handoff', WA_PREFILL.demoHandoff)} className="pill mt-1">
                      <WhatsappLogo weight="fill" size={15} />
                      {ui.demoAsk}
                    </a>
                  </div>
                )}
              </div>
              <h3 className="display-sm mt-4">{d.title}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
