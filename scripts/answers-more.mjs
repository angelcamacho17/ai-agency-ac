/**
 * Segunda tanda de páginas citables — las consultas que el sitio no cubría.
 *
 * Auditamos el HTML construido contra las búsquedas que de verdad hace un
 * comprador y encontramos cuatro huecos: "agencia de IA", "empresas de IA",
 * "agente de Instagram" y la comparación contra "chatbot". Cada entrada aquí
 * es UNA consulta objetivo; dos páginas nunca persiguen la misma, porque
 * competirían entre sí y ninguna ganaría.
 *
 * Mismo contrato que scripts/answers.mjs (verify-seo lo exige en ambas):
 *   - `direct` responde la pregunta en 40-60 palabras, sin rodeos.
 *   - Sin precios, nunca.
 *   - WhatsApp es la única acción de conversión.
 *   - Solo hechos verificables: los clientes citados son clientes reales.
 */

export const MORE_ANSWERS = [
  {
    // La consulta de mayor intención de compra del conjunto: quien busca
    // "agencia de IA en Venezuela" está buscando a quién contratar.
    slug: 'agencia-de-agentes-de-ia-venezuela',
    title: 'Agencia de agentes de IA en Venezuela | Michelangelo Devs',
    h1: 'Agencia de agentes de IA en Venezuela',
    description:
      'Qué hace una agencia de agentes de IA en Venezuela, cómo elegir una y con qué empresas venezolanas ya trabajamos. Michelangelo Devs, OpenAI Select Partner.',
    direct:
      'Michelangelo Devs es una agencia de agentes de IA en Venezuela que construye agentes de ventas en producción para WhatsApp, Instagram y web. Trabajamos con empresas venezolanas como Lidotel, Coloreal y Clínica Renaissence, somos OpenAI Select Partner y ponemos el agente en vivo en menos de dos semanas.',
    sections: [
      {
        h2: '¿Qué hace exactamente una agencia de agentes de IA?',
        lead:
          'Construye el vendedor automático que atiende tus canales. No es consultoría ni un informe: es software en producción, conectado a tu catálogo, tu CRM y tu calendario, respondiendo a clientes reales desde el primer día en vivo.',
      },
      {
        h2: 'Cómo elegir una agencia de IA',
        bullets: [
          'Pide ver agentes en vivo, no demos grabadas: escríbele tú mismo al WhatsApp de un cliente suyo.',
          'Pregunta qué pasa cuando el agente no sabe la respuesta. Si no hay regla de escalado, va a inventar.',
          'Confirma que el agente se conecta a tu catálogo y tu CRM, no que solo conversa.',
          'Pregunta cuánto tarda en estar en vivo. Un proyecto de meses suele ser consultoría disfrazada.',
          'Verifica credenciales comprobables, como pertenecer a la OpenAI Partner Network.',
        ],
      },
      {
        h2: '¿Trabajan solo en Venezuela?',
        lead:
          'Estamos en Venezuela y atendemos toda Latinoamérica. El agente funciona igual en cualquier país: vive en WhatsApp, Instagram y tu web, y habla español, inglés y portugués según escriba el cliente.',
      },
    ],
    faqs: [
      {
        // Recoge la frase exacta "agencia de IA en Venezuela", que la gente
        // escribe sin la palabra "agentes" en medio.
        q: '¿Son una agencia de IA en Venezuela o trabajan desde afuera?',
        a: 'Somos una agencia de IA en Venezuela, con equipo aquí, y atendemos toda Latinoamérica. El agente se construye y se opera igual sin importar dónde esté tu empresa.',
      },
      {
        q: '¿Con qué empresas venezolanas han trabajado?',
        a: 'Entre otras: Lidotel (cadena hotelera), Coloreal y Sensacolor (fabricante de pinturas), Clínica Renaissence, Terracota (ropa al detal y mayor) y TopOne (repuestos al mayor).',
      },
      {
        q: '¿Qué es un OpenAI Select Partner?',
        a: 'Es el estatus oficial de Michelangelo Devs dentro de la OpenAI Partner Network, el programa de OpenAI para organizaciones que construyen, despliegan y escalan soluciones de IA.',
      },
      {
        q: '¿Cómo empiezo?',
        a: 'Escríbenos por WhatsApp al +58 422 719 7216. Cuéntanos qué vendes y por qué canal se te escapan ventas, y respondemos el mismo día.',
      },
    ],
  },
  {
    slug: 'agente-de-ia-para-instagram',
    title: 'Agente de IA para Instagram: responde DMs y vende | Michelangelo Devs',
    h1: 'Agente de IA para Instagram',
    description:
      'Cómo un agente de IA responde los mensajes directos de Instagram, califica al comprador y cierra la venta sin salir del chat. Por Michelangelo Devs.',
    direct:
      'Un agente de IA para Instagram responde los mensajes directos y los comentarios de tu cuenta al instante, califica a quien escribe, cotiza con tu catálogo y agenda o cobra sin salir del chat. Michelangelo Devs lo construye con la voz de tu marca y lo pone en vivo en menos de dos semanas.',
    sections: [
      {
        h2: '¿Por qué Instagram necesita un agente?',
        lead:
          'Porque la venta se pierde en la espera. La gente pregunta precio por DM a varias cuentas a la vez y le compra a la primera que responde. Un agente contesta en menos de un segundo, a las tres de la mañana y en temporada alta igual.',
      },
      {
        h2: '¿Qué hace en la práctica?',
        bullets: [
          'Responde DMs con tu catálogo: precio, tallas, colores y stock reales.',
          'Contesta comentarios y lleva la conversación al privado.',
          'Califica: separa compradores de curiosos y puntúa la intención.',
          'Agenda citas con disponibilidad real y envía el recordatorio.',
          'Cierra con link de pago dentro del chat.',
          'Sigue la conversación en WhatsApp sin que el cliente repita nada.',
        ],
      },
      {
        h2: '¿Mantiene la voz de mi marca?',
        lead:
          'Sí. El agente se entrena con tus conversaciones reales y el lenguaje de tu mejor vendedor. Tú apruebas el tono antes de salir en vivo, y un segundo modelo audita cada respuesta antes de enviarla.',
      },
    ],
    faqs: [
      {
        // "agente de Instagram" / "agente de WhatsApp" a secas, como se busca.
        q: '¿Un agente de Instagram es distinto a un agente de WhatsApp?',
        a: 'Es el mismo agente. Un agente de Instagram y un agente de WhatsApp comparten el mismo cerebro, tu catálogo y tu CRM; solo cambia el canal por donde entra el mensaje.',
      },
      {
        q: '¿El agente también atiende WhatsApp y mi web?',
        a: 'Sí. Un solo agente atiende Instagram, WhatsApp y tu sitio web, así que el cliente que empieza en Instagram y sigue por WhatsApp no tiene que repetir nada.',
      },
      {
        q: '¿Va a sonar como un robot?',
        a: 'No. El agente se entrena con tus conversaciones reales y el lenguaje de tu mejor vendedor, así que responde con la voz de tu marca. Tú apruebas el tono antes de salir en vivo.',
      },
      {
        q: '¿Cuánto tarda en estar en vivo?',
        a: 'Menos de dos semanas: un par de días para mapear cómo vendes, una semana para construir, unos días para probar y el lanzamiento.',
      },
    ],
  },
  {
    slug: 'empresas-de-inteligencia-artificial-en-venezuela',
    title: 'Empresas de inteligencia artificial en Venezuela | Michelangelo Devs',
    h1: 'Empresas de inteligencia artificial en Venezuela',
    description:
      'Cómo es el panorama de la inteligencia artificial aplicada en Venezuela y qué diferencia a una empresa que implementa IA de una que solo asesora.',
    direct:
      'En Venezuela ya hay empresas de inteligencia artificial que implementan IA aplicada a ventas, no solo consultoría. Michelangelo Devs construye agentes de IA en producción para WhatsApp, Instagram y web, con clientes como Lidotel y Coloreal, y es OpenAI Select Partner dentro de la OpenAI Partner Network.',
    sections: [
      {
        h2: 'IA aplicada, no IA en presentación',
        lead:
          'La diferencia práctica está en qué te entregan. Una empresa de IA aplicada te deja software funcionando y atendiendo clientes reales; una de consultoría te deja un diagnóstico. Michelangelo Devs entrega lo primero: el agente en vivo, en tus canales, en menos de dos semanas.',
      },
      {
        h2: '¿Qué sectores la están usando en Venezuela?',
        bullets: [
          'Hotelería: cotizar habitaciones y cobrar la reserva por chat.',
          'Retail al detal y al mayor: catálogo, precios y stock por WhatsApp.',
          'Clínicas y salud: filtrar consultas y agendar con el médico.',
          'Manufactura y distribución: atender pedidos mayoristas sin vendedor de guardia.',
        ],
      },
      {
        h2: '¿Funciona con la conectividad de aquí?',
        lead:
          'Sí, porque vive donde ya está el cliente: WhatsApp e Instagram. No exige que tu comprador instale nada ni entre a una plataforma nueva, y no depende de que tu equipo esté conectado para responder.',
      },
    ],
    faqs: [
      {
        q: '¿Qué diferencia hay entre una agencia de IA y una consultora?',
        a: 'La consultora entrega un diagnóstico o una estrategia; la agencia de IA entrega software funcionando. Michelangelo Devs construye el agente, lo conecta a tu catálogo y tu CRM, y lo deja atendiendo clientes reales.',
      },
      {
        q: '¿Atienden fuera de Venezuela?',
        a: 'Sí. Estamos en Venezuela y atendemos toda Latinoamérica. El agente habla español, inglés y portugués, y cambia de idioma a mitad de conversación si el cliente cambia.',
      },
      {
        q: '¿Cómo empiezo?',
        a: 'Escríbenos por WhatsApp al +58 422 719 7216. Cuéntanos qué vendes y por qué canal se te escapan ventas, y respondemos el mismo día.',
      },
    ],
  },
  {
    slug: 'agente-de-ia-para-clinicas',
    title: 'Agente de IA para clínicas y consultorios | Michelangelo Devs',
    h1: 'Agente de IA para clínicas',
    description:
      'Cómo un agente de IA atiende pacientes en WhatsApp e Instagram, filtra consultas y agenda con la disponibilidad real del médico. El caso Renaissence.',
    direct:
      'Un agente de IA para clínicas atiende a los pacientes en WhatsApp e Instagram: responde dudas sobre tratamientos, filtra quién quiere consulta real, agenda con la disponibilidad del médico y envía recordatorios. Michelangelo Devs construyó el agente de Clínica Renaissence y lo puso en vivo en menos de dos semanas.',
    sections: [
      {
        h2: '¿Qué resuelve en una clínica?',
        lead:
          'El cuello de botella de recepción. La mayoría de los mensajes son las mismas preguntas sobre precios, duración y preparación de un tratamiento. El agente las responde todas al instante y deja a tu equipo solo los casos que de verdad requieren una persona.',
      },
      {
        h2: '¿Qué hace con la agenda?',
        bullets: [
          'Ofrece disponibilidad real del médico, no horarios genéricos.',
          'Confirma la cita y envía el recordatorio antes de la consulta.',
          'Reagenda cuando el paciente lo pide, sin llamadas.',
          'Deja cada paciente registrado en el CRM con el motivo de consulta.',
        ],
      },
      {
        h2: '¿Y los temas médicos delicados?',
        lead:
          'El agente no diagnostica ni da indicaciones clínicas: informa sobre servicios, precios de consulta y disponibilidad. Cuando la pregunta es médica o el caso es sensible, escala a una persona con la conversación completa adjunta. Las reglas de escalado las definimos contigo durante la construcción.',
      },
    ],
    faqs: [
      {
        q: '¿El agente da diagnósticos médicos?',
        a: 'No. El agente informa sobre servicios, disponibilidad y preparación de una consulta, y escala a una persona cuando la pregunta es médica. Prefiere escalar antes que responder mal.',
      },
      {
        q: '¿Se conecta con la agenda del consultorio?',
        a: 'Sí. CRM y calendario se conectan el primer día de construcción, no se venden como un extra después.',
      },
      {
        q: '¿Qué pasa cuando el agente no sabe la respuesta?',
        a: 'Escala a una persona con toda la conversación adjunta, en lugar de adivinar. Las reglas de escalado las definimos contigo el día cuatro, y el agente prefiere escalar antes que responder mal.',
      },
    ],
  },
  {
    slug: 'agente-de-ia-para-tiendas-y-ecommerce',
    title: 'Agente de IA para tiendas y ecommerce | Michelangelo Devs',
    h1: 'Agente de IA para tiendas y ecommerce',
    description:
      'Cómo un agente de IA responde con tu catálogo real, atiende detal y mayor por WhatsApp e Instagram y cierra con link de pago. Casos Terracota y TopOne.',
    direct:
      'Un agente de IA para tiendas responde cada mensaje de WhatsApp e Instagram con tu catálogo real: precio, tallas y stock, tanto al detal como al mayor. Cierra con link de pago dentro del chat. Michelangelo Devs lo construyó para Terracota y TopOne, en vivo en menos de dos semanas.',
    sections: [
      {
        h2: '¿De dónde saca los precios y el stock?',
        lead:
          'De tus propias hojas o tu sistema. El agente no improvisa precios: responde con lo que de verdad tienes disponible, y cuando algo se agota deja de ofrecerlo. Si manejas lista al detal y lista al mayor, distingue a quién le habla.',
      },
      {
        h2: '¿Qué hace en una tienda?',
        bullets: [
          'Responde precio, tallas, colores y disponibilidad al instante.',
          'Diferencia cliente al detal de comprador al mayor y aplica la lista correcta.',
          'Arma el pedido y cierra con link de pago en el mismo chat.',
          'Recupera al que preguntó y no volvió, con dos seguimientos.',
          'Atiende Instagram y WhatsApp con un solo cerebro.',
        ],
      },
      {
        h2: '¿Sirve para venta al mayor?',
        lead:
          'Sí, y suele ser donde más rinde. TopOne vende repuestos al mayor y Terracota maneja detal y mayor a la vez: el agente atiende pedidos grandes fuera de horario sin que haya un vendedor de guardia esperando el mensaje.',
      },
    ],
    faqs: [
      {
        q: '¿El agente conoce mi inventario real?',
        a: 'Sí. Se conecta a tu catálogo y responde con precios y stock reales desde tus propias hojas o tu sistema, no con una respuesta genérica.',
      },
      {
        q: '¿Puede cobrar dentro del chat?',
        a: 'Sí. El agente cierra la venta con un link de pago dentro de la misma conversación, sin mandar al cliente a otro canal.',
      },
      {
        q: '¿En qué canales funciona el agente?',
        a: 'WhatsApp, mensajes directos de Instagram y tu propio sitio web. Un solo agente atiende todos los canales, así que el cliente que empieza en Instagram y sigue por WhatsApp no tiene que repetir nada.',
      },
    ],
  },
  {
    // Consulta comparativa: quien la busca está evaluando, no explorando.
    slug: 'chatbot-vs-agente-de-ia',
    title: 'Chatbot vs agente de IA: cuál es la diferencia | Michelangelo Devs',
    h1: 'Chatbot vs agente de IA',
    description:
      'La diferencia real entre un chatbot de botones y un agente de IA que ejecuta acciones: cotiza, agenda, cobra y actualiza el CRM.',
    direct:
      'Un chatbot sigue un guion de botones y se rompe cuando el cliente escribe algo imprevisto. Un agente de IA entiende el mensaje, decide el siguiente paso y ejecuta acciones reales: cotiza, agenda, cobra y actualiza el CRM. Michelangelo Devs construye agentes, no chatbots, en menos de dos semanas.',
    sections: [
      {
        h2: 'La diferencia en una frase',
        lead:
          'El chatbot responde; el agente actúa. Un chatbot te dice "un asesor te contactará"; un agente consulta la disponibilidad, aparta el cupo, manda el link de pago y deja el lead en la etapa correcta del CRM, todo dentro de la misma conversación.',
      },
      {
        h2: 'Dónde se rompe un chatbot',
        bullets: [
          'El cliente escribe algo que no estaba en el guion y el flujo se cae.',
          'No conoce tu stock ni tus precios reales, así que responde genérico.',
          'No puede agendar ni cobrar: solo deriva a un humano.',
          'Obliga al cliente a navegar menús en lugar de escribir como habla.',
        ],
      },
      {
        h2: '¿Y si el agente se equivoca?',
        lead:
          'Por eso un segundo modelo audita cada borrador antes de enviarlo, y cuando el agente no está seguro escala a una persona con la conversación completa. Preferimos que escale a que invente: las reglas de escalado se definen contigo durante la construcción.',
      },
    ],
    faqs: [
      {
        q: '¿Es lo mismo un asesor virtual, un asistente virtual y un agente de IA?',
        a: 'En la práctica la gente usa los tres nombres para lo mismo: un asesor virtual con IA que atiende a tus clientes solo. Nosotros lo llamamos agente porque no solo conversa: cotiza, agenda, cobra y actualiza tu CRM. Un chatbot sigue un guion de botones; un agente entiende, decide y ejecuta.',
      },
      {
        q: '¿Puedo migrar de mi chatbot actual a un agente?',
        a: 'Sí. Partimos de tus conversaciones reales, incluidas las que tu chatbot no supo resolver, y esas se vuelven los casos borde que el agente tiene que manejar antes de salir en vivo.',
      },
      {
        q: '¿Qué pasa cuando el agente no sabe la respuesta?',
        a: 'Escala a una persona con toda la conversación adjunta, en lugar de adivinar. Las reglas de escalado las definimos contigo el día cuatro, y el agente prefiere escalar antes que responder mal.',
      },
    ],
  },
]
