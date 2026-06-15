import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-chatbot-development',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-dark-900 text-text-secondary pt-32 pb-24 px-6">
      <div class="max-w-4xl mx-auto">
        <a routerLink="/" class="inline-block mb-8 text-neon-green hover:text-neon-teal transition-colors duration-300">&larr; Volver al inicio</a>

        <h1 class="text-4xl md:text-5xl font-bold text-text-primary mb-6">
          Chatbot <span class="text-neon-green">Development</span>
        </h1>

        <p class="text-lg md:text-xl text-text-primary font-medium mb-12 leading-relaxed">
          Chatbot development is the design and engineering of automated conversational software for websites and messaging apps. Michelangelo Devs builds production-grade AI chatbots — not rule-based scripts — that understand intent, integrate with your eCommerce stack, and resolve [REAL-METRIC: % of queries] without a human.
        </p>

        <div class="space-y-10">
          <section>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">¿Qué tipo de chatbot necesita tu negocio?</h2>
            <p>No todo negocio necesita un AI chatbot. La pregunta correcta no es "¿qué es lo más avanzado?", sino "¿qué problema estás resolviendo?". Si recibes preguntas repetitivas con respuestas fijas — horarios, dirección, estatus de un pedido por número — un bot bien diseñado las atiende todo el día. Si tus clientes preguntan cosas en mil formas distintas, comparan productos o necesitan recomendaciones, entonces sí hace falta inteligencia real. En Michelangelo Devs empezamos por mapear tus conversaciones reales antes de proponer tecnología.</p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">AI chatbot vs. rule-based bot — ¿cuándo es correcto cada uno?</h2>
            <p>Seamos honestos: un rule-based bot no es inferior, es distinto. Para flujos cerrados y predecibles (un menú de opciones, un formulario guiado, un FAQ corto) un bot basado en reglas es más barato, más rápido de construir, totalmente predecible y nunca "alucina". Es la decisión correcta cuando el dominio es limitado. El AI chatbot, basado en un LLM, justifica su costo cuando el lenguaje del cliente es abierto, cuando necesitas entender intención más allá de palabras clave, o cuando el bot debe razonar sobre datos en vivo de tu catálogo. Si tu caso se resuelve con reglas, te lo diremos — no vendemos complejidad innecesaria.</p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">¿Qué construye Michelangelo Devs?</h2>
            <p>Construimos AI chatbots de nivel producción. La capa de comprensión usa Claude (LLM) para interpretar intención y generar respuestas naturales en español o inglés. Orquestamos la lógica y las integraciones con n8n, y usamos Supabase como base de datos y backend para historial de conversaciones, contexto y datos del cliente. El resultado no es un demo: es un sistema con logging, manejo de errores y handoff a un humano cuando hace falta. Resolvemos [REAL-METRIC: % of queries] de forma autónoma y derivamos el resto a tu equipo con todo el contexto.</p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">¿Con qué plataformas integramos?</h2>
            <p>Desplegamos el chatbot donde están tus clientes: como web widget embebido en tu sitio y como canal en WhatsApp e Instagram. Del lado del eCommerce conectamos con Shopify y WooCommerce para consultar productos, precios, inventario y estatus de pedidos en tiempo real, de modo que el bot responda con datos verdaderos y no inventados. Cada integración se construye sobre n8n y Supabase para mantener el flujo auditable y mantenible.</p>
          </section>

          <section>
            <p class="text-text-primary text-lg mb-6">¿Listo para automatizar tus conversaciones con un chatbot que realmente entiende a tus clientes?</p>
            <a
              href="https://wa.me/584125671953"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block bg-neon-green text-dark-900 font-semibold px-8 py-4 rounded-lg hover:text-neon-teal transition-colors duration-300"
            >
              Hablemos de tu chatbot
            </a>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    section p {
      line-height: 1.8;
    }
  `]
})
export class ChatbotDevelopmentComponent {
  constructor(private seo: SeoService) {
    this.seo.setPage({
      title: 'Chatbot Development | Michelangelo Devs',
      description: 'Michelangelo Devs builds production-grade AI chatbots for web, WhatsApp and Instagram — powered by Claude, n8n and Supabase, integrated with Shopify and WooCommerce.',
      path: '/chatbot-development',
    });

    this.seo.setJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Chatbot Development',
        provider: {
          '@type': 'Organization',
          name: 'Michelangelo Devs',
          url: 'https://www.michelangelodevs.com',
        },
        areaServed: 'Worldwide',
        description:
          'Design and engineering of production-grade AI chatbots for websites and messaging apps (WhatsApp, Instagram), integrated with eCommerce platforms such as Shopify and WooCommerce.',
      },
    ]);
  }
}
