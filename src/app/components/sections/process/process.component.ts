import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <section id="process" class="relative py-32 overflow-hidden bg-dark-900">
      <!-- Teal nebula gradient from center-bottom -->
      <div
        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-20 pointer-events-none"
        style="background: radial-gradient(circle, rgb(var(--accent-rgb) / 0.13) 0%, transparent 50%); filter: blur(120px)"
      ></div>

      <!-- Dot grid -->
      <div
        class="absolute inset-0 opacity-10 pointer-events-none"
        style="background-image: radial-gradient(circle, rgb(var(--brand-rgb) / 0.195) 1px, transparent 1px); background-size: 50px 50px; mask-image: radial-gradient(ellipse at center, black, transparent 80%);"
      ></div>

      <div class="relative z-10 max-w-5xl mx-auto px-6">
        <!-- Section Title -->
        <h2
          appScrollReveal
          class="text-3xl md:text-4xl font-bold text-text-primary text-center mb-16 leading-tight"
        >
          Cómo trabajamos en
          <span class="font-serif italic text-neon-green text-glow-green">menos de 5 días</span>
        </h2>

        <!-- Process Steps - Grid compacto -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            *ngFor="let step of processSteps"
            appScrollReveal
            class="text-center"
          >
            <p class="text-xs uppercase tracking-[0.2em] text-neon-green/70 mb-2 font-semibold">
              {{ step.day }}
            </p>

            <!-- Step Number pequeño -->
            <div
              class="text-5xl font-bold mb-4 text-neon-green"
              style="filter: drop-shadow(0 0 20px rgb(var(--brand-rgb) / 0.325))"
            >
              {{ step.number }}
            </div>

            <!-- Step Card minimalista -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-text-primary mb-2">
                {{ step.title }}
              </h3>
              <p class="text-sm text-text-tertiary leading-relaxed">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes draw-line {
      from {
        height: 0;
      }
      to {
        height: 5rem;
      }
    }

    .step-connector {
      animation: draw-line 0.8s ease-out forwards;
    }
  `]
})
export class ProcessComponent {
  processSteps = [
    {
      number: '01',
      day: 'Día 1',
      title: 'Onboarding',
      description: 'Entendemos tu negocio, definimos objetivos y conectamos tus canales.'
    },
    {
      number: '02',
      day: 'Día 2-3',
      title: 'Configuración y desarrollo',
      description: 'Construimos tu agente con tu tono, tus datos y tu lógica de venta.'
    },
    {
      number: '03',
      day: 'Día 4',
      title: 'Fase de prueba',
      description: 'Tú lo pruebas en escenarios reales. Nosotros ajustamos hasta que cierre como tú.'
    },
    {
      number: '04',
      day: 'Día 5',
      title: 'Despliegue',
      description: 'Lo conectamos a producción. Empieza a trabajar 24/7.'
    }
  ];
}
