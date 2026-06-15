import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-ai-agents',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-dark-900 text-text-secondary pt-32 pb-24 px-6">
      <div class="max-w-4xl mx-auto">
        <a routerLink="/" class="inline-block mb-8 text-neon-green hover:text-neon-teal transition-colors duration-300">&larr; Volver al inicio</a>

        <h1 class="text-4xl md:text-5xl font-bold text-text-primary mb-6">
          AI Agents <span class="text-neon-green">Development</span>
        </h1>

        <p class="text-lg md:text-xl text-text-primary font-semibold leading-relaxed mb-12">
          An AI agent is autonomous software that perceives, decides, and acts without human input. Michelangelo Devs builds production-grade AI agents for eCommerce, averaging [REAL-METRIC: avg ROI %] ROI within 90 days.
        </p>

        <div class="space-y-10">
          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-3">¿Qué construye Michelangelo Devs?</h2>
            <p>En Michelangelo Devs diseñamos y desplegamos AI agents que conversan, venden y operan por sí solos a través de los canales donde ya están tus clientes. Construimos agentes para <span class="text-text-primary font-semibold">Instagram</span> (DMs y comentarios), <span class="text-text-primary font-semibold">WhatsApp</span> y <span class="text-text-primary font-semibold">agentes web</span> embebidos en tu tienda o landing. Cada agente entiende el contexto del negocio, responde en lenguaje natural, califica leads, recomienda productos y cierra pedidos sin intervención manual.</p>
            <p class="mt-4">Nuestra especialidad es la <span class="text-text-primary font-semibold">automatización de eCommerce</span>: atención al cliente 24/7, recuperación de carritos abandonados, seguimiento de órdenes, upselling contextual y sincronización con tu catálogo. El agente no es un chatbot de reglas: es software autónomo que percibe la intención del usuario, decide la mejor acción y ejecuta.</p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-3">¿Cómo generan resultados nuestros AI agents?</h2>
            <p>Un AI agent bien construido convierte conversaciones en ingresos. Al responder en segundos a cualquier hora, capturamos demanda que de otra forma se perdería: nuestros despliegues reducen el tiempo de respuesta a [REAL-METRIC: avg response time] y atienden [REAL-METRIC: % conversations automated] de las conversaciones sin un humano. Esto libera al equipo para enfocarse en casos de alto valor mientras el agente sostiene el volumen.</p>
            <p class="mt-4">En eCommerce, esto se traduce en más carritos recuperados, mayor ticket promedio por upselling contextual y una tasa de conversión que mejora en promedio [REAL-METRIC: conversion lift %]. Medimos cada agente contra KPIs reales del negocio —no contra métricas de vanidad— y reportamos un ROI promedio de [REAL-METRIC: avg ROI %] dentro de los primeros 90 días.</p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-3">¿Cuál es nuestro stack?</h2>
            <p>Michelangelo Devs construye sobre un stack de producción, no sobre prototipos. La orquestación corre en <span class="text-text-primary font-semibold">n8n</span>, que conecta y coordina cada paso del flujo del agente. El razonamiento lo provee <span class="text-text-primary font-semibold">Claude</span> y otros LLMs de frontera, encargados de comprender la intención y decidir la acción correcta.</p>
            <p class="mt-4">Persistimos memoria, contexto y catálogo en <span class="text-text-primary font-semibold">Supabase</span>. Integramos los canales mediante la <span class="text-text-primary font-semibold">Meta Graph API</span> para Instagram, y <span class="text-text-primary font-semibold">Evolution API</span> o la <span class="text-text-primary font-semibold">WhatsApp Cloud API</span> para WhatsApp. Para mensajes entrantes en ráfaga aplicamos <span class="text-text-primary font-semibold">debouncing con Redis</span>, de modo que el agente espera a que el usuario termine de escribir antes de responder, evitando respuestas fragmentadas y costos innecesarios de inferencia.</p>
            <p class="mt-4">El resultado es un sistema observable, escalable y mantenible: cada agente de Michelangelo Devs se monitorea, se versiona y se ajusta con datos reales de operación.</p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-3">Hablemos de tu agente</h2>
            <p class="mb-6">¿Listo para poner un AI agent a trabajar en tu eCommerce? Cuéntanos tu caso y diseñamos el agente que tu negocio necesita.</p>
            <a
              href="https://wa.me/584125671953"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block bg-neon-green text-dark-900 font-bold px-8 py-4 rounded-lg hover:bg-neon-teal transition-colors duration-300"
            >
              Hablemos de tu agente
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
export class AiAgentsComponent {
  constructor(seo: SeoService) {
    seo.setPage({
      title: 'AI Agents Development | Michelangelo Devs',
      description: 'Michelangelo Devs builds production-grade AI agents for eCommerce on Instagram, WhatsApp and web — autonomous software that sells and supports 24/7.',
      path: '/ai-agents',
    });

    seo.setJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'AI Agents',
        name: 'AI Agents Development',
        description:
          'Production-grade AI agents for eCommerce — autonomous Instagram, WhatsApp and web agents that perceive, decide and act to drive sales and support 24/7.',
        provider: {
          '@type': 'Organization',
          name: 'Michelangelo Devs',
          url: 'https://www.michelangelodevs.com',
        },
        areaServed: 'Worldwide',
      },
    ]);
  }
}
