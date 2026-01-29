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
        style="background: radial-gradient(circle, rgba(20, 184, 166, 0.2) 0%, transparent 50%); filter: blur(120px)"
      ></div>

      <!-- Dot grid -->
      <div
        class="absolute inset-0 opacity-10 pointer-events-none"
        style="background-image: radial-gradient(circle, rgba(16, 185, 129, 0.3) 1px, transparent 1px); background-size: 50px 50px; mask-image: radial-gradient(ellipse at center, black, transparent 80%);"
      ></div>

      <div class="relative z-10 max-w-5xl mx-auto px-6">
        <!-- Section Title -->
        <h2
          appScrollReveal
          class="text-3xl md:text-4xl font-bold text-text-primary text-center mb-16 text-glow-green"
        >
          Cómo trabajamos
        </h2>

        <!-- Process Steps - Grid compacto -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            *ngFor="let step of processSteps"
            appScrollReveal
            class="text-center"
          >
            <!-- Step Number pequeño -->
            <div
              class="text-5xl font-bold mb-4 text-neon-green"
              style="filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))"
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
      title: 'Descubrimiento',
      description: 'Entendemos tu negocio y objetivos.'
    },
    {
      number: '02',
      title: 'Construcción',
      description: 'Arquitectura limpia y escalable.'
    },
    {
      number: '03',
      title: 'Pruebas',
      description: 'Optimización y refinamiento continuo.'
    },
    {
      number: '04',
      title: 'Lanzamiento',
      description: 'Despliegue y soporte completo.'
    }
  ];
}
