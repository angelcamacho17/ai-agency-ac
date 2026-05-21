import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MagneticButtonDirective } from '../../../directives/magnetic-button.directive';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';
import { HandsTouchService } from '../../effects/hands-scroll/hands-scroll.component';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [MagneticButtonDirective, ScrollRevealDirective, TranslatePipe],
  template: `
    <section id="contact" class="relative py-24 md:py-48 overflow-hidden bg-dark-900">
      <div
        class="absolute inset-0 pointer-events-none"
        style="
          background:
            radial-gradient(ellipse at 50% 50%, rgb(var(--brand-rgb) / 0.227) 0%, transparent 55%);
        "
      ></div>

      <div class="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h2
          appScrollReveal
          class="text-hero font-extrabold leading-[1] tracking-tighter mb-10 md:mb-16"
        >
          <span class="block text-text-primary mb-6" style="font-size: 1.5rem; font-weight: 300; letter-spacing: 0.5rem;">{{ 'cta.headlineSmall' | translate }}</span>
          <span class="block text-neon-green font-serif italic text-glow-green-strong">{{ 'cta.headlineAccent' | translate }}</span>
        </h2>

        <p appScrollReveal class="text-text-secondary text-lg mb-8 md:mb-12 max-w-xl mx-auto">
          {{ 'cta.subhead' | translate }}
        </p>

        <div appScrollReveal class="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a
            href="https://calendly.com/angel-camacho-michelangelodevs/30min"
            target="_blank"
            rel="noopener noreferrer"
            appMagneticButton
            class="calendly-cta-button inline-flex items-center gap-3 px-10 py-5 text-dark-950 text-xl font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-neon-green/50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>{{ 'cta.bookCall' | translate }}</span>
          </a>

          <span class="text-text-tertiary text-sm uppercase tracking-widest">{{ 'cta.or' | translate }}</span>

          <a
            href="https://ig.me/m/michelangelo.devs"
            target="_blank"
            rel="noopener noreferrer"
            appMagneticButton
            (click)="onIgClick($event)"
            class="ig-cta-button inline-flex items-center gap-3 px-10 py-5 text-white text-xl font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-400/50"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            <span>{{ 'cta.button' | translate }}</span>
          </a>
        </div>

        <p appScrollReveal class="text-text-tertiary">
          {{ 'cta.fallback' | translate }}
          <a
            href="https://instagram.com/michelangelo.devs"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-secondary hover:text-neon-green transition-all duration-300 underline underline-offset-4 decoration-neon-green/50 hover:decoration-neon-green"
          >
            &#64;michelangelo.devs
          </a>
        </p>
      </div>
    </section>
  `,
  styles: [`
    .calendly-cta-button {
      position: relative;
      background: linear-gradient(135deg, rgb(var(--brand-rgb)) 0%, rgb(var(--brand-rgb) / 0.85) 100%);
      box-shadow: 0 0 40px rgb(var(--brand-rgb) / 0.45);
    }

    .calendly-cta-button::before {
      content: '';
      position: absolute;
      inset: -4px;
      background: linear-gradient(135deg, rgb(var(--brand-rgb)), rgb(var(--brand-rgb) / 0.6));
      border-radius: inherit;
      opacity: 0;
      filter: blur(20px);
      transition: opacity 0.3s;
      z-index: -1;
    }

    .calendly-cta-button:hover {
      transform: translateY(-4px) scale(1.04);
      box-shadow: 0 0 60px rgb(var(--brand-rgb) / 0.65);
    }

    .calendly-cta-button:hover::before {
      opacity: 1;
      filter: blur(30px);
    }

    .ig-cta-button {
      position: relative;
      background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 60%, #fcb045 100%);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
      box-shadow: 0 0 40px rgba(253, 29, 29, 0.4);
    }

    .ig-cta-button::before {
      content: '';
      position: absolute;
      inset: -4px;
      background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
      border-radius: inherit;
      opacity: 0;
      filter: blur(20px);
      transition: opacity 0.3s;
      z-index: -1;
    }

    .ig-cta-button:hover {
      transform: translateY(-4px) scale(1.04);
      box-shadow: 0 0 60px rgba(253, 29, 29, 0.6);
    }

    .ig-cta-button:hover::before {
      opacity: 1;
      filter: blur(30px);
    }

    .text-hero {
      font-size: 4.5rem;
    }
  `]
})
export class CtaComponent {
  private readonly handsTouch = inject(HandsTouchService);

  onIgClick(event: MouseEvent): void {
    // Only intercept the user's primary, modifier-free click. Cmd/Ctrl/middle
    // clicks bypass us so power users can open in a new tab as expected.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      this.handsTouch.trigger();
      return;
    }

    if (this.handsTouch.touched()) {
      // Already played; let the link open normally.
      return;
    }

    event.preventDefault();
    this.handsTouch.trigger();
    const url = (event.currentTarget as HTMLAnchorElement).href;

    // Wait for the burst to play, then open IG.
    window.setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 1100);
  }
}
