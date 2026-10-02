/**
 * PostHog, cargado tarde y a propósito.
 *
 * Elegido sobre GA4 por dos razones concretas para esta landing: graba la
 * sesión y dibuja mapas de calor (ves el cursor real, no solo el conteo del
 * clic), y en modo `persistence: 'memory'` no escribe cookies, así que no
 * obliga a poner un banner de consentimiento encima de un hero WebGL.
 *
 * Por qué no el snippet que da PostHog: su bundle con grabaciones pesa ~45 KB
 * y el snippet oficial va en el <head>. Este sitio es WebGL con scroll
 * coreografiado, y esa carga competiría por red y CPU exactamente durante el
 * primer scroll. Aquí entra tras `requestIdleCallback` (o al primer gesto del
 * visitante, lo que ocurra antes), fuera del camino crítico del render.
 *
 * Decisiones que no son negociables:
 *   - NUNCA en el prerender. `isStaticRender()` corta todo: si PostHog corriera
 *     durante el snapshot de Puppeteer, cada build inflaría las métricas con
 *     visitas falsas y grabaciones de un navegador headless.
 *   - Sin PII. Mandamos de dónde salió el clic, nunca lo que el visitante
 *     escribe. Los campos de texto se enmascaran en las grabaciones.
 *   - Las vistas las emitimos nosotros, porque el cambio de idioma no recarga
 *     la página y PostHog contaría una sola vista para dos idiomas.
 */

import { isStaticRender } from './staticMode'

/** Se inyectan en build. Sin key, el módulo entero es un no-op. */
const PH_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined
const PH_HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? 'https://us.i.posthog.com'

type Params = Record<string, string | number | boolean>

type PostHog = {
  init: (key: string, opts: Record<string, unknown>) => void
  capture: (event: string, props?: Params) => void
}

declare global {
  interface Window {
    posthog?: PostHog
  }
}

let loaded = false
/** Eventos disparados antes de que el SDK llegue. Se vacía al cargar. */
const queue: Array<[string, Params]> = []

/** Respeta la señal del navegador de "no me rastrees". */
function optedOut(): boolean {
  const nav = navigator as Navigator & { doNotTrack?: string; globalPrivacyControl?: boolean }
  return nav.doNotTrack === '1' || nav.globalPrivacyControl === true
}

function enabled(): boolean {
  return Boolean(PH_KEY) && typeof window !== 'undefined' && !isStaticRender() && !optedOut()
}

/**
 * Carga el SDK una sola vez y vacía la cola. Import dinámico en vez de una
 * etiqueta <script>: así el bundle de PostHog queda en su propio chunk y no
 * entra en el JS inicial que bloquea el primer render.
 */
async function load() {
  if (loaded || !enabled()) return
  loaded = true

  try {
    const mod = await import('posthog-js')
    const ph = mod.default

    ph.init(PH_KEY!, {
      api_host: PH_HOST,
      // Sin cookies ni localStorage: evita el banner de consentimiento. El
      // coste es que un visitante que vuelve cuenta como nuevo, que para una
      // landing de conversión es un precio justo.
      persistence: 'memory',
      // Las emitimos a mano: el toggle de idioma no recarga la página.
      capture_pageview: false,
      capture_pageleave: true,
      // Lo que motivó elegir PostHog: ver cómo navegan de verdad.
      disable_session_recording: false,
      session_recording: {
        // Nunca grabar lo que la gente teclea.
        maskAllInputs: true,
      },
      autocapture: false, // Medimos eventos con nombre, no todo clic del DOM.
    })

    window.posthog = ph as unknown as PostHog
    for (const [event, props] of queue) ph.capture(event, props)
    queue.length = 0
  } catch {
    // Un fallo de red del SDK no debe romper la página.
  }
}

/**
 * Arranca la carga fuera del camino crítico. Idle primero; si el visitante
 * interactúa antes, cargamos ahí para no perder sus eventos.
 */
export function initAnalytics() {
  if (!enabled()) return

  const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => void })
    .requestIdleCallback
  if (idle) idle(() => void load())
  else setTimeout(() => void load(), 2500)

  const events = ['pointerdown', 'keydown', 'touchstart'] as const
  const onFirst = () => {
    void load()
    for (const ev of events) window.removeEventListener(ev, onFirst)
  }
  for (const ev of events) {
    window.addEventListener(ev, onFirst, { once: true, passive: true })
  }
}

/** Emite un evento. Si el SDK aún no cargó, se encola. */
export function track(event: string, params: Params = {}) {
  if (!enabled()) return
  if (window.posthog) window.posthog.capture(event, params)
  else {
    queue.push([event, params])
    void load()
  }
}

/** Vista de página. Se llama en el montaje y en cada cambio de idioma. */
export function trackPageView(lang: string) {
  track('$pageview', {
    $current_url: window.location.href,
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
