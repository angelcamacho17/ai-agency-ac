/**
 * THE SINGLE SOURCE OF TRUTH for what Michelangelo Devs sells, in Spanish.
 *
 * Spanish is the primary language: it is what the prerender, the JSON-LD
 * graph and llms.txt carry. `offer.en.ts` mirrors this file shape-for-shape
 * for the in-page language toggle; keep both in step.
 *
 * Rules enforced by structure, not by discipline:
 *   - There is NO price field. Pricing is never published; scope and quote are
 *     agreed over WhatsApp. Nothing here can populate a priceSpecification.
 *   - Every `definition` must survive being quoted with zero surrounding
 *     context. That is the GEO contract.
 *   - Every literal stays plain data (no computed values) because
 *     scripts/seo-data.mjs evaluates these exports without a TS toolchain.
 */

/* ---------------------------------------------------------------- identity */

export const ORG = {
  name: 'Michelangelo Devs',
  url: 'https://michelangelodevs.com',
  /** The entity sentence. Must appear verbatim in the hero, JSON-LD and llms.txt. */
  definition:
    'Michelangelo Devs es una agencia de agentes de IA que construye agentes de ventas en producción para WhatsApp, Instagram y web, en vivo en unos cinco días.',
  /** The H1. Its first words are what verify-seo looks for. */
  tagline: 'Un agente de IA que responde, califica y cierra en WhatsApp, Instagram y tu web.',
  instagram: 'https://www.instagram.com/michelangelo.devs/',
  instagramHandle: '@michelangelo.devs',
  areaServed: ['Venezuela', 'Latinoamérica'],
  languages: ['es', 'en'],
} as const

/* ------------------------------------------------------------ capabilities */

export type Capability = { key: string; title: string; copy: string }

export const CAPABILITIES: readonly Capability[] = [
  { key: 'channels', title: 'Un cerebro, tres canales', copy: 'Instagram, WhatsApp y web comparten memoria.' },
  { key: 'knowledge', title: 'Responde con tu catálogo', copy: 'Precios y stock desde tus propias hojas.' },
  { key: 'booking', title: 'Agenda y reagenda', copy: 'Disponibilidad real, varias sedes.' },
  { key: 'payments', title: 'Cierra con link de pago', copy: 'Se paga dentro del chat.' },
  { key: 'crm', title: 'Mantiene tu CRM al día', copy: 'Cada lead cae en la etapa correcta.' },
  { key: 'handoff', title: 'Escala a un humano', copy: 'Con todo el contexto adjunto.' },
  { key: 'languages', title: 'Español, inglés, portugués', copy: 'Cambia cuando el cliente cambia.' },
  { key: 'voice', title: 'Responde con notas de voz', copy: 'Cuando el momento lo pide.' },
  { key: 'followup', title: 'Hace seguimiento dos veces', copy: 'Y nunca después de un no.' },
  { key: 'review', title: 'Revisa sus propias respuestas', copy: 'Un segundo modelo audita cada borrador.' },
] as const

/* ------------------------------------------------------------------ agents
   One agent, four jobs. Each entry is a job the SAME agent does; they are
   listed separately so each one is quotable on its own (OfferCatalog, llms). */

export type Agent = {
  slug: string
  name: string
  channel: string
  /** Self-contained, quotable, subject-in-sentence. The GEO payload. */
  definition: string
  /** The buyer-facing promise, one line. */
  outcome: string
}

export const AGENTS: readonly Agent[] = [
  {
    slug: 'ventas',
    name: 'Vende',
    channel: 'WhatsApp e Instagram',
    definition:
      'El agente de Michelangelo Devs responde mensajes de WhatsApp e Instagram en menos de un segundo, en español o inglés, y lleva la conversación hasta la venta.',
    outcome: 'Responde al instante, de día o de noche, con tu voz.',
  },
  {
    slug: 'califica',
    name: 'Califica',
    channel: 'Cualquier canal',
    definition:
      'El agente de Michelangelo Devs separa compradores de curiosos, puntúa la intención y deja cada lead en la etapa correcta del CRM.',
    outcome: 'Tu equipo solo habla con quien está listo para comprar.',
  },
  {
    slug: 'concierge',
    name: 'Atiende tu web',
    channel: 'Tu sitio web',
    definition:
      'El agente de Michelangelo Devs vive en tu sitio web, responde preguntas de producto y precio desde tu propia documentación, y captura al visitante antes de que se vaya.',
    outcome: 'Atrapa al visitante que se iba en silencio.',
  },
  {
    slug: 'agenda',
    name: 'Agenda',
    channel: 'Cualquier canal',
    definition:
      'El agente de Michelangelo Devs ofrece disponibilidad real, confirma la cita, envía el recordatorio y reagenda cuando el cliente lo pide.',
    outcome: 'Llena la agenda y reduce las inasistencias.',
  },
] as const

/* ----------------------------------------------------------------- process */

export type Phase = { key: string; label: string; duration: string; copy: string }

export const PHASES: readonly Phase[] = [
  { key: 'map', label: 'Mapear', duration: 'Día 1', copy: 'Trazamos cómo vende tu mejor vendedor.' },
  { key: 'build', label: 'Construir', duration: 'Día 2-3', copy: 'Tus datos, tu voz, tu CRM y tu agenda.' },
  { key: 'pressure-test', label: 'Probar', duration: 'Día 4', copy: 'Conversaciones reales, casos borde, reglas de escalado.' },
  { key: 'ship', label: 'Lanzar', duration: 'Día 5', copy: 'En vivo en tus canales. Iteramos cada semana.' },
] as const

/* ----------------------------------------------------------------- clients */

export type ClientLink = { channel: 'Website' | 'WhatsApp' | 'Instagram'; href: string }

