import { useEffect, useState } from 'react'
import { WhatsappLogo } from '@phosphor-icons/react'
import { WA_PREFILL, waLinkProps } from '../lib/whatsapp'
import { isStaticRender } from '../lib/staticMode'

/**
 * Bottom-docked WhatsApp bar, mobile only.
 *
 * Mobile had no CTA at all — the nav's links and its button live behind
 * `hidden md:flex`, so a phone visitor who scrolled past the hero had nothing
 * to tap. Mobile is where a WhatsApp business actually converts, so this is
 * the highest-value placement on the page.
 *
 * It appears only after the hero leaves (so it never competes with the hero's
 * own CTA), and hides itself while a text input is focused so it can never
 * cover the on-screen keyboard.
 */
export function MobileWhatsappBar() {
  const [shown, setShown] = useState(false)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (isStaticRender()) return

    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.85)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Any focused text entry means the keyboard is up — get out of its way.
    const isTextEntry = (el: EventTarget | null) =>
      el instanceof HTMLElement &&
      (el.tagName === 'INPUT' ||
        el.tagName === 'TEXTAREA' ||
        el.isContentEditable)

    const onFocusIn = (e: FocusEvent) => {
      if (isTextEntry(e.target)) setTyping(true)
    }
    const onFocusOut = () => setTyping(false)

    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  const visible = shown && !typing

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-300 md:hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(120%)',
        visibility: visible ? 'visible' : 'hidden',
      }}
      aria-hidden={!visible}
    >
      <a
        {...waLinkProps('mobile-bar', WA_PREFILL.default)}
        tabIndex={visible ? 0 : -1}
        className="pointer-events-auto flex items-center justify-center gap-2.5 rounded-2xl bg-neo px-6 py-4 font-display text-sm font-semibold text-ink shadow-[0_8px_32px_rgba(0,0,0,0.5)] active:scale-[0.98]"
      >
        <WhatsappLogo weight="fill" size={20} />
        Message us on WhatsApp
      </a>
    </div>
  )
}
