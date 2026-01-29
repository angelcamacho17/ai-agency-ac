import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';
import { ProjectDemoModalComponent, DemoProject } from '../../shared/project-demo-modal/project-demo-modal.component';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, ProjectDemoModalComponent],
  template: `
    <section id="work" class="relative py-32 overflow-hidden bg-dark-950">
      <!-- Orange nebula gradient -->
      <div
        class="absolute top-0 right-0 w-[1000px] h-[1000px] rounded-full opacity-20 pointer-events-none"
        style="background: radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, transparent 50%); filter: blur(100px)"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6">
        <!-- Section Title -->
        <h2
          appScrollReveal
          class="text-section font-bold text-text-primary mb-20 text-glow-green"
        >
          QUÉ CONSTRUIMOS
        </h2>

        <!-- Bento Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Item 1 - Large -->
          <div
            appScrollReveal
            class="work-item lg:col-span-1 glassmorphism-card border border-neon-green/20 rounded-[2rem] p-16 relative overflow-hidden group hover:border-neon-green/40 transition-all duration-500"
          >
            <div class="relative z-10">
              <h3 class="text-4xl font-bold text-text-primary mb-6">
                AGENTES DE IA<br />
                <span class="text-neon-green">que funcionan</span>
              </h3>
              <p class="text-text-tertiary leading-relaxed mb-8">
                No demos. No prototipos. Arquitectura de producción que genera resultados
                medibles desde el día uno. Instagram, WhatsApp, Web. Trabajando 24/7 mientras
                tú duermes.
              </p>
              <button
                (click)="openDemo('ai', 'Agentes de IA', 'Soluciones inteligentes que automatizan conversaciones y procesos')"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-neon-green to-neon-teal text-dark-950 font-bold rounded-lg transition-all duration-300 hover:shadow-glow-green-lg hover:scale-105"
              >
                Ver Demo Interactivo
              </button>
            </div>
            <div class="work-item-glow"></div>
          </div>

          <!-- Item 2 - Mobile Apps -->
          <div
            appScrollReveal
            class="work-item glassmorphism-card border border-neon-green/10 rounded-[2rem] p-12 flex flex-col items-center justify-center min-h-[300px] hover:border-neon-green/30 transition-all duration-500 cursor-pointer group"
            (click)="openDemo('mobile', 'Apps Móviles', 'Experiencias móviles nativas premium para iOS y Android')"
          >
            <div class="text-center">
              <div
                class="w-24 h-24 mx-auto mb-6 text-neon-green group-hover:scale-110 transition-transform duration-300"
                style="filter: drop-shadow(0 0 30px rgba(16, 185, 129, 0.6))"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <p class="text-text-secondary text-lg mb-4 group-hover:text-neon-green transition-colors">Apps Móviles</p>
              <span class="text-sm text-neon-green opacity-0 group-hover:opacity-100 transition-opacity">Click para ver demo</span>
            </div>
            <div class="work-item-glow"></div>
          </div>

          <!-- Item 3 - Web Apps -->
          <div
            appScrollReveal
            class="work-item glassmorphism-card border border-neon-teal/20 rounded-[2rem] p-12 flex flex-col items-center justify-center min-h-[300px] hover:border-neon-teal/40 transition-all duration-500 cursor-pointer group"
            (click)="openDemo('web', 'Aplicaciones Web', 'Plataformas web escalables y de alto rendimiento')"
          >
            <div class="text-center">
              <div
                class="w-24 h-24 mx-auto mb-6 text-neon-teal group-hover:scale-110 transition-transform duration-300"
                style="filter: drop-shadow(0 0 30px rgba(20, 184, 166, 0.6))"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <p class="text-text-secondary text-lg mb-4 group-hover:text-neon-teal transition-colors">Aplicaciones Web</p>
              <span class="text-sm text-neon-teal opacity-0 group-hover:opacity-100 transition-opacity">Click para ver demo</span>
            </div>
            <div class="work-item-glow"></div>
          </div>

          <!-- Item 4 - Large -->
          <div
            appScrollReveal
            class="work-item lg:col-span-1 glassmorphism-card border border-neon-green/20 rounded-[2rem] p-16 relative overflow-hidden group hover:border-neon-green/40 transition-all duration-500"
          >
            <div class="relative z-10">
              <h3 class="text-4xl font-bold text-text-primary mb-6">
                AUTOMATIZACIÓN<br />
                <span class="text-neon-teal">que piensa</span>
              </h3>
              <p class="text-text-tertiary leading-relaxed mb-8">
                Setter y closer en uno. Califica leads automáticamente y vende productos
                digitales sin intervención humana. Tu Instagram genera ingresos en piloto
                automático.
              </p>
              <button
                (click)="openDemo('ecommerce', 'E-commerce & Automatización', 'Plataformas de comercio electrónico con automatización inteligente')"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-neon-teal to-blue-500 text-dark-950 font-bold rounded-lg transition-all duration-300 hover:shadow-glow-teal-lg hover:scale-105"
              >
                Ver Demo Interactivo
              </button>
            </div>
            <div class="work-item-glow"></div>
          </div>

          <!-- Item 5 - Full width -->
          <div
            appScrollReveal
            class="work-item lg:col-span-2 glassmorphism-card border border-neon-green/20 rounded-[2rem] p-16 relative overflow-hidden group hover:border-neon-green/40 transition-all duration-500"
          >
            <div class="relative z-10 text-center max-w-4xl mx-auto">
              <h3 class="text-5xl font-bold text-text-primary mb-6">
                RESULTADOS<br />
                <span class="text-neon-green">no promesas</span>
              </h3>
              <p class="text-text-tertiary text-xl leading-relaxed mb-8">
                ROI promedio de 800%. Cada dólar invertido genera 8. No es magia, son
                matemáticas. Implementación en 4 semanas, resultados desde el mes 1.
              </p>
              <button
                (click)="openDemo('api', 'APIs & Integraciones', 'Arquitectura de APIs robusta y escalable')"
                class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-neon-green to-neon-teal text-dark-950 font-bold rounded-xl transition-all duration-300 hover:shadow-glow-green-lg hover:scale-105 text-lg"
              >
                Ver Demo de APIs
              </button>
            </div>
            <div class="work-item-glow"></div>
          </div>
        </div>
      </div>

      <!-- Demo Modal -->
      <app-project-demo-modal
        [project]="selectedProject()"
        [isOpen]="isModalOpen()"
        (close)="closeModal()"
      ></app-project-demo-modal>
    </section>
  `,
  styles: [`
    .work-item {
      position: relative;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .work-item-glow {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.5), rgba(20, 184, 166, 0.5));
      border-radius: inherit;
      opacity: 0;
      filter: blur(20px);
      transition: all 0.5s;
      z-index: 0;
      pointer-events: none;
    }

    .work-item:hover {
      transform: scale(1.02);
    }

    .work-item:hover .work-item-glow {
      opacity: 1;
      filter: blur(30px);
    }
  `]
})
export class WorkComponent {
  isModalOpen = signal(false);
  selectedProject = signal<DemoProject | null>(null);

  openDemo(type: string, title: string, description: string) {
    this.selectedProject.set({ type, title, description });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    setTimeout(() => {
      this.selectedProject.set(null);
    }, 300);
  }
}
