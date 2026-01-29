import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-philosophy',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <section class="relative py-32 overflow-hidden bg-dark-900">
      <!-- Subtle green gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-neon-green/5 to-transparent pointer-events-none"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6">
        <!-- Quote -->
        <h2
          appScrollReveal
          class="text-section font-bold text-center mb-12 leading-tight"
        >
          Filosofía<br />
        </h2>

        <!-- Philosophy Cards -->
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 card"
        >
          <div
            *ngFor="let item of philosophyItems"
            appScrollReveal
            class="philosophy-card glassmorphism-card rounded-3xl p-12 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow-green group"
          >
            <!-- Title -->
            <h3
              class="text-2xl font-bold text-text-primary mb-4 text-center"
            >
              {{ item.title }}
            </h3>

            <!-- Description -->
            <p class="text-text-tertiary text-center leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Noise texture -->
      <div class="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none grain-texture"></div>
    </section>
  `,
  styles: [`
    .philosophy-card {
      position: relative;
    }

    .philosophy-card::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.5), rgba(20, 184, 166, 0.5));
      border-radius: inherit;
      opacity: 0;
      filter: blur(20px);
      transition: all 0.5s;
      z-index: -1;
    }

    .philosophy-card:hover::before {
      opacity: 1;
      filter: blur(30px);
    }

    .icon-container svg {
      width: 100%;
      height: 100%;
    }

    .philosophy-card .leading-relaxed {
      transition: color 0.3s ease;
    }

    .philosophy-card:hover .leading-relaxed {
      color: #fff;
    }

    .grain-texture {
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }
  `]
})
export class PhilosophyComponent {
  philosophyItems = [
    {
      title: 'Nunca te pares',
      description: 'La resiliencia construye excelencia. Cada desafío es una oportunidad para crear algo extraordinario.',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
      </svg>`
    },
    {
      title: 'Equivócate rápido',
      description: 'Iterar es aprender. Los errores rápidos conducen a soluciones brillantes y productos que evolucionan.',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>`
    },
    {
      title: 'Software que inspire',
      description: 'Más allá de funcional. Creamos experiencias que transforman, motivan y dejan huella.',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
      </svg>`
    }
  ];
}
