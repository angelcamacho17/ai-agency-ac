import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="relative bg-dark-900 border-t border-neon-green/30">
      <div class="max-w-7xl mx-auto px-6 py-24">
        <!-- Main Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <!-- Logo & Tagline -->
          <div class="text-center md:text-left">
            <div class="text-2xl font-bold text-text-primary mb-2">
              michelangelo <span class="text-neon-green">devs</span>
            </div>
            <p class="text-text-tertiary text-sm">
              we write art,<br />
              not just code
            </p>
          </div>

          <!-- Legal Links -->
          <div class="text-center space-y-3">
            <a
              routerLink="/terms"
              class="block text-text-secondary hover:text-neon-green transition-all duration-300 relative group"
            >
              Términos y Condiciones
              <span
                class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-neon-green to-neon-teal group-hover:w-full transition-all duration-300"
                style="box-shadow: 0 0 10px rgba(16, 185, 129, 0.6)"
              ></span>
            </a>
            <a
              routerLink="/privacy"
              class="block text-text-secondary hover:text-neon-green transition-all duration-300 relative group"
            >
              Política de Privacidad
              <span
                class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-neon-green to-neon-teal group-hover:w-full transition-all duration-300"
                style="box-shadow: 0 0 10px rgba(16, 185, 129, 0.6)"
              ></span>
            </a>
          </div>

          <!-- Social Links -->
          <div class="text-center md:text-right space-y-3">
            <a
              *ngFor="let social of socialLinks"
              [href]="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="block text-text-secondary hover:text-neon-green transition-all duration-300 relative group"
            >
              {{ social.label }}
              <span
                class="absolute -bottom-1 right-0 w-0 h-0.5 bg-gradient-to-l from-neon-green to-neon-teal group-hover:w-full transition-all duration-300"
                style="box-shadow: 0 0 10px rgba(16, 185, 129, 0.6)"
              ></span>
            </a>
          </div>
        </div>

        <!-- Divider -->
        <div class="w-full h-px bg-neon-green/10 mb-12"></div>

        <!-- Copyright -->
        <div class="text-center text-text-tertiary text-sm">
          <p>© 2026 Michelangelo Devs</p>
          <!-- <p class="mt-2">Hecho con 🤍 en Venezuela</p> -->
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer a {
      position: relative;
    }

    footer a:hover {
      filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.6));
    }
  `]
})
export class FooterComponent {
  socialLinks = [
    { label: 'Instagram', url: 'https://instagram.com/michelangelo.devs' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/angelcamacho17/' }
  ];
}
