/**
 * Citable answer pages — the GEO surface beyond the single landing page.
 *
 * One page can only be "the answer" to one or two queries, and generative
 * engines favor pages whose first paragraph answers the target question
 * directly in 40-60 words before expanding. Each entry here is one target
 * query, rendered at build time as a static, self-contained HTML page at
 * /<slug>/ with stacked JSON-LD (Organization + Article + FAQPage +
 * BreadcrumbList). Copy reuses the canonical sentences from offer.ts wherever
 * one exists, so the entity says the same thing on every surface.
 *
 * Rules that also bind these pages:
 *   - No prices, ever. verify-seo scans every built HTML file.
 *   - WhatsApp is the only conversion action.
 *   - Spanish only: these target Spanish queries; the SPA carries the toggle.
 */

import { SITE, WA_NUMBER, WA_E164 } from './seo-data.mjs'

const WA_TEXT = encodeURIComponent('Hola, vengo de michelangelodevs.com y quiero un agente de IA para mi negocio.')
export const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`

import { MORE_ANSWERS } from './answers-more.mjs'

const BASE_ANSWERS = [
  {
    // La consulta con más demanda del sitio: Search Console (oct 2026) suma
    // ~170 impresiones entre "agentes ia whatsapp", "agente ia whatsapp",
    // "agentes de ia para whatsapp" y variantes, con 0 clics. La página corta
    // no competía con guías completas; esta es la guía completa. El plural va
    // en el title porque es la variante más buscada.
    slug: 'agente-de-ia-para-whatsapp',
    updated: '2026-10-20',
    title: 'Agentes de IA para WhatsApp: qué son y cómo funcionan (2026) | Michelangelo Devs',
    h1: 'Agentes de IA para WhatsApp: qué son y cómo funcionan',
    description:
      'Guía completa de los agentes de IA para WhatsApp: qué hacen, cómo se conectan a la API oficial, qué permite Meta, cuánto cuestan y cuánto tardan en estar en vivo.',
    direct:
      'Un agente de IA para WhatsApp es un vendedor automático que responde cada mensaje en menos de un segundo, califica al comprador, agenda citas y cierra la venta con un link de pago dentro del chat. Michelangelo Devs construye estos agentes en producción y los pone en vivo en menos de dos semanas.',
    sections: [
      {
        h2: '¿Qué hace un agente de IA en WhatsApp?',
        lead:
          'Vende: responde al instante, de día o de noche, con la voz de tu marca, y lleva la conversación hasta el cierre.',
        bullets: [
          'Responde con tu catálogo: precios y stock desde tus propias hojas.',
          'Califica: separa compradores de curiosos y deja cada lead en la etapa correcta del CRM.',
          'Agenda y reagenda con disponibilidad real, incluso en varias sedes.',
          'Cierra con link de pago dentro del chat.',
          'Escala a un humano cuando no sabe la respuesta, con todo el contexto adjunto.',
          'Habla español, inglés y portugués, y cambia cuando el cliente cambia.',
        ],
      },
      {
        h2: 'Así se ve una conversación',
        lead: 'Un ejemplo ilustrativo de una tienda de ropa, a las once de la noche, sin nadie del equipo conectado:',
        chat: [
          { from: 'cliente', text: 'Hola, ¿tienen la chaqueta de jean negra en talla M?' },
          { from: 'agente', text: '¡Hola! Sí, nos quedan dos en talla M en negro. ¿La quieres para retirar en tienda o con envío?' },
          { from: 'cliente', text: 'Con envío a Valencia. ¿Cuánto tarda?' },
          { from: 'agente', text: 'A Valencia llega en dos o tres días hábiles. Te dejo el link de pago con el envío incluido; apenas se confirme, te escribo con el número de guía.' },
          { from: 'cliente', text: 'Listo, ya pagué.' },
          { from: 'agente', text: 'Recibido, gracias. Tu pedido ya está en preparación y te aviso por aquí cuando salga.' },
        ],
        after:
          'El agente consultó el stock real, respondió con la política de envíos de la tienda, cobró y dejó el pedido registrado en el CRM. Si el cliente hubiera pedido algo fuera de sus reglas, como un descuento especial, habría escalado a una persona con la conversación completa.',
      },
      {
        h2: 'Agente de IA vs chatbot vs responder a mano',
        table: {
          head: ['', 'Agente de IA', 'Chatbot de botones', 'Responder a mano'],
          rows: [
            ['Tiempo de respuesta', 'Menos de un segundo', 'Inmediato, pero solo dentro del guion', 'Minutos u horas, según el equipo'],
            ['Horario', 'Las 24 horas, todos los días', 'Las 24 horas', 'Horario laboral'],
            ['Entiende texto libre y notas de voz', 'Sí', 'No: obliga a elegir opciones', 'Sí'],
            ['Conoce precios y stock reales', 'Sí, desde tus hojas o tu sistema', 'Solo si se programan a mano', 'Sí, si la persona los tiene a mano'],
            ['Agenda y cobra en el chat', 'Sí', 'Rara vez', 'Sí, con tiempo'],
            ['Conversaciones a la vez', 'Sin límite práctico', 'Sin límite práctico', 'Una o pocas por persona'],
            ['Cuándo escala a una persona', 'Cuando no sabe o el caso lo pide', 'Cuando el cliente se sale del menú', 'No aplica'],
          ],
        },
        see: ['chatbot-vs-agente-de-ia'],
      },
      {
        h2: '¿Cómo se conecta un agente de IA a WhatsApp?',
        lead:
          'A través de la WhatsApp Business Platform, la API oficial de Meta para empresas. La app de WhatsApp Business del teléfono no permite que un sistema responda por ti; la API sí, y es la vía que Meta aprueba. Hace falta una cuenta de Meta Business verificada y un número de teléfono para el negocio. Ese trámite lo hacemos contigo durante la construcción.',
      },
      {
        h2: '¿Meta permite usar IA en WhatsApp?',
        lead:
          'Sí, cuando es el agente de tu empresa. Desde enero de 2026, los términos de WhatsApp Business no permiten asistentes de IA de propósito general, del tipo chat abierto para hablar de cualquier tema, en la API. Sí permiten agentes que atienden a los clientes de una empresa: ventas, soporte, citas y pedidos. Un agente de ventas es exactamente ese caso.',
      },
      {
        h2: '¿Para qué tipo de negocio sirve?',
        bullets: [
          'Hoteles: cotizar habitaciones con disponibilidad real y cobrar la reserva, como en Lidotel.',
          'Clínicas y consultorios: filtrar consultas y agendar con la disponibilidad del médico.',
          'Tiendas y ecommerce: responder precio, tallas y stock, al detal y al mayor.',
          'Cualquier negocio que venda por chat y pierda clientes por responder tarde.',
        ],
        see: ['agente-de-ia-para-hoteles', 'agente-de-ia-para-clinicas', 'agente-de-ia-para-tiendas-y-ecommerce', 'agente-de-ia-para-instagram'],
      },
      {
        h2: '¿Cuánto cuesta un agente de IA para WhatsApp?',
        lead:
          'Hay dos costos. El primero es la mensualidad del agente, que se cotiza después de evaluar tu negocio: el agente tiene que facturarte más de lo que cuesta. El segundo es lo que cobra Meta por mensajes. Meta no cobra las respuestas dentro de la ventana de 24 horas que se abre cuando el cliente te escribe; sí cobra las plantillas que la empresa envía por iniciativa propia, como promociones. Para un agente que sobre todo responde, ese segundo costo suele ser bajo.',
        see: ['cuanto-cuesta-un-agente-de-ventas-con-ia'],
      },
      {
        h2: '¿Cuánto tarda en estar en vivo?',
        lead: 'Menos de dos semanas, en cuatro pasos:',
        steps: [
          { label: 'Días 1-2, mapear', copy: 'Trazamos cómo vende tu mejor vendedor.' },
          { label: 'Días 3-8, construir', copy: 'Tus datos, tu voz, tu CRM y tu agenda.' },
          { label: 'Días 9-12, probar', copy: 'Conversaciones reales, casos borde, reglas de escalado.' },
          { label: 'Día 13, lanzar', copy: 'En vivo en tus canales. Iteramos cada semana.' },
        ],
      },
    ],
    faqs: [
      {
        q: '¿Qué son los agentes de IA para WhatsApp?',
        a: 'Son vendedores automáticos que atienden el WhatsApp de una empresa: entienden lo que escribe el cliente, responden con el catálogo real, agendan, cobran y actualizan el CRM. A diferencia de un chatbot de botones, deciden el siguiente paso y ejecutan acciones.',
      },
      {
        q: '¿Puedo usar mi número de WhatsApp actual?',
        a: 'En la mayoría de los casos sí. Meta permite registrar en la API un número que el negocio ya usa. Cómo se hace depende de tu caso, y lo revisamos contigo antes de construir para que no pierdas tus conversaciones ni tus contactos.',
      },
      {
        q: '¿Necesito la API de WhatsApp Business?',
        a: 'Sí. La API oficial de Meta es la única vía permitida para que un agente responda por tu empresa. La app de WhatsApp Business del teléfono no sirve para esto. El alta en la API la hacemos contigo durante la construcción.',
      },
      {
        q: '¿Es legal usar un agente de IA en WhatsApp?',
        a: 'Sí, cuando el agente atiende a los clientes de tu empresa. Meta no permite en la API asistentes de IA de propósito general, pero sí agentes de ventas, soporte y citas como los que construimos.',
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
        q: '¿Se conecta con mi CRM y mi agenda?',
        a: 'Sí. CRM y calendario se conectan el primer día de construcción, no se venden como un extra después.',
      },
      {
        q: '¿Qué pasa cuando el agente no sabe la respuesta?',
        a: 'Escala a una persona con toda la conversación adjunta, en lugar de adivinar. Las reglas de escalado las definimos contigo el día cuatro, y el agente prefiere escalar antes que responder mal.',
      },
    ],
  },
  {
    slug: 'cuanto-cuesta-un-agente-de-ventas-con-ia',
    title: '¿Cuánto cuesta un agente de ventas con IA? | Michelangelo Devs',
    h1: '¿Cuánto cuesta un agente de ventas con IA?',
    description:
      'Cómo se cotiza un agente de ventas con IA: evaluación primero, mensualidad después y dos semanas de prueba gratis si tu empresa califica.',
    direct:
      'Es una mensualidad. Antes de cotizar evaluamos tu empresa para entender si el agente va a facturarte más dinero y cubrirse solo. Si califica, tienes dos semanas de uso gratis; si no te gusta cómo trabaja, se desconecta sin ningún compromiso.',
    sections: [
      {
        h2: '¿Por qué no publicamos una tarifa?',
        lead:
          'Porque el número correcto depende de tu volumen de conversaciones, tus canales y lo que vale cada venta tuya. Publicar una tarifa única obligaría a cobrarle lo mismo a una tienda con veinte chats al día que a una cadena hotelera. La evaluación viene primero; la cotización se acuerda por WhatsApp.',
      },
      {
        h2: '¿Cómo sé si me conviene?',
        lead:
          'La regla es simple: el agente tiene que facturarte más de lo que cuesta. Eso se estima antes de cobrar, con tus números reales de conversaciones y cierre. Si la cuenta no da, te lo decimos y no hay cotización.',
      },
      {
        h2: '¿Qué incluye la mensualidad?',
        bullets: [
          'El agente en vivo en WhatsApp, Instagram y tu web.',
          'Conexión con tu catálogo, tu CRM y tu calendario.',
          'Iteración semanal sobre conversaciones reales.',
          'Escalado a humanos con contexto completo.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta un agente de ventas con IA?',
        a: 'Es una mensualidad. Antes de cotizar evaluamos tu empresa para entender si el agente va a facturarte más dinero y cubrirse solo. Si califica, tienes dos semanas de uso gratis; si no te gusta cómo trabaja, se desconecta sin ningún compromiso.',
      },
      {
        q: '¿Cuánto tarda en estar en vivo un agente de ventas con IA?',
        a: 'Menos de dos semanas: un par de días para mapear cómo vendes, una semana para construir, unos días para probar y el lanzamiento.',
      },
      {
        q: '¿Cómo empiezo?',
        a: `Escríbenos por WhatsApp al ${WA_E164.replace('+58', '+58 ').replace('4227197216', '422 719 7216')}. Cuéntanos qué vendes y por qué canal se te escapan ventas, y respondemos el mismo día.`,
      },
    ],
  },
  {
    // Cubre la familia de términos que la gente escribe cuando busca esto sin
    // saber que se llama "agente": asesor virtual, asistente virtual, chatbot.
    // El vocabulario del cliente, no el nuestro.
    slug: 'asesor-virtual-con-ia',
    title: 'Asesor virtual con IA: qué es y cómo contratarlo | Michelangelo Devs',
    h1: 'Asesor virtual con IA',
    description:
      'Qué es un asesor virtual con IA, en qué se diferencia de un chatbot y cómo se contrata uno. Por Michelangelo Devs, OpenAI Select Partner.',
    direct:
      'Un asesor virtual con IA es un vendedor automático que atiende a tus clientes en WhatsApp, Instagram y tu web: responde al instante, cotiza, agenda citas y cobra dentro del chat. Michelangelo Devs construye estos asesores en producción, con tu voz y tu catálogo, y los pone en vivo en menos de dos semanas.',
    sections: [
      {
        h2: '¿Asesor virtual, asistente virtual o agente de IA?',
        lead:
          'Son el mismo producto con tres nombres. Nosotros lo llamamos agente porque no se queda en conversar: cotiza con tu catálogo real, agenda con disponibilidad real, cobra y deja el lead en la etapa correcta de tu CRM. Si solo respondiera preguntas, sería un chatbot.',
        see: ['asistente-virtual-para-empresas'],
      },
      {
        h2: '¿En qué se diferencia de un chatbot?',
        lead:
          'Un chatbot sigue un guion de botones y se rompe cuando el cliente escribe algo que no estaba previsto. Un asesor virtual con IA entiende el mensaje, decide el siguiente paso y ejecuta acciones reales. Un segundo modelo audita cada borrador antes de enviarlo.',
      },
      {
        h2: '¿Qué hace un asesor virtual con IA?',
        bullets: [
          'Atiende en WhatsApp, Instagram y tu sitio web, con un solo cerebro.',
          'Responde con tu catálogo: precios y stock desde tus propias hojas.',
          'Califica: separa compradores de curiosos y puntúa la intención.',
          'Agenda, confirma y reagenda con disponibilidad real.',
          'Cierra con link de pago dentro del chat.',
          'Escala a una persona cuando no sabe, con la conversación completa.',
        ],
      },
      {
        h2: '¿Cómo se contrata?',
        lead:
          'Por WhatsApp. Primero evaluamos tu negocio para confirmar que el asesor te va a facturar más de lo que cuesta; si tu empresa califica, tienes dos semanas de uso gratis y puedes desconectarlo sin compromiso.',
      },
    ],
    faqs: [
      {
        q: '¿Es lo mismo un asesor virtual, un asistente virtual y un agente de IA?',
        a: 'En la práctica la gente usa los tres nombres para lo mismo: un asesor virtual con IA que atiende a tus clientes solo. Nosotros lo llamamos agente porque no solo conversa: cotiza, agenda, cobra y actualiza tu CRM. Un chatbot sigue un guion de botones; un agente entiende, decide y ejecuta.',
      },
      {
        q: '¿En qué canales funciona el asesor virtual?',
        a: 'WhatsApp, mensajes directos de Instagram y tu propio sitio web. Un solo agente atiende todos los canales, así que el cliente que empieza en Instagram y sigue por WhatsApp no tiene que repetir nada.',
      },
      {
        q: '¿Cuánto tarda en estar en vivo?',
        a: 'Menos de dos semanas: un par de días para mapear cómo vendes, una semana para construir, unos días para probar y el lanzamiento.',
      },
    ],
  },
  {
    slug: 'agente-de-ia-para-hoteles',
    title: 'Agente de IA para hoteles: el caso Lidotel | Michelangelo Devs',
    h1: 'Agente de IA para hoteles',
    description:
      'Cómo un agente de IA atiende a los huéspedes de un hotel en WhatsApp, Instagram y la web: el caso de la cadena Lidotel, por Michelangelo Devs.',
    direct:
      'Un agente de IA para hoteles responde a cada huésped en WhatsApp, Instagram y la web del hotel, cotiza habitaciones reales según disponibilidad y cobra la reserva dentro del chat. Michelangelo Devs construyó el agente de Lidotel, una cadena hotelera venezolana, y lo puso en vivo en menos de dos semanas.',
    sections: [
      {
        h2: 'El caso Lidotel',
        lead:
          'El agente de Lidotel cotiza habitaciones reales y cobra, en Instagram, WhatsApp y lidotel.com. Un huésped que pregunta a medianoche por una habitación recibe disponibilidad y tarifa de la cadena al instante, y puede dejar la reserva pagada sin hablar con recepción.',
      },
      {
        h2: '¿Qué hace un agente de IA en un hotel?',
        bullets: [
          'Cotiza habitaciones con disponibilidad real, en varias sedes.',
          'Cobra la reserva con un link de pago dentro del chat.',
          'Responde preguntas de servicios, horarios y políticas desde la documentación del hotel.',
          'Atiende en español, inglés y portugués, y cambia de idioma cuando el huésped cambia.',
          'Escala a recepción con toda la conversación adjunta cuando hace falta un humano.',
        ],
      },
      {
        h2: '¿Cuánto tarda en estar en vivo?',
        lead:
          'Menos de dos semanas: un par de días para mapear cómo vende el hotel, una semana para construir con sus datos reales, unos días de prueba y el lanzamiento.',
      },
    ],
    faqs: [
      {
        q: '¿El agente conoce la disponibilidad real del hotel?',
        a: 'Sí. Se conecta a la disponibilidad y las tarifas reales del hotel, así que cotiza lo que de verdad se puede reservar, no una respuesta genérica.',
      },
      {
        q: '¿Qué pasa cuando el agente no sabe la respuesta?',
        a: 'Escala a una persona con toda la conversación adjunta, en lugar de adivinar. Las reglas de escalado las definimos contigo el día cuatro, y el agente prefiere escalar antes que responder mal.',
      },
    ],
  },
]

/** Todas las páginas citables. Un slug duplicado haría que dos páginas
    compitieran por la misma consulta, así que se verifica al cargar. */
export const ANSWERS = [...BASE_ANSWERS, ...MORE_ANSWERS]

const seen = new Set()
for (const a of ANSWERS) {
  if (seen.has(a.slug)) throw new Error(`answers: slug duplicado "${a.slug}"`)
  seen.add(a.slug)
}

/* ------------------------------------------------------------ rendering */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Tabla comparativa: los motores generativos citan tablas casi literal, así
    que la primera columna va como <th scope="row"> para que cada fila se lea
    sola. */
function renderTable({ head, rows }) {
  return `<div class="tbl"><table>
          <thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
          <tbody>${rows
            .map(([first, ...rest]) => `<tr><th scope="row">${esc(first)}</th>${rest.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
            .join('')}</tbody>
        </table></div>`
}

function renderChat(msgs) {
  return `<div class="chat">${msgs
    .map((m) => `<p class="msg ${m.from}"><b>${m.from === 'agente' ? 'Agente' : 'Cliente'}</b>${esc(m.text)}</p>`)
    .join('')}</div>`
}

/** Enlaces internos en contexto. Un slug inexistente rompe el build en vez
    de publicar un 404. */
function renderSee(slugs) {
  const links = slugs.map((slug) => {
    const target = ANSWERS.find((o) => o.slug === slug)
    if (!target) throw new Error(`answers: "see" apunta a un slug inexistente "${slug}"`)
    return `<a href="/${slug}/">${esc(target.h1)}</a>`
  })
  return `<p class="see">Ver también: ${links.join(' · ')}</p>`
}

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const humanDate = (iso) => {
  const [y, m] = iso.split('-')
  return `${MONTHS[Number(m) - 1]} de ${y}`
}

function jsonLd(a, ORG) {
  const url = `${SITE}/${a.slug}/`
  const orgId = `${SITE}/#org`
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: ORG.name,
        url: SITE,
        description: ORG.definition,
        sameAs: [ORG.instagram, ORG.linkedin],
        award: ORG.openAiPartner,
        memberOf: { '@type': 'Organization', name: ORG.openAiPartnerNetwork, url: ORG.openAiPartnerUrl },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: WA_E164,
          url: `https://wa.me/${WA_NUMBER}`,
          availableLanguage: ['es', 'en'],
        },
      },
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: a.h1,
        description: a.direct,
        inLanguage: 'es',
        ...(a.updated ? { dateModified: a.updated } : {}),
        author: { '@id': orgId },
        publisher: { '@id': orgId },
        mainEntityOfPage: url,
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: a.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Michelangelo Devs', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: a.h1, item: url },
        ],
      },
    ],
  })
}

