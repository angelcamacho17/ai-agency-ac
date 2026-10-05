/**
 * OpenAI Ads Measurement Pixel.
 *
 * Sintaxis tomada de la doc oficial, sin improvisar:
 *   https://developers.openai.com/ads/measurement-pixel
 *   https://developers.openai.com/ads/supported-events
 *
 *   oaiq("init",    { pixelId })
 *   oaiq("measure", eventName, eventData, options)
 *
 * `lead_created` lleva `type: "customer_action"` (su caso de uso documentado
 * es exactamente "a user submits a lead form or requests contact"). Los
 * campos `amount`/`currency` son opcionales y NO se envían: este sitio no
 * publica precios, así que no hay un valor honesto que declarar.
 *
 * Sobre el transporte: la doc dice que el pixel agrupa llamadas cercanas y
 * resuelve el envío con `fetch` o `sendBeacon` por su cuenta. No expone
 * `keepalive` ni ninguna opción de transporte, así que aquí no se inventa
 * ninguna. El riesgo de perder el evento es bajo porque los CTA abren
 * WhatsApp en una pestaña nueva (`target="_blank"`) y esta página nunca se
 * descarga.
 */

import { isStaticRender } from './staticMode'

/** Se inyecta en build. Sin ID, el módulo entero es un no-op. */
const PIXEL_ID = import.meta.env.VITE_OPENAI_PIXEL_ID as string | undefined

type EventData = { type: 'customer_action' } & Record<string, unknown>
type MeasureOptions = { event_id?: string; custom_event_name?: string; opt_out?: boolean }

declare global {
  interface Window {
    oaiq?: {
      (cmd: 'init', config: { pixelId: string }): void
      (cmd: 'measure', event: string, data: EventData, opts?: MeasureOptions): void
      q?: unknown[]
    }
  }
}

let booted = false

/** Respeta la señal del navegador de "no me rastrees". */
function optedOut(): boolean {
  const nav = navigator as Navigator & { doNotTrack?: string; globalPrivacyControl?: boolean }
  return nav.doNotTrack === '1' || nav.globalPrivacyControl === true
}

function enabled(): boolean {
  // Nunca durante el prerender: si corriera en el snapshot de Puppeteer, cada
  // build registraría conversiones falsas.
  return Boolean(PIXEL_ID) && typeof window !== 'undefined' && !isStaticRender() && !optedOut()
}

/**
 * Carga el SDK e inicializa el pixel una sola vez.
 *
 * El loader de la doc crea la cola `window.oaiq` de forma sincrónica, antes de
 * que llegue el script remoto, así que un `measure` disparado de inmediato se
 * encola en lugar de perderse.
 */
export function initOaiPixel() {
  if (booted || !enabled()) return
  booted = true

  // Loader oficial, transcrito de la doc.
  ;(function (w: Window, d: Document, s: string, u: string) {
    if (w.oaiq) return
    const q = function (...args: unknown[]) {
      ;(q as unknown as { q: unknown[] }).q.push(args)
    }
    ;(q as unknown as { q: unknown[] }).q = []
    w.oaiq = q as unknown as Window['oaiq']
    const js = d.createElement(s) as HTMLScriptElement
    js.async = true
    js.src = u
    const f = d.getElementsByTagName(s)[0]
    f.parentNode?.insertBefore(js, f)
  })(window, document, 'script', 'https://bzrcdn.openai.com/sdk/oaiq.min.js')

  window.oaiq?.('init', { pixelId: PIXEL_ID! })
}

/** `event_id` para deduplicar. `randomUUID` no existe en contextos no seguros. */
function uuid(): string {
  const c = globalThis.crypto as Crypto & { randomUUID?: () => string }
  if (c?.randomUUID) return c.randomUUID()
  return `lead-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

/**
 * LA conversión del sitio: alguien pidió contacto por WhatsApp.
 *
 * Devuelve el `event_id` usado, para poder correlacionarlo con otra analítica
 * si hiciera falta.
 */
export function trackLeadCreated(): string | undefined {
  if (!enabled()) return
  initOaiPixel() // Por si el clic ocurre antes del arranque diferido.
  const eventId = uuid()
  window.oaiq?.('measure', 'lead_created', { type: 'customer_action' }, { event_id: eventId })
  return eventId
}

/** Reconoce las tres formas en que un enlace puede abrir WhatsApp. */
export function isWhatsappHref(href: string): boolean {
  return /(?:^|\/\/)(?:api\.)?wa\.me\/|api\.whatsapp\.com|^whatsapp:\/\//.test(href)
}
