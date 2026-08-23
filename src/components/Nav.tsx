import type { MouseEvent } from 'react'
import { WhatsappLogo } from '@phosphor-icons/react'
import { WA_PREFILL, waLinkProps } from '../lib/whatsapp'
import { scrollToChapter } from '../lib/chapters'

const LINKS = [
  { label: 'Agents', id: 'agents' },
  { label: 'Process', id: 'process' },
  { label: 'Clients', id: 'clients' },
  { label: 'Questions', id: 'questions' },
]

export function Nav() {
  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToChapter(id)
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="#top" onClick={go('top')} className="flex items-center gap-2.5" aria-label="Michelangelo, back to top">
          <img src="/m-mark.png" alt="" width={36} height={18} className="h-[18px] w-auto" />
          <span className="font-display text-[15px] font-medium tracking-tight">michelangelo.</span>
        </a>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Sections">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={go(l.id)} className="pill">
              {l.label}
            </a>
          ))}
        </nav>

        <a {...waLinkProps('nav', WA_PREFILL.nav)} className="pill pill-solid">
          <WhatsappLogo weight="fill" size={16} />
          WhatsApp
        </a>
      </div>
    </header>
  )
}
