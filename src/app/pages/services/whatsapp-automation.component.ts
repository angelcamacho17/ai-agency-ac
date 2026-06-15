import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-whatsapp-automation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-dark-900 text-text-secondary pt-32 pb-24 px-6">
      <div class="max-w-4xl mx-auto">
        <a routerLink="/" class="inline-block mb-8 text-neon-green hover:text-neon-teal transition-colors duration-300">&larr; Volver al inicio</a>

        <h1 class="text-4xl md:text-5xl font-bold text-text-primary mb-6">
          WhatsApp Automation &amp; <span class="text-neon-green">AI Agents</span>
        </h1>

        <p class="text-lg md:text-xl text-text-primary font-medium leading-relaxed mb-12">
          WhatsApp automation uses the WhatsApp Business API plus an AI agent to handle sales and support conversations 24/7 without human staff. Michelangelo Devs builds production-grade WhatsApp AI agents for eCommerce that qualify leads, recover carts, and close sales, handling [REAL-METRIC: conversations/day] per day.
        </p>

        <div class="space-y-10">
          <section>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">How does WhatsApp Business automation work?</h2>
            <p>La automatización de WhatsApp conecta la WhatsApp Business API (Cloud API) con un AI agent que entiende lenguaje natural y responde como un humano. En Michelangelo Devs orquestamos cada conversación con n8n: los mensajes entrantes llegan por webhook, se procesan y se enriquecen con el contexto del cliente, y el AI agent genera la respuesta. Para soportar volumen alto y casos multi-número usamos también Evolution API cuando un cliente necesita instancias self-hosted. Todo el stack corre 24/7, sin operadores humanos, atendiendo [REAL-METRIC: tiempo de respuesta promedio].</p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">AI agent vs. a rule-based bot — what's the difference?</h2>
            <p>Un rule-based bot sigue árboles de decisión fijos: si el cliente se sale del menú, se rompe. Un AI agent razona. Michelangelo Devs usa Claude como LLM, así que el agente entiende intención, mantiene contexto a lo largo de la conversación, maneja objeciones y responde en el tono de tu marca. La diferencia en práctica es la tasa de conversión: un menú frustra, un AI agent vende. Por eso entregamos agentes que califican, recomiendan productos y cierran ventas, no solo bots que reenvían a un humano.</p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">What flows does Michelangelo Devs build?</h2>
            <p>Construimos los flujos que mueven la aguja en eCommerce:</p>
            <ul class="list-disc pl-6 mt-3 space-y-2">
              <li><span class="text-text-primary font-medium">Lead qualification:</span> el AI agent califica cada lead entrante, captura datos clave y deriva los leads calientes listos para cerrar.</li>
              <li><span class="text-text-primary font-medium">Cart recovery:</span> recuperación de carritos abandonados con seguimiento conversacional que recupera ventas que se hubieran perdido.</li>
              <li><span class="text-text-primary font-medium">Appointment booking:</span> agendamiento de citas y demos directo desde el chat, sin formularios.</li>
              <li><span class="text-text-primary font-medium">FAQ / support deflection:</span> resolución automática de preguntas frecuentes y soporte, desviando [REAL-METRIC: % de tickets deflectados] del equipo humano.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">What's our WhatsApp stack?</h2>
            <p>Nuestro stack está diseñado para producción y escala real. La capa de mensajería usa WhatsApp Business API (Cloud API) y Evolution API según el caso. La orquestación corre en n8n. Para agrupar mensajes y evitar respuestas fragmentadas usamos un message batching con Redis debouncing: cada mensaje entrante hace un SET con TTL de 60s, y mientras llegan más mensajes hacemos GET para reagrupar y DELETE al disparar la respuesta consolidada, de modo que el AI agent contesta a la idea completa del cliente y no a cada mensaje suelto. La persistencia y el aislamiento multi-tenant viven en Supabase, lo que nos permite servir a múltiples clientes desde una misma plataforma de forma segura. El razonamiento conversacional lo provee Claude como LLM. Este es el mismo stack con el que Michelangelo Devs entrega agentes que escalan a [REAL-METRIC: número de clientes/instancias activas].</p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">Automatiza tu WhatsApp con Michelangelo Devs</h2>
            <p class="mb-6">Si vendes por WhatsApp y aún respondes a mano, estás dejando ventas sobre la mesa. Michelangelo Devs te construye un AI agent en producción listo para calificar leads, recuperar carritos y cerrar ventas 24/7.</p>
            <a
              href="https://wa.me/584125671953"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block bg-neon-green text-dark-900 font-semibold px-8 py-4 rounded-lg hover:text-neon-teal hover:bg-neon-green/90 transition-colors duration-300"
            >
              Automatiza tu WhatsApp
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

    section p,
    section li {
      line-height: 1.8;
    }
  `]
})
export class WhatsappAutomationComponent {
  constructor(seo: SeoService) {
    seo.setPage({
      title: 'WhatsApp Automation & AI Agents | Michelangelo Devs',
      description: 'Michelangelo Devs builds production WhatsApp AI agents for eCommerce: WhatsApp Business API + Claude to qualify leads, recover carts and close sales 24/7.',
      path: '/whatsapp-automation'
    });

    seo.setJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'WhatsApp Automation',
        name: 'WhatsApp Automation & AI Agents',
        description: 'Production-grade WhatsApp AI agents for eCommerce built on the WhatsApp Business API and Claude — lead qualification, cart recovery, appointment booking and support deflection, running 24/7.',
        areaServed: {
          '@type': 'Place',
          name: 'Worldwide'
        },
        provider: {
          '@type': 'Organization',
          name: 'Michelangelo Devs',
          url: 'https://www.michelangelodevs.com'
        }
      }
    ]);
  }
}
