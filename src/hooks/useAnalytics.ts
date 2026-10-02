/**
 * Instrumentación de la página: qué clican y hasta dónde llegan.
 *
 * Un solo listener delegado en `document` en lugar de un onClick por botón.
 * Así ningún CTA nuevo nace sin medición: basta que lleve `data-cta-source`
 * (que `waLinkProps` ya pone en todos) para que se registre solo.
 *
 * Las secciones se miden con IntersectionObserver, no con un handler de
 * scroll: el scroll de este sitio está coreografiado y un listener por
 * frame competiría con la animación.
 */

import { useEffect } from 'react'
import { initAnalytics, track, trackCtaClick, trackPageView } from '../lib/analytics'
import { isStaticRender } from '../lib/staticMode'

/** Hitos de profundidad. Cada uno se emite una sola vez por visita. */
const DEPTHS = [25, 50, 75, 100] as const

export function useAnalytics(lang: string) {
  // Carga + vista inicial. Se vuelve a emitir al cambiar de idioma porque el
  // toggle no recarga la página y GA4 contaría una sola vista para dos idiomas.
  useEffect(() => {
    if (isStaticRender()) return
    initAnalytics()
    trackPageView(lang)
  }, [lang])

  // Clics: WhatsApp (la conversión), enlaces salientes y páginas de respuesta.
  useEffect(() => {
    if (isStaticRender()) return

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('a,[data-cta-source]')
      if (!el) return

      const source = el.dataset.ctaSource
      const href = el.getAttribute('href') || ''

      if (href.includes('wa.me')) {
        trackCtaClick(source || 'unknown')
        return
      }
      if (source) {
        track('cta_click', { cta_source: source })
        return
      }
      // Enlaces a las páginas citables: dice qué consulta interesa de verdad.
      if (href.startsWith('/') && href.length > 1) {
        track('internal_link', { link_path: href })
        return
      }
      if (/^https?:/.test(href) && !href.includes('michelangelodevs.com')) {
        track('outbound_link', { link_domain: new URL(href).hostname })
      }
    }

    document.addEventListener('click', onClick, { capture: true, passive: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  // Secciones vistas: dónde se queda la gente y dónde abandona.
  useEffect(() => {
    if (isStaticRender()) return

    const seen = new Set<string>()
    const sections = document.querySelectorAll<HTMLElement>('section[id], main[id]')
    if (!sections.length) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          // 50% visible evita contar una sección que solo pasó de largo.
          if (!entry.isIntersecting || entry.intersectionRatio < 0.5 || seen.has(id)) continue
          seen.add(id)
          track('section_view', { section_id: id })
        }
      },
      { threshold: [0.5] },
    )
    for (const s of sections) io.observe(s)
    return () => io.disconnect()
  }, [])

  // Profundidad de scroll, con rAF para no bloquear el hilo principal.
  useEffect(() => {
    if (isStaticRender()) return

    const hit = new Set<number>()
    let queued = false

    const measure = () => {
      queued = false
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const pct = ((window.scrollY / scrollable) * 100) | 0
      for (const d of DEPTHS) {
        if (pct >= d && !hit.has(d)) {
          hit.add(d)
          track('scroll_depth', { percent: d })
        }
      }
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(measure)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Tiempo hasta el abandono: separa "leyó" de "rebotó".
  useEffect(() => {
    if (isStaticRender()) return
    const start = Date.now()
    const onHide = () => {
      if (document.visibilityState !== 'hidden') return
      track('engagement_time', { seconds: Math.round((Date.now() - start) / 1000) })
    }
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [])
}
