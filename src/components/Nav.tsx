import { WhatsappLogo } from '@phosphor-icons/react'
import { WA_PREFILL, waLinkProps } from '../lib/whatsapp'

const LINKS = [
  { label: 'Agents', href: '#agents' },
  { label: 'How it works', href: '#process' },
  { label: 'Questions', href: '#questions' },
]

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-[64px] max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-acid" />
          <span className="font-mono text-[13px] font-medium tracking-tight">
            michelangelo<span className="text-acid">devs</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[13px] text-mist transition-colors hover:text-paper"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          {...waLinkProps('nav', WA_PREFILL.nav)}
          className="inline-flex items-center gap-1.5 rounded-full bg-acid px-4 py-2 text-[13px] font-semibold text-ink transition-transform active:scale-[0.97]"
        >
          <WhatsappLogo weight="fill" size={16} />
          WhatsApp
        </a>
      </div>
    </header>
  )
}