export type Client = {
  key: string
  name: string
  sector: string
  /** Alpha-mask PNG in public/clients; painted in currentColor. Absent = wordmark. */
  logo?: string
  links: readonly ClientLink[]
  /** One line, featured tile only. */
  copy?: string
  featured?: boolean
}

export const CLIENTS: readonly Client[] = [
  {
    key: 'lidotel',
    name: 'Lidotel',
    sector: 'Cadena hotelera',
    logo: '/clients/lidotel.png',
    links: [{ channel: 'Website', href: 'https://lidotel.com/' }],
    copy: 'Cotiza habitaciones reales y cobra, en Instagram, WhatsApp y lidotel.com.',
    featured: true,
  },
  {
    key: 'terracota',
    name: 'Terracota',
    sector: 'Ropa, detal y mayor',
    logo: '/clients/terracota.png',
    links: [
      { channel: 'WhatsApp', href: 'https://wa.me/584226325858' },
      { channel: 'Instagram', href: 'https://www.instagram.com/terraccota.vip' },
    ],
  },
  {
    key: 'renaissence',
    name: 'Clínica Renaissence',
    sector: 'Clínica médica',
    logo: '/clients/renaissence.png',
    links: [{ channel: 'Instagram', href: 'https://www.instagram.com/dra.gabrielarodriguezplaza/' }],
  },
  {
    key: 'topone',
    name: 'TopOne',
    sector: 'Repuestos al mayor',
    logo: '/clients/topone.png',
    links: [{ channel: 'WhatsApp', href: 'https://wa.me/584220421739' }],
  },
  {
    key: 'coloreal',
    name: 'Coloreal y Sensacolor',
    sector: 'Fabricante de pinturas',
    logo: '/clients/coloreal.png',
    links: [{ channel: 'Instagram', href: 'https://www.instagram.com/pinturascolorealvzla/' }],
  },
  {
    key: 'mariu',
    name: 'Mariu Bustamante',
    sector: 'Diseño de interiores',
    logo: '/clients/mariu.png',
    links: [{ channel: 'Instagram', href: 'https://www.instagram.com/mariubustamante/' }],
  },
  {
    key: 'vic',
    name: 'Victoria Poggioli',
    sector: 'Educadora de redes',
    logo: '/clients/vic.png',
    links: [{ channel: 'Instagram', href: 'https://www.instagram.com/victoria.poggioli/' }],
  },
  {
    key: 'viajes-premiere',
    name: 'Viajes Premiere',
    sector: 'Agencia de viajes',
    links: [{ channel: 'Instagram', href: 'https://www.instagram.com/viajespremiereve/' }],
  },
] as const

/* ------------------------------------------------------------------- proof */

export type Proof = { value: string; label: string }

export const PROOF: readonly Proof[] = [
  { value: '504', label: 'conversaciones atendió nuestro propio agente en 30 días' },
  { value: '141', label: 'de ellas llegaron después de las 8 pm y se respondieron' },
  { value: '2.505', label: 'pruebas automáticas en producción' },
  { value: '13', label: 'agentes en vivo en hoteles, clínicas, retail e industria' },
] as const

export const DASHBOARD: readonly string[] = [
  'Una bandeja, primero los chats que necesitan un humano',
  'Toma cualquier conversación y devuélvela cuando quieras',
  'Pipeline, leads calientes y horas ahorradas, en tu teléfono',
] as const

/* --------------------------------------------------------------------- faq */

export type Faq = { q: string; a: string }

/**
 * Rendered ALWAYS OPEN, never inside <details>. The FAQPage JSON-LD must
 * match the visible text exactly, which is why both read from this array.
 */
export const FAQ: readonly Faq[] = [
  {
    q: '¿Cuánto tarda en estar en vivo un agente de ventas con IA?',
    a: 'Unos cinco días hábiles: uno para mapear cómo vendes, dos para construir, uno para probar y uno para lanzar.',
  },
  {
    q: '¿Cuánto cuesta un agente de ventas con IA?',
    a: 'Es una mensualidad. Antes de cotizar evaluamos tu empresa para entender si el agente va a facturarte más dinero y cubrirse solo. Si califica, tienes dos semanas de uso gratis; si no te gusta cómo trabaja, se desconecta sin ningún compromiso.',
  },
  {
    q: '¿En qué canales funciona el agente?',
    a: 'WhatsApp, mensajes directos de Instagram y tu propio sitio web. Un solo agente atiende todos los canales, así que el cliente que empieza en Instagram y sigue por WhatsApp no tiene que repetir nada.',
  },
  {
    q: '¿Va a sonar como un robot?',
    a: 'No. El agente se entrena con tus conversaciones reales y el lenguaje de tu mejor vendedor, así que responde con la voz de tu marca. Tú apruebas el tono antes de salir en vivo.',
  },
  {
    q: '¿Qué pasa cuando el agente no sabe la respuesta?',
    a: 'Escala a una persona con toda la conversación adjunta, en lugar de adivinar. Las reglas de escalado las definimos contigo el día cuatro, y el agente prefiere escalar antes que responder mal.',
  },
  {
    q: '¿Se conecta con mi CRM y mi agenda?',
    a: 'Sí. CRM y calendario se conectan el primer día de construcción, no se venden como un extra después.',
  },
  {
    q: '¿Funciona en español y en inglés?',
    a: 'Sí. El agente responde en el idioma en que escribe el cliente, y cambia a mitad de conversación si el cliente cambia.',
  },
  {
    q: '¿Cómo empiezo?',
    a: 'Escríbenos por WhatsApp al +58 412 567 1953. Cuéntanos qué vendes y por qué canal se te escapan ventas, y respondemos el mismo día.',
  },
] as const
