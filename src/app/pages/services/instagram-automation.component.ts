import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-instagram-automation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-dark-900 text-text-secondary pt-32 pb-24 px-6">
      <div class="max-w-4xl mx-auto">
        <a routerLink="/" class="inline-block mb-8 text-neon-green hover:text-neon-teal transition-colors duration-300">&larr; Volver al inicio</a>

        <h1 class="text-4xl md:text-5xl font-bold text-text-primary mb-6">
          Instagram Automation & <span class="text-neon-green">AI Agents</span>
        </h1>

        <p class="text-lg text-text-primary font-medium leading-relaxed mb-12">
          Instagram automation uses the Meta Graph API plus an AI agent to auto-respond to DMs, story replies, and comments, turning followers into qualified leads 24/7. Michelangelo Devs builds production-grade Instagram AI agents for eCommerce that qualify and route leads, generating [REAL-METRIC: leads in 30 days].
        </p>

        <div class="space-y-10">
          <section>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">How does Instagram DM automation work?</h2>
            <p>Instagram DM automation conecta tu cuenta profesional con la Meta Graph API y la Instagram Messaging API mediante webhooks. Cada vez que un seguidor envía un DM, responde a una story o comenta una publicación, el evento llega a una capa de orquestación en n8n. Ahí, un AI agent basado en Claude (LLM) interpreta la intención del mensaje, decide la mejor respuesta y la envía en segundos, sin intervención humana y disponible 24/7.</p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">What can an Instagram AI agent actually do?</h2>
            <p>Un Instagram AI agent va mucho más allá de respuestas automáticas genéricas. Detecta intención de compra, califica leads con preguntas naturales, recomienda productos del catálogo de tu eCommerce y filtra spam. Cuando un lead está listo para cerrar, hace un handoff fluido a WhatsApp o a un humano del equipo. Estos son los flujos principales que implementamos:</p>
            <ul class="list-disc pl-6 mt-3 space-y-2">
              <li><span class="text-neon-green">DM auto-reply:</span> respuestas instantáneas a mensajes directos con contexto de la conversación.</li>
              <li><span class="text-neon-green">Comment-to-DM:</span> convierte comentarios en publicaciones en conversaciones privadas de DM.</li>
              <li><span class="text-neon-green">Story-reply capture:</span> captura las respuestas a stories y las transforma en leads accionables.</li>
              <li><span class="text-neon-green">Lead qualification + handoff:</span> califica al prospecto y lo deriva a WhatsApp o a un agente humano.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">What does Michelangelo Devs build?</h2>
            <p>Michelangelo Devs construye Instagram AI agents production-grade para marcas de eCommerce. No vendemos plantillas: diseñamos el flujo conversacional, conectamos tu catálogo y tu CRM, y entrenamos al agente con el tono de tu marca. Cada lead capturado se persiste en Supabase, de modo que tienes trazabilidad completa de cada conversación, conversión y handoff. El resultado es un sistema que trabaja mientras duermes y genera [REAL-METRIC: leads cualificados por mes].</p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">What's our Instagram stack?</h2>
            <p>Nuestro stack está pensado para escalar y para integrarse con tus herramientas actuales. Combinamos la Meta Graph API y la Instagram Messaging API como puerta de entrada, n8n para la orquestación de flujos, Claude (LLM) para intent detection y qualification, y Supabase como base de datos en tiempo real para leads y eventos. El handoff final a WhatsApp asegura que ningún lead caliente se enfríe esperando respuesta.</p>
            <ul class="list-disc pl-6 mt-3 space-y-2">
              <li><span class="text-neon-green">Meta Graph API + Instagram Messaging API</span> — integración oficial con tu cuenta profesional.</li>
              <li><span class="text-neon-green">n8n</span> — orquestación de webhooks y flujos automatizados.</li>
              <li><span class="text-neon-green">Claude / LLM</span> — intent detection y lead qualification.</li>
              <li><span class="text-neon-green">Supabase</span> — persistencia de leads, conversaciones y métricas.</li>
            </ul>
          </section>
        </div>

        <div class="mt-14">
          <a
            href="https://wa.me/584125671953"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block bg-neon-green text-dark-900 font-semibold px-8 py-4 rounded-lg hover:text-neon-teal transition-colors duration-300"
          >
            Automatiza tu Instagram
          </a>
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
export class InstagramAutomationComponent {
  constructor(seo: SeoService) {
    seo.setPage({
      title: 'Instagram Automation & AI Agents | Michelangelo Devs',
      description: 'Michelangelo Devs builds production-grade Instagram AI agents for eCommerce: auto-reply DMs, story replies and comments to qualify and route leads 24/7.',
      path: '/instagram-automation',
    });

    seo.setJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Instagram Automation',
        provider: {
          '@type': 'Organization',
          name: 'Michelangelo Devs',
          url: 'https://www.michelangelodevs.com',
        },
        areaServed: 'Worldwide',
        description:
          'Production-grade Instagram AI agents for eCommerce that auto-respond to DMs, story replies and comments, qualifying and routing leads 24/7 using the Meta Graph API, n8n, Claude (LLM) and Supabase.',
        url: 'https://www.michelangelodevs.com/instagram-automation',
      },
    ]);
  }
}
