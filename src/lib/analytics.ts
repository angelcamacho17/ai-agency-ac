/**
 * Google Analytics 4, cargado tarde y a propósito.
 *
 * Por qué no el snippet que da Google: este sitio es WebGL con scroll
 * coreografiado, y gtag.js pesa ~50 KB. Cargarlo en el <head> compite por red
 * y CPU exactamente durante el primer scroll, que es lo único que no podemos
 * permitirnos arruinar. Aquí se carga tras `requestIdleCallback` (o al primer
 * gesto del visitante, lo que ocurra antes), así que nunca entra en el camino
 * crítico del render.
 *
 * Decisiones que no son negociables:
 *   - NUNCA en el prerender. `isStaticRender()` corta todo: si gtag corriera
 *     durante el snapshot de Puppeteer, cada build inflaría tus métricas con
 *     visitas falsas y el HTML shippearía el script de GA.
 *   - Sin PII. Solo mandamos de dónde salió el clic, nunca lo que el visitante
 *     escribe ni su número de WhatsApp.
 *   - `send_page_view: false` y lo emitimos nosotros, porque el cambio de
 *     idioma no recarga la página y GA4 contaría una sola vista para dos.
 */

import { isStaticRender } from './staticMode'

/** Se inyecta en build. Sin ID, el módulo entero es un no-op. */
const GA_ID = import.meta.env.VITE_GA_ID as string | undefined

type Params = Record<string, string | number | boolean>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let loaded = false

/** Respeta la señal del navegador de "no me rastrees". */
function optedOut(): boolean {
  const nav = navigator as Navigator & { doNotTrack?: string; globalPrivacyControl?: boolean }
  return nav.doNotTrack === '1' || nav.globalPrivacyControl === true
}

function enabled(): boolean {
  return Boolean(GA_ID) && typeof window !== 'undefined' && !isStaticRender() && !optedOut()
}

/**
 * Inserta gtag.js una sola vez. La cola `dataLayer` existe desde antes de que
 * el script llegue, así que un evento disparado durante la carga no se pierde:
 * se encola y se envía cuando gtag arranca.
 */
function load() {
  if (loaded || !enabled()) return
  loaded = true

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID!, {
    // Las vistas las emitimos a mano: el toggle de idioma no recarga nada.
    send_page_view: false,
    anonymize_ip: true,
  })

  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)
}

/**
 * Arranca la carga fuera del camino crítico. Idle primero; si el visitante
 * interactúa antes, cargamos ahí para no perder sus eventos.
 */
export function initAnalytics() {
  if (!enabled()) return

  const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => void })
    .requestIdleCallback
  if (idle) idle(load)
  else setTimeout(load, 2500)

  const onFirst = () => {
    load()
    for (const ev of ['pointerdown', 'keydown', 'touchstart']) {
      window.removeEventListener(ev, onFirst)
    }
  }
  for (const ev of ['pointerdown', 'keydown', 'touchstart']) {
    window.addEventListener(ev, onFirst, { once: true, passive: true })
  }
}

/** Emite un evento. Si GA aún no cargó, `dataLayer` lo encola. */
export function track(event: string, params: Params = {}) {
  if (!enabled()) return
  load()
  window.gtag?.('event', event, params)
}

/** Vista de página. Se llama en el montaje y en cada cambio de idioma. */
export function trackPageView(lang: string) {
  track('page_view', {
    page_location: window.location.href,
    page_path: window.location.pathname,
    language: lang,
  })
}

/**
 * EL evento que importa: un clic a WhatsApp es la única conversión del sitio.
 * `source` es el `CtaSource` tipado que ya llevaba cada enlace, así que el
 * informe dice "hero" o "mobile-bar", no "enlace número 7".
 */
export function trackCtaClick(source: string) {
  track('whatsapp_click', { cta_source: source })
}
