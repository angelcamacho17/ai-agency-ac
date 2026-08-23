import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as ES from '../content/offer'
import * as EN from '../content/offer.en'
import { isStaticRender } from './staticMode'

export type Lang = 'es' | 'en'

/** The content bundle every section reads. Spanish and English share one shape. */
export type Offer = {
  ORG: typeof ES.ORG | typeof EN.ORG
  CAPABILITIES: typeof ES.CAPABILITIES
  AGENTS: typeof ES.AGENTS
  PHASES: typeof ES.PHASES
  CLIENTS: typeof ES.CLIENTS
  FAQ: typeof ES.FAQ
}

/** Small interface strings that are not part of the offer itself. */
export const UI = {
  es: {
    skip: 'Saltar al contenido',
    nav: { agent: 'El agente', process: 'Proceso', clients: 'Clientes', questions: 'Preguntas' },
    whatsapp: 'WhatsApp',
    seeWork: 'Ver el trabajo',
    capabilitiesH: ['No es un chatbot.', 'Es un vendedor que ', 'nunca duerme.'],
    agentH: ['Un solo agente.', 'Cuatro trabajos.'],
    agentAsk: 'Pregunta por esto',
    processH: ['En vivo en ', 'cinco días.'],
    clientsH: ['Ya vende para ', 'estos equipos.'],
    faqH: ['Preguntas, ', 'respondidas sin rodeos.'],
    ctaH: 'Sigue el proceso en Instagram.',
    ctaP: 'Demos en vivo y cada cliente nuevo la semana que sale.',
    footer: 'Venezuela y Latinoamérica. WhatsApp',
    langLabel: 'Cambiar a English',
  },
  en: {
    skip: 'Skip to content',
    nav: { agent: 'The agent', process: 'Process', clients: 'Clients', questions: 'Questions' },
    whatsapp: 'WhatsApp',
    seeWork: 'See the work',
    capabilitiesH: ['Not a chatbot.', 'A salesperson that ', 'never sleeps.'],
    agentH: ['One agent.', 'Four jobs.'],
    agentAsk: 'Ask about this',
    processH: ['Live in ', 'five days.'],
    clientsH: ['Already selling for ', 'these teams.'],
    faqH: ['Questions, ', 'answered straight.'],
    ctaH: 'Follow the build on Instagram.',
    ctaP: 'Live demos and every new client the week it goes live.',
    footer: 'Venezuela and Latin America. WhatsApp',
    langLabel: 'Cambiar a español',
  },
} as const

type Ctx = { lang: Lang; t: Offer; ui: (typeof UI)[Lang]; setLang: (l: Lang) => void }

const LangContext = createContext<Ctx | null>(null)
const KEY = 'mich.lang'

function initial(): Lang {
  if (typeof window === 'undefined' || isStaticRender()) return 'es'
  const q = new URLSearchParams(window.location.search).get('lang')
  if (q === 'en' || q === 'es') return q
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'en' || saved === 'es') return saved
  } catch {
    /* storage blocked: fall through */
  }
  return 'es'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<Ctx>(() => {
    const t: Offer = lang === 'en' ? EN : ES
    return {
      lang,
      t,
      ui: UI[lang],
      setLang: (l) => {
        setLangState(l)
        try {
          localStorage.setItem(KEY, l)
        } catch {
          /* ignore */
        }
      },
    }
  }, [lang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang outside LangProvider')
  return ctx
}
