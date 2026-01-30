import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-roi',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <section id="roi" class="relative py-32 overflow-hidden bg-dark-950">
      <!-- Background gradient -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-10 pointer-events-none"
        style="background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%); filter: blur(120px)"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6">
        <!-- Section Title -->
        <h2
          appScrollReveal
          class="text-4xl md:text-5xl font-bold text-center text-text-primary mb-6 text-glow-green"
        >
          IMPACTO REAL
        </h2>
        <p
          appScrollReveal
          class="text-lg text-text-secondary text-center mb-20 max-w-3xl mx-auto"
        >
          Ahorro medible en tiempo y dinero para empresas que automatizan sus procesos
        </p>

        <!-- ROI Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Card 1: AR Studio -->
          <a
            href="https://studioar.es"
            target="_blank"
            rel="noopener noreferrer"
            appScrollReveal
            class="roi-card group"
          >
            <div class="card-header">
              <div class="company-logo ">
                <img src="brands/ar_studio_white_transparent.png" alt="AR Studio" class="logo-img big-logo" />
              </div>
            </div>

            <div class="automation-desc">
              <p class="process-title">Suite Completa de Automatización</p>
              <p class="process-detail">
                Agentes AI setter/closer, automatización de facturas y mensajes de pago por WhatsApp
              </p>
            </div>

            <div class="metrics">
              <div class="metric">
                <div class="metric-value">520</div>
                <div class="metric-label">horas/año ahorradas</div>
              </div>
              <div class="divider"></div>
              <div class="metric">
                <div class="metric-value">$7,800</div>
                <div class="metric-label">USD ahorrados/año</div>
              </div>
            </div>

            <div class="savings-detail">
              <span class="detail-item">• 2 agentes AI setter/closer 24/7</span>
              <span class="detail-item">• 100 facturas/mes automatizadas</span>
              <span class="detail-item">• Recordatorios de pago por WhatsApp</span>
              <span class="detail-item">• ROI recuperado en 3 meses</span>
            </div>
          </a>

          <!-- Card 2: Victoria -->
          <a
            href="https://socialmediaconvictoria.com"
            target="_blank"
            rel="noopener noreferrer"
            appScrollReveal
            class="roi-card group featured"
          >
            <!-- <div class="featured-badge">BEST ROI</div> -->
            <div class="card-header">
              <div class="company-logo">
                <img src="brands/vic_white_transparent.png" alt="Victoria" class="logo-img" />
              </div>
              <h3 class="company-name">Victoria Social Media</h3>
            </div>

            <div class="automation-desc">
              <p class="process-title">Agente AI para Instagram DMs</p>
              <p class="process-detail">
                Setter y closer automatizado que atiende leads 24/7
              </p>
            </div>

            <div class="metrics">
              <div class="metric">
                <div class="metric-value">800</div>
                <div class="metric-label">horas/año ahorradas</div>
              </div>
              <div class="divider"></div>
              <div class="metric">
                <div class="metric-value">$16,000</div>
                <div class="metric-label">USD ahorrados/año</div>
              </div>
            </div>

            <div class="savings-detail">
              <span class="detail-item">• 200 mensajes/semana gestionados</span>
              <span class="detail-item">• Respuesta instantánea vs 30 min manual</span>
              <span class="detail-item">• Tasa de conversión aumentó 40%</span>
            </div>
          </a>

          <!-- Card 3: Turismo de Playa -->
          <a
            href="https://turismodeplaya.com"
            target="_blank"
            rel="noopener noreferrer"
            appScrollReveal
            class="roi-card group"
          >
            <div class="card-header">
              <div class="company-logo">
                <img src="brands/turismodeplaya_white_transparent.png" alt="Turismo de Playa" class="logo-img" />
              </div>
            </div>

            <div class="automation-desc">
              <p class="process-title">Carga de Hoteles con AI + Rediseño</p>
              <p class="process-detail">
                Agente AI que automatiza carga de datos de hoteles y actualización completa del diseño
              </p>
            </div>

            <div class="metrics">
              <div class="metric">
                <div class="metric-value">300</div>
                <div class="metric-label">horas/año ahorradas</div>
              </div>
              <div class="divider"></div>
              <div class="metric">
                <div class="metric-value">$4,500</div>
                <div class="metric-label">USD ahorrados/año</div>
              </div>
            </div>

            <div class="savings-detail">
              <span class="detail-item">• 200 hoteles cargados automáticamente</span>
              <span class="detail-item">• 1.5h ahorradas por hotel vs carga manual</span>
              <span class="detail-item">• Nuevo diseño moderno implementado</span>
            </div>
          </a>
        </div>

        <!-- Total Impact Banner -->
        <!-- <div
          appScrollReveal
          class="total-impact-banner mt-16"
        >
          <div class="impact-stat">
            <span class="impact-number">$23,500</span>
            <span class="impact-label">Ahorro anual total</span>
          </div>
          <div class="impact-divider"></div>
          <div class="impact-stat">
            <span class="impact-number">1,300</span>
            <span class="impact-label">Horas recuperadas</span>
          </div>
          <div class="impact-divider"></div>
          <div class="impact-stat">
            <span class="impact-number">100%</span>
            <span class="impact-label">Satisfacción cliente</span>
          </div>
        </div> -->
      </div>
    </section>
  `,
  styles: [`

    /* ROI Cards */
    .roi-card {
      position: relative;
      display: block;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      transition: all 0.3s ease;
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }

    .roi-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #10b981, #14b8a6);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .roi-card:hover {
      border-color: rgba(16, 185, 129, 0.5);
      box-shadow: 0 0 40px rgba(16, 185, 129, 0.2);
      transform: translateY(-8px);
    }

    .roi-card:hover::before {
      opacity: 1;
    }

    .roi-card.featured {
      border-color: rgba(16, 185, 129, 0.4);
      box-shadow: 0 0 30px rgba(16, 185, 129, 0.15);
    }

    .featured-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #10b981, #14b8a6);
      color: #000;
      font-size: 0.7rem;
      font-weight: bold;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }

    /* Card Header */
    .card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .company-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 180px;
      height: 80px;
    }

    .logo-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.5));
    }

    .company-name {
      font-size: 1.5rem;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
    }

    /* Automation Description */
    .automation-desc {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid rgba(16, 185, 129, 0.1);
    }

    .process-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #10b981;
      margin-bottom: 0.5rem;
    }

    .process-detail {
      font-size: 0.875rem;
      color: #9ca3af;
      line-height: 1.5;
    }

    /* Metrics */
    .metrics {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1.5rem 0;
      background: rgba(16, 185, 129, 0.05);
      border-radius: 1rem;
    }

    .metric {
      text-align: center;
    }

    .metric-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: #10b981;
      text-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
      line-height: 1;
    }

    .metric-label {
      font-size: 0.75rem;
      color: #9ca3af;
      margin-top: 0.5rem;
    }

    .divider {
      width: 1px;
      height: 60px;
      background: rgba(16, 185, 129, 0.2);
    }

    /* Savings Detail */
    .savings-detail {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-item {
      font-size: 0.875rem;
      color: #d1d5db;
      line-height: 1.5;
    }

    /* Total Impact Banner */
    .total-impact-banner {
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.1));
      backdrop-filter: blur(20px);
      border: 2px solid rgba(16, 185, 129, 0.3);
      border-radius: 1.5rem;
      padding: 3rem 2rem;
      box-shadow: 0 0 60px rgba(16, 185, 129, 0.2);
    }

    .impact-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .impact-number {
      font-size: 3rem;
      font-weight: bold;
      color: #10b981;
      text-shadow: 0 0 30px rgba(16, 185, 129, 0.8);
      line-height: 1;
    }

    .impact-label {
      font-size: 0.875rem;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .impact-divider {
      width: 2px;
      height: 80px;
      background: linear-gradient(to bottom, transparent, rgba(16, 185, 129, 0.5), transparent);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .total-impact-banner {
        flex-direction: column;
        gap: 2rem;
        padding: 2rem 1rem;
      }

      .impact-divider {
        width: 100%;
        height: 2px;
        background: linear-gradient(to right, transparent, rgba(16, 185, 129, 0.5), transparent);
      }

      .metrics {
        flex-direction: column;
        gap: 1.5rem;
      }

      .divider {
        width: 100%;
        height: 1px;
      }
    }
  `]
})
export class RoiComponent { }