/**
 * OpenAI Ads Measurement Pixel para las páginas citables.
 *
 * Estas páginas son HTML estático (no React), así que no pueden reutilizar
 * src/lib/oaiPixel.ts. El snippet es el oficial de la doc, y el listener de
 * conversión es el mismo enfoque que en la SPA: delegado en `document`, en
 * fase de captura, para que corra antes de que el enlace abra WhatsApp.
 *
 * Sin VITE_OPENAI_PIXEL_ID en el entorno de build no se emite nada, igual que
 * en la SPA: el pixel es opt-in por configuración, nunca hardcodeado.
 */
function pixelTag() {
  const id = process.env.VITE_OPENAI_PIXEL_ID
  if (!id) return ''
  return `
  <script>
    (function (w, d, s, u) {
      if (w.oaiq) return;
      var q = function () { q.q.push(arguments); };
      q.q = [];
      w.oaiq = q;
      var js = d.createElement(s);
      js.async = true;
      js.src = u;
      var f = d.getElementsByTagName(s)[0];
      f.parentNode.insertBefore(js, f);
    })(window, document, "script", "https://bzrcdn.openai.com/sdk/oaiq.min.js");
    oaiq("init", { pixelId: ${JSON.stringify(id)} });

    document.addEventListener("click", function (e) {
      var a = e.target && e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      var h = a.getAttribute("href") || "";
      if (!/(?:^|\\/\\/)(?:api\\.)?wa\\.me\\/|api\\.whatsapp\\.com|^whatsapp:\\/\\//.test(h)) return;
      var id = (crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : "lead-" + Date.now() + "-" + Math.random().toString(16).slice(2, 10);
      oaiq("measure", "lead_created", { type: "customer_action" }, { event_id: id });
    }, true);
  </script>`
}

