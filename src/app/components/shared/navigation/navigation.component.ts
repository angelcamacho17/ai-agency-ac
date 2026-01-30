import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MagneticButtonDirective } from '../../../directives/magnetic-button.directive';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, MagneticButtonDirective],
  template: `
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class.glassmorphism]="isScrolled()"
      [class.shadow-lg]="isScrolled()"
      [class.bg-transparent]="!isScrolled()"
    >
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <a href="#home" class="flex items-center gap-3 group">
            <img
              src="logo_white.png"
              alt="Michelangelo Devs Logo"
              class="h-20 w-20 object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <div class="text-2xl font-bold text-text-primary tracking-tight">
              michelangelo <span class="text-neon-green">devs</span>
            </div>
          </a>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center gap-8">
            <a
              *ngFor="let item of menuItems"
              [href]="item.href"
              class="text-text-secondary hover:text-neon-green transition-all duration-300 relative group"
            >
              {{ item.label }}
              <span
                class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-green to-neon-teal group-hover:w-full transition-all duration-300"
                style="box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);"
              ></span>
            </a>

            <a
              href="https://calendly.com/angelcamacho-developer/30min"
              target="_blank"
              rel="noopener noreferrer"
              appMagneticButton
              class="px-6 py-2 bg-gradient-to-r from-neon-green to-neon-teal text-dark-950 font-bold rounded-lg transition-all duration-300 hover:shadow-glow-green-lg"
            >
              Iniciar Proyecto
            </a>
          </div>

          <!-- Mobile Menu Button -->
          <button
            (click)="toggleMobileMenu()"
            class="md:hidden text-text-primary focus:outline-none"
            [attr.aria-label]="mobileMenuOpen() ? 'Close menu' : 'Open menu'"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                *ngIf="!mobileMenuOpen()"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                *ngIf="mobileMenuOpen()"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div
          *ngIf="mobileMenuOpen()"
          class="md:hidden mt-4 py-4 glassmorphism-card rounded-lg"
        >
          <a
            *ngFor="let item of menuItems"
            [href]="item.href"
            (click)="toggleMobileMenu()"
            class="block px-4 py-3 text-text-secondary hover:text-neon-green hover:bg-white/5 transition-all duration-300"
          >
            {{ item.label }}
          </a>
          <div class="px-4 pt-3">
            <a
              href="https://calendly.com/angelcamacho-developer/30min"
              target="_blank"
              rel="noopener noreferrer"
              (click)="toggleMobileMenu()"
              class="block w-full px-6 py-3 bg-gradient-to-r from-neon-green to-neon-teal text-dark-950 font-bold rounded-lg transition-all duration-300 text-center"
            >
              Iniciar Proyecto
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NavigationComponent {
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);

  menuItems = [
    { label: 'Inicio', href: '#home' },
    { label: 'Trabajo', href: '#work' },
    { label: 'Proceso', href: '#process' },
    { label: 'Contacto', href: '#contact' }
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.pageYOffset > 50);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(open => !open);
  }
}
