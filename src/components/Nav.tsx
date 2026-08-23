import type { MouseEvent } from 'react'
import { Translate, WhatsappLogo } from '@phosphor-icons/react'
import { WA_PREFILL, waLinkProps } from '../lib/whatsapp'
import { scrollToChapter } from '../lib/chapters'
import { useLang } from '../lib/lang'

export function Nav() {
  const { lang, ui, setLang } = useLang()
  const links = [
    { label: ui.nav.agent, id: 'agent' },
    { label: ui.nav.process, id: 'process' },
    { label: ui.nav.clients, id: 'clients' },
    { label: ui.nav.questions, id: 'questions' },
  ]

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToChapter(id)
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-3 px-5 sm:px-8 lg:px-10">
        <a href="#top" onClick={go('top')} className="flex items-center gap-2.5" aria-label="Michelangelo">
          <img src="/m-mark.png" alt="" width={36} height={18} className="h-[18px] w-auto" />
          <span className="hidden font-display text-[15px] font-medium tracking-tight sm:inline">michelangelo.</span>
        </a>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Secciones">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={go(l.id)} className="pill">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="pill gap-1.5 px-3"
            aria-label={ui.langLabel}
            title={ui.langLabel}
          >
            <Translate size={16} />
            <span className={lang === 'es' ? 'text-paper' : 'text-faint'}>ES</span>
            <span className="text-faint">/</span>
            <span className={lang === 'en' ? 'text-paper' : 'text-faint'}>EN</span>
          </button>
          <a {...waLinkProps('nav', WA_PREFILL.nav)} className="pill pill-solid">
            <WhatsappLogo weight="fill" size={16} />
            {ui.whatsapp}
          </a>
        </div>
      </div>
    </header>
  )
}
