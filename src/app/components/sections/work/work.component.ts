import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <section id="work" class="relative py-32 overflow-hidden bg-dark-950">
      <!-- Background gradient -->
      <div
        class="absolute top-0 right-0 w-[1000px] h-[1000px] rounded-full opacity-20 pointer-events-none"
        style="background: radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, transparent 50%); filter: blur(100px)"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6">
        <!-- Section Title -->
        <h2
          appScrollReveal
          class="text-4xl md:text-5xl font-bold text-center text-text-primary mb-6 text-glow-green"
        >
          QUÉ CONSTRUIMOS
        </h2>
        <p
          appScrollReveal
          class="text-lg text-text-secondary text-center mb-20 max-w-3xl mx-auto"
        >
          Soluciones de automatización e inteligencia artificial que transforman tu operación
        </p>

        <!-- Services Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

          <!-- Card 1: Agentes AI -->
          <div appScrollReveal class="service-card group">
            <div class="card-icon">🤖</div>
            <h3 class="card-title">
              Agentes <span class="text-neon-green">AI</span>
            </h3>
            <p class="card-description">
              Asistentes inteligentes que automatizan tareas complejas usando Claude, GPT y modelos especializados
            </p>

            <div class="card-features">
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Atención al cliente 24/7</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Cualificación de leads automática</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Análisis de datos en tiempo real</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Integración con CRM y APIs</span>
              </div>
            </div>

            <div class="card-tech">
              <span class="tech-badge">Claude</span>
              <span class="tech-badge">n8n</span>
              <span class="tech-badge">OpenAI</span>
            </div>
          </div>

          <!-- Card 2: Automatizaciones -->
          <div appScrollReveal class="service-card group">
            <div class="card-icon">⚡</div>
            <h3 class="card-title">
              Automatizaciones <span class="text-neon-green">Operativas</span>
            </h3>
            <p class="card-description">
              Workflows inteligentes que conectan tus herramientas y eliminan trabajo manual repetitivo
            </p>

            <div class="card-features">
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Sincronización entre plataformas</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Notificaciones y alertas smart</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Generación de reportes automáticos</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Procesamiento de pagos y facturas</span>
              </div>
            </div>

            <div class="card-tech">
              <span class="tech-badge">n8n</span>
              <span class="tech-badge">Make</span>
              <span class="tech-badge">Zapier</span>
            </div>
          </div>

          <!-- Card 3: Aplicaciones Web -->
          <div appScrollReveal class="service-card group">
            <div class="card-icon">💻</div>
            <h3 class="card-title">
              Aplicaciones <span class="text-neon-green">Web</span>
            </h3>
            <p class="card-description">
              Interfaces modernas y escalables con las últimas tecnologías frontend y backend
            </p>

            <div class="card-features">
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>SaaS y plataformas empresariales</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Dashboards y paneles admin</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>E-commerce y marketplaces</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>APIs RESTful y GraphQL</span>
              </div>
            </div>

            <div class="card-tech">
              <span class="tech-badge">React</span>
              <span class="tech-badge">Angular</span>
              <span class="tech-badge">Node.js</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Service Cards */
    .service-card {
      position: relative;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 1.5rem;
      padding: 2.5rem;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      min-height: 550px;
    }

    .service-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #10b981, #14b8a6);
      border-radius: 1.5rem 1.5rem 0 0;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .service-card:hover {
      border-color: rgba(16, 185, 129, 0.5);
      box-shadow: 0 0 40px rgba(16, 185, 129, 0.2);
      transform: translateY(-8px);
    }

    .service-card:hover::before {
      opacity: 1;
    }

    /* Card Icon */
    .card-icon {
      font-size: 4rem;
      text-align: center;
      filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.6));
    }

    /* Card Title */
    .card-title {
      font-size: 1.75rem;
      font-weight: bold;
      color: #FFFFFF;
      text-align: center;
      text-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
    }

    /* Card Description */
    .card-description {
      font-size: 0.95rem;
      color: #9ca3af;
      text-align: center;
      line-height: 1.6;
      min-height: 60px;
    }

    /* Features List */
    .card-features {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      flex: 1;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.9rem;
      color: #d1d5db;
      line-height: 1.5;
    }

    .feature-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
      font-size: 0.75rem;
      font-weight: bold;
      flex-shrink: 0;
      margin-top: 2px;
    }

    /* Tech Badges */
    .card-tech {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      padding-top: 1rem;
      border-top: 1px solid rgba(16, 185, 129, 0.1);
    }

    .tech-badge {
      font-size: 0.75rem;
      font-weight: 600;
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
      padding: 0.375rem 0.875rem;
      border-radius: 1rem;
      border: 1px solid rgba(16, 185, 129, 0.3);
      transition: all 0.2s ease;
    }

    .tech-badge:hover {
      background: rgba(16, 185, 129, 0.2);
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .service-card {
        padding: 2rem;
        min-height: auto;
      }

      .card-icon {
        font-size: 3rem;
      }

      .card-title {
        font-size: 1.5rem;
      }

      .card-description {
        font-size: 0.875rem;
        min-height: auto;
      }
    }
  `]
})
export class WorkComponent {}