export function renderAnswerPage(a, { ORG }) {
  const url = `${SITE}/${a.slug}/`
  const others = ANSWERS.filter((o) => o.slug !== a.slug)

  const sections = a.sections
    .map(
      (s) => `
      <section>
        <h2>${esc(s.h2)}</h2>
        ${s.lead ? `<p>${esc(s.lead)}</p>` : ''}
        ${s.bullets ? `<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
        ${s.steps ? `<ol>${s.steps.map((st) => `<li><strong>${esc(st.label)}.</strong> ${esc(st.copy)}</li>`).join('')}</ol>` : ''}
        ${s.chat ? renderChat(s.chat) : ''}
        ${s.table ? renderTable(s.table) : ''}
        ${s.after ? `<p>${esc(s.after)}</p>` : ''}
        ${s.see ? renderSee(s.see) : ''}
      </section>`,
    )
    .join('')

  const faqs = a.faqs
    .map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`)
    .join('')

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(a.title)}</title>
  <meta name="description" content="${esc(a.description)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="${esc(ORG.name)}" />
  <meta property="og:locale" content="es_VE" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${esc(a.h1)}" />
  <meta property="og:description" content="${esc(a.description)}" />
  <meta property="og:image" content="${SITE}/og.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <meta name="theme-color" content="#0a0a0a" />${pixelTag()}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600&family=Space+Grotesk:wght@400;500;600&display=swap" />
  <script type="application/ld+json">${jsonLd(a, ORG)}</script>
  <style>
    :root { --ink:#0a0a0a; --ink2:#141414; --paper:#f3f3ee; --mist:#b9b9b2; --faint:#8c8c86; --neo:#d4e04a; }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:var(--ink); color:var(--paper); font:16px/1.65 'Space Grotesk',system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
    .wrap { max-width:720px; margin:0 auto; padding:0 20px; }
    header { padding:22px 0; }
    header .wrap, .brand { display:flex; align-items:center; gap:10px; }
    header .wrap { justify-content:space-between; }
    .brand { color:var(--paper); text-decoration:none; font-family:'Unbounded',sans-serif; font-size:14px; font-weight:500; }
    .brand img { height:16px; width:auto; }
    h1,h2 { font-family:'Unbounded','Space Grotesk',sans-serif; font-weight:500; letter-spacing:-0.02em; line-height:1.15; }
    h1 { font-size:clamp(1.7rem,5vw,2.6rem); margin:36px 0 20px; }
    h2 { font-size:1.25rem; margin:40px 0 12px; }
    h3 { font-family:'Space Grotesk',sans-serif; font-size:1.02rem; margin:22px 0 6px; }
    .lead { font-size:1.13rem; line-height:1.6; color:var(--paper); border-left:3px solid var(--neo); padding-left:16px; }
    p,li { color:var(--mist); }
    .lead { color:var(--paper); }
    ul,ol { padding-left:20px; margin:10px 0; }
    li strong { color:var(--paper); font-weight:600; }
    .updated { font-size:13px; color:var(--faint); margin:-8px 0 18px; }
    .see { font-size:14px; margin-top:12px; }
    .tbl { overflow-x:auto; margin:16px 0; border:1px solid #262626; border-radius:14px; }
    table { width:100%; border-collapse:collapse; font-size:14px; line-height:1.45; }
    th,td { text-align:left; vertical-align:top; padding:11px 13px; border-bottom:1px solid #262626; }
    tbody tr:last-child th, tbody tr:last-child td { border-bottom:0; }
    thead th { color:var(--paper); font-weight:600; background:var(--ink2); }
    tbody th { color:var(--paper); font-weight:500; }
    td { color:var(--mist); }
    .chat { display:flex; flex-direction:column; gap:8px; margin:16px 0; }
    .msg { max-width:85%; padding:10px 14px; border-radius:16px; font-size:15px; }
    .msg b { display:block; font-size:11px; letter-spacing:0.04em; text-transform:uppercase; color:var(--faint); margin-bottom:2px; }
    .msg.cliente { align-self:flex-start; background:var(--ink2); color:var(--paper); }
    .msg.agente { align-self:flex-end; background:#1d2108; color:var(--paper); border:1px solid #3a4110; }
    li { margin:6px 0; }
    a { color:var(--paper); }
    a:hover { color:var(--neo); }
    .pill { display:inline-flex; align-items:center; gap:8px; background:var(--neo); color:var(--ink); font-weight:600; text-decoration:none; border-radius:999px; padding:13px 24px; margin-top:14px; }
    .pill:hover { color:var(--ink); }
    .cta { margin:44px 0; padding:26px; background:var(--ink2); border-radius:20px; }
    .cta p { color:var(--paper); font-weight:500; }
    .more { margin:36px 0; }
    .more a { display:block; margin:6px 0; }
    .partner { display:flex; align-items:center; gap:12px; margin:26px 0 0; }
    .partner img { height:40px; width:auto; }
    .partner span { font-size:13px; color:var(--faint); }
    footer { border-top:1px solid #222; margin-top:48px; padding:22px 0 40px; font-size:13px; color:var(--faint); }
  </style>
</head>
<body>
  <header><div class="wrap">
    <a class="brand" href="/"><img src="/m-mark.png" alt="" width="36" height="18" />michelangelo.</a>
    <a class="pill" style="margin:0;padding:9px 18px;font-size:14px" href="${WA_URL}">WhatsApp</a>
  </div></header>
  <main class="wrap">
    <article>
      <h1>${esc(a.h1)}</h1>
      ${a.updated ? `<p class="updated">Actualizado: <time datetime="${a.updated}">${humanDate(a.updated)}</time></p>` : ''}
      <p class="lead">${esc(a.direct)}</p>
      ${sections}
      <section>
        <h2>Preguntas relacionadas</h2>
        ${faqs}
      </section>
      <div class="cta">
        <p>¿Quieres esto para tu negocio? Cuéntanos qué vendes y por qué canal se te escapan ventas. Respondemos el mismo día.</p>
        <a class="pill" href="${WA_URL}">Escríbenos por WhatsApp</a>
      </div>
      <nav class="more" aria-label="Más respuestas">
        <h2>Más respuestas</h2>
        ${others.map((o) => `<a href="/${o.slug}/">${esc(o.h1)}</a>`).join('')}
        <a href="/">Michelangelo Devs — la agencia</a>
      </nav>
      <div class="partner">
        <a href="${ORG.openAiPartnerUrl}" target="_blank" rel="noopener noreferrer"><img src="/partners/openai-select-partner.svg" alt="${esc(ORG.openAiPartner)}" /></a>
        <span>${esc(ORG.name)} es ${esc(ORG.openAiPartner)} en la ${esc(ORG.openAiPartnerNetwork)}.</span>
      </div>
    </article>
  </main>
  <footer><div class="wrap">${esc(ORG.name)}. Venezuela y Latinoamérica. WhatsApp <a href="${WA_URL}">${WA_E164}</a></div></footer>
</body>
</html>
`
}
