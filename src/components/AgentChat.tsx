import { useEffect } from 'react'
import { isStaticRender } from '../lib/staticMode'

/**
 * Alex, the live agent, as the site's own chat bubble.
 *
 * This is the same agent that answers Michelangelo's Instagram and WhatsApp:
 * same system prompt, same qualification, same close (Angel's WhatsApp link or
 * a Meet call). It runs on the agents server's public web channel, which
 * serves a tiny loader that pulls the per-tenant theme and the versioned
 * widget bundle. Nothing about the agent lives in this repo.
 *
 * Injected from an effect instead of a <script> tag in index.html because the
 * prerender snapshots the live DOM: a static tag would run inside Puppeteer
 * and bake the widget's markup into dist/index.html, then boot a second one
 * on top of it in the visitor's browser. Same rule as analytics: never in
 * the static render.
 *
 * The server only answers origins on its allowlist (www and apex). Until the
 * channel is enabled for this tenant the loader gets a 404 for the config and
 * draws nothing, which is right in production. In `npm run dev` that would
 * leave nothing to look at, so dev falls back to a preview: the real widget
 * bundle with the landing's palette. Its messages fail until the origin is
 * allowed server-side; it exists to see the chat, not to talk to it.
 */
const AGENT_SERVER =
  (import.meta.env.VITE_AGENT_SERVER as string | undefined) ?? 'https://michelangelo-agents-group-1.onrender.com'
const AGENT_CLIENT = 'michelangelo'

/** Dev-only stand-in for /web/config. The real one lives in the agents repo
 *  (src/clients/michelangelo/definition.ts, webTheme / webStrings). */
const PREVIEW_CONFIG = {
  // v16 trae el banner de consentimiento único, consentPerPage, el panel que
  // tapa la burbuja y el borde/halo. Hasta que el servidor lo publique responde
  // 404 y el preview cae a v15 (solo colores y saludo).
  bundleUrls: ['/widget-assets/widget.v16.js', '/widget-assets/widget.v15.js'],
  turnstileSiteKey: '1x00000000000000000000AA',
  theme: {
    primary: '#d4e04a',
    accent2: '#d4e04a',
    deep: '#aab82a',
    dark: true,
    position: 'right',
    avatarUrl: '/m-mark.png',
    surface: '#161616',
    surfaceAlt: '#222222',
    surfaceBorder: '#303030',
    footerBg: '#161616',
    botBg: '#242424',
    botText: '#f3f3ee',
    botBorder: '#333333',
    botLink: '#d4e04a',
    inputText: '#f3f3ee',
    consentText: '#c9c9c2',
    headerGrad: 'linear-gradient(135deg,#262626 0%,#161616 100%)',
    headerFg: '#f3f3ee',
    accentGrad: 'linear-gradient(135deg,#d4e04a 0%,#d4e04a 100%)',
    sendFg: '#0a0a0a',
    sendRadius: '50%',
    placeholderFg: '#8c8c86',
    userBg: '#d4e04a',
    userFg: '#0a0a0a',
    panelBorder: '1px solid rgba(212,224,74,.55)',
    panelShadow: '0 0 0 4px rgba(212,224,74,.08),0 0 48px rgba(212,224,74,.16),0 24px 70px rgba(0,0,0,.85)',
    panelCoversBubble: true,
    consentPerPage: true,
  },
  strings: {
    title: 'Alex · Michelangelo Devs (preview)',
    greeting:
      'Hola, soy Alex, de Michelangelo Devs. Cuéntame de tu negocio y qué te gustaría automatizar.',
    placeholder: 'Escribe tu mensaje…',
    consentText:
      'Al chatear, aceptas que procesemos tus mensajes para atenderte. No compartas datos sensibles.',
    operatorJoined: 'Angel se unió a la conversación y te responde por aquí.',
  },
}

declare global {
  interface Window {
    __mzWidgetConfig?: unknown
    __mzWidgetLoaded?: boolean
  }
}

function injectScript(src: string, attrs: Record<string, string> = {}) {
  const s = document.createElement('script')
  s.src = src
  s.async = true
  s.dataset.agentChat = ''
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v)
  document.body.appendChild(s)
  return s
}

function bootLoader() {
  injectScript(`${AGENT_SERVER}/widget.js`, { 'data-client': AGENT_CLIENT })
}

function bootPreview() {
  window.__mzWidgetLoaded = true
  window.__mzWidgetConfig = {
    client: AGENT_CLIENT,
    server: AGENT_SERVER,
    turnstileSiteKey: PREVIEW_CONFIG.turnstileSiteKey,
    theme: PREVIEW_CONFIG.theme,
    strings: PREVIEW_CONFIG.strings,
  }
  const [first, fallback] = PREVIEW_CONFIG.bundleUrls
  const s = injectScript(AGENT_SERVER + first)
  s.onerror = () => injectScript(AGENT_SERVER + fallback)
  console.info('[agent-chat] web channel not enabled for this origin yet; showing the dev preview')
}

/**
 * The widget renders inside an open shadow root, so the page's stylesheet
 * cannot reach it. Two fixes have to be injected into that root instead:
 *   - The custom cursor sets `cursor: none` on every element, the widget's
 *     host included, and the dot sits far below the widget's z-index. Without
 *     this the pointer vanishes over the chat.
 *   - On phones the WhatsApp bar docks at the bottom edge; the closed bubble
 *     is lifted above it. Once open (`.mz-is-open`, widget v16) the panel
 *     covers the bubble and goes back down to the edge, over the bar.
 */
const SHADOW_CSS = `
.mz-wrap{cursor:auto;}
@media (max-width:767px){.mz-wrap:not(.mz-is-open){bottom:calc(6rem + env(safe-area-inset-bottom));}}
`

function patchWidgetWhenMounted() {
  const patch = () => {
    for (const el of Array.from(document.body.children)) {
      const root = el.shadowRoot
      if (!root?.querySelector('.mz-wrap')) continue
      if (!root.querySelector('style[data-agent-chat]')) {
        const style = document.createElement('style')
        style.dataset.agentChat = ''
        style.textContent = SHADOW_CSS
        root.appendChild(style)
      }
      return true
    }
    return false
  }
  if (patch()) return
  const mo = new MutationObserver(() => {
    if (patch()) mo.disconnect()
  })
  mo.observe(document.body, { childList: true })
}

export function AgentChat() {
  useEffect(() => {
    if (isStaticRender()) return
    if (document.querySelector('script[data-agent-chat]')) return
    patchWidgetWhenMounted()

    if (!import.meta.env.DEV) {
      bootLoader()
      return
    }
    fetch(`${AGENT_SERVER}/api/${AGENT_CLIENT}/web/config`)
      .then((r) => (r.ok ? bootLoader() : bootPreview()))
      .catch(bootPreview)
    // No cleanup: the loader guards itself with a window flag and the widget
    // owns its DOM from here on, so removing the tag would not unmount it.
  }, [])

  return null
}
