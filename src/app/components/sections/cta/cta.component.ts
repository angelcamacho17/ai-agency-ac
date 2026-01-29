import { Component } from '@angular/core';
import { MagneticButtonDirective } from '../../../directives/magnetic-button.directive';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [MagneticButtonDirective, ScrollRevealDirective],
  template: `
    <section id="contact" class="relative py-48 overflow-hidden bg-dark-900">
      <!-- Massive green + orange nebula gradient -->
      <div
        class="absolute inset-0 pointer-events-none"
        style="
          background:
            radial-gradient(ellipse at 30% 50%, rgba(16, 185, 129, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 50%, rgba(251, 146, 60, 0.3) 0%, transparent 50%);
        "
      ></div>

      <!-- Dense particles (visual representation) -->
      <div class="absolute inset-0 opacity-40 pointer-events-none"></div>

      <div class="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <!-- Headline -->
        <h2
          appScrollReveal
          class="text-hero font-extrabold leading-[1] tracking-tighter mb-40"
        >
          <span class="block text-text-primary mb-8" style="font-size: 1.5rem; font-weight: 300; letter-spacing: 0.5rem;">construyamos algo</span>
          <span class="block text-neon-green font-serif italic text-glow-green-strong"
        >increíble</span
      >
        </h2>


        <!-- Hero CTA Button -->
        <div appScrollReveal class="mb-8">
          <a
            href="https://calendly.com/angelcamacho-developer/30min"
            target="_blank"
            rel="noopener noreferrer"
            appMagneticButton
            class="cta-hero-button inline-block px-16 py-6 bg-gradient-to-r from-neon-green to-neon-teal text-dark-950 text-xl font-bold rounded-2xl transition-all duration-300 hover:shadow-glow-green-lg animate-pulse-glow focus:outline-none focus:ring-4 focus:ring-neon-green/50"
          >
            Iniciar Proyecto
          </a>
        </div>

        <!-- Email Link -->
        <p appScrollReveal class="text-text-tertiary">
          o escríbenos a
          <a
            href="mailto:angelcamacho.developer@gmail.com"
            class="text-text-secondary hover:text-neon-green transition-all duration-300 underline underline-offset-4 decoration-neon-green/50 hover:decoration-neon-green"
          >
            angelcamacho.developer&#64;gmail.com
          </a>
        </p>
      </div>
    </section>
  `,
  styles: [`
    .cta-hero-button {
      position: relative;
    }

    .cta-hero-button::before {
      content: '';
      position: absolute;
      inset: -4px;
      background: linear-gradient(135deg, #10b981, #14b8a6);
      border-radius: inherit;
      opacity: 0;
      filter: blur(20px);
      transition: opacity 0.3s;
      z-index: -1;
    }

    .cta-hero-button:hover::before {
      opacity: 1;
      filter: blur(30px);
    }

    .cta-hero-button:hover {
      transform: translateY(-4px) scale(1.05);
    }

    .text-hero {
      font-size: 4.5rem;
    }
  `]
})
export class CtaComponent { }
