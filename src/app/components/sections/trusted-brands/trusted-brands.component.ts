import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trusted-brands',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative py-20 overflow-hidden bg-dark-900 border-y border-neon-green/10">
      <!-- Subtle green glow -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-neon-green/5 to-transparent pointer-events-none"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-center text-text-primary">
          Marcas que han
          <span class="text-neon-green">confiado</span>
          en nosotros
        </h2>
      </div>

      <!-- Infinite scroll container -->
      <div class="relative overflow-hidden">
        <!-- Gradient overlays for fade effect -->
        <div class="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-dark-900 to-transparent z-10 pointer-events-none"></div>
        <div class="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-dark-900 to-transparent z-10 pointer-events-none"></div>

        <!-- Scrolling brands strip -->
        <div class="brands-wrapper">
          <div class="brands-track">
            <!-- First set of brands -->
            <div class="brands-slide">
              <img
                *ngFor="let brand of brands"
                [src]="brand.logo"
                [alt]="brand.name"
                class="brand-logo h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                style="filter: brightness(0) invert(1);"
              />
            </div>
            <!-- Duplicate set for seamless loop -->
            <div class="brands-slide" aria-hidden="true">
              <img
                *ngFor="let brand of brands"
                [src]="brand.logo"
                [alt]="brand.name"
                class="brand-logo h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                style="filter: brightness(0) invert(1);"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .brands-wrapper {
      width: 100%;
      overflow: hidden;
    }

    .brands-track {
      display: flex;
      width: fit-content;
      animation: scroll 50s linear infinite;
    }

    .brands-slide {
      display: flex;
      align-items: center;
      gap: 3rem;
      padding: 0 1.5rem;
    }

    .brand-logo {
      flex-shrink: 0;
      min-width: 80px;
      max-width: 160px;
    }

    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    /* Pause animation on hover */
    .brands-wrapper:hover .brands-track {
      animation-play-state: paused;
    }

    @media (prefers-reduced-motion: reduce) {
      .brands-track {
        animation: none;
      }
    }
  `]
})
export class TrustedBrandsComponent {
  brands = [
    { name: 'Amplify', logo: 'brands/amplify_white_transparent.png' },
    { name: 'AR Studio', logo: 'brands/ar_studio_white_transparent.png' },
    { name: 'Axial', logo: 'brands/axial_white_transparent.png' },
    { name: 'Safaera', logo: 'brands/safaera_icon_white_transparent.png' },
    { name: 'Turismo de Playa', logo: 'brands/turismodeplaya_white_transparent.png' },
    { name: 'VIC', logo: 'brands/vic_white_transparent.png' },
    { name: 'Xup', logo: 'brands/xup_white_transparent.png' },
    { name: 'Amplify', logo: 'brands/amplify_white_transparent.png' },
    { name: 'AR Studio', logo: 'brands/ar_studio_white_transparent.png' },
    { name: 'Axial', logo: 'brands/axial_white_transparent.png' },
    { name: 'Safaera', logo: 'brands/safaera_icon_white_transparent.png' },
    { name: 'Turismo de Playa', logo: 'brands/turismodeplaya_white_transparent.png' },
    { name: 'VIC', logo: 'brands/vic_white_transparent.png' },
    { name: 'Xup', logo: 'brands/xup_white_transparent.png' }
  ];
}
