import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-roi',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, TranslatePipe],
  template: `
    <section id="roi" class="relative py-16 md:py-32 overflow-hidden bg-dark-950">
      <!-- Background gradient -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-10 pointer-events-none"
        style="background: radial-gradient(circle, rgb(var(--brand-rgb) / 0.195) 0%, transparent 70%); filter: blur(120px)"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6">
        <!-- Section Title -->
        <h2
          appScrollReveal
          class="text-4xl md:text-5xl font-bold text-center text-text-primary mb-6 text-glow-green"
        >
          {{ 'roi.title' | translate }}
        </h2>
        <p
          appScrollReveal
          class="text-lg text-text-secondary text-center mb-10 md:mb-20 max-w-3xl mx-auto"
        >
          {{ 'roi.subtitle' | translate }}
        </p>

        <!-- ROI Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Card 1: Terraccotta VIP -->
          <a
            href="https://www.instagram.com/terraccottavip/"
            target="_blank"
            rel="noopener noreferrer"
            appScrollReveal
            class="roi-card group"
          >
            <div class="card-header">
              <div class="company-logo">
                <span class="company-text">Terraccotta<span class="text-neon-green"> VIP</span></span>
              </div>
            </div>

            <div class="automation-desc">
              <p class="process-title">{{ 'roi.terraccotta.processTitle' | translate }}</p>
              <p class="process-detail">{{ 'roi.terraccotta.processDetail' | translate }}</p>
            </div>

            <div class="metrics">
              <div class="metric">
                <div class="metric-value">+23%</div>
                <div class="metric-label">{{ 'roi.terraccotta.metric1Label' | translate }}</div>
              </div>
              <div class="divider"></div>
              <div class="metric">
                <div class="metric-value">100%</div>
                <div class="metric-label">{{ 'roi.terraccotta.metric2Label' | translate }}</div>
              </div>
            </div>

            <div class="savings-detail">
              <span class="detail-item">• {{ 'roi.terraccotta.detail1' | translate }}</span>
              <span class="detail-item">• {{ 'roi.terraccotta.detail2' | translate }}</span>
              <span class="detail-item">• {{ 'roi.terraccotta.detail3' | translate }}</span>
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
              <h3 class="company-name">{{ 'roi.victoria.name' | translate }}</h3>
            </div>

            <div class="automation-desc">
              <p class="process-title">{{ 'roi.victoria.processTitle' | translate }}</p>
              <p class="process-detail">{{ 'roi.victoria.processDetail' | translate }}</p>
            </div>

            <div class="metrics">
              <div class="metric">
                <div class="metric-value">800</div>
                <div class="metric-label">{{ 'roi.victoria.metric1Label' | translate }}</div>
              </div>
              <div class="divider"></div>
              <div class="metric">
                <div class="metric-value">$16,000</div>
                <div class="metric-label">{{ 'roi.victoria.metric2Label' | translate }}</div>
              </div>
            </div>

            <div class="savings-detail">
              <span class="detail-item">• {{ 'roi.victoria.detail1' | translate }}</span>
              <span class="detail-item">• {{ 'roi.victoria.detail2' | translate }}</span>
              <span class="detail-item">• {{ 'roi.victoria.detail3' | translate }}</span>
            </div>
          </a>

          <!-- Card 3: Viajes Premiere -->
          <a
            href="https://www.instagram.com/viajespremiereve/"
            target="_blank"
            rel="noopener noreferrer"
            appScrollReveal
            class="roi-card group"
          >
            <div class="card-header">
              <div class="company-logo">
                <span class="company-text">Viajes<span class="text-neon-green"> Premiere</span></span>
              </div>
            </div>

            <div class="automation-desc">
              <p class="process-title">{{ 'roi.premiere.processTitle' | translate }}</p>
              <p class="process-detail">{{ 'roi.premiere.processDetail' | translate }}</p>
            </div>

            <div class="metrics">
              <div class="metric">
                <div class="metric-value">+34%</div>
                <div class="metric-label">{{ 'roi.premiere.metric1Label' | translate }}</div>
              </div>
              <div class="divider"></div>
              <div class="metric">
                <div class="metric-value">75%</div>
                <div class="metric-label">{{ 'roi.premiere.metric2Label' | translate }}</div>
              </div>
            </div>

            <div class="savings-detail">
              <span class="detail-item">• {{ 'roi.premiere.detail1' | translate }}</span>
              <span class="detail-item">• {{ 'roi.premiere.detail2' | translate }}</span>
              <span class="detail-item">• {{ 'roi.premiere.detail3' | translate }}</span>
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
      border: 1px solid rgb(var(--brand-rgb) / 0.13);
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
      background: linear-gradient(90deg, rgb(var(--brand-rgb)), rgb(var(--accent-rgb)));
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .roi-card:hover {
      border-color: rgb(var(--brand-rgb) / 0.325);
      box-shadow: 0 0 40px rgb(var(--brand-rgb) / 0.13);
      transform: translateY(-8px);
    }

    .roi-card:hover::before {
      opacity: 1;
    }

    .roi-card.featured {
      border-color: rgb(var(--brand-rgb) / 0.26);
      box-shadow: 0 0 30px rgb(var(--brand-rgb) / 0.098);
    }

    .featured-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, rgb(var(--brand-rgb)), rgb(var(--accent-rgb)));
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
      filter: drop-shadow(0 0 10px rgb(var(--brand-rgb) / 0.325));
    }

    .company-name {
      font-size: 1.5rem;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 0 20px rgb(var(--brand-rgb) / 0.26);
    }

    .company-text {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #fff;
      text-shadow: 0 0 20px rgb(var(--brand-rgb) / 0.26);
      white-space: nowrap;
    }

    /* Automation Description */
    .automation-desc {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid rgb(var(--brand-rgb) / 0.065);
    }

    .process-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: rgb(var(--brand-rgb));
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
      background: rgb(var(--brand-rgb) / 0.033);
      border-radius: 1rem;
    }

    .metric {
      text-align: center;
    }

    .metric-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: rgb(var(--brand-rgb));
      text-shadow: 0 0 20px rgb(var(--brand-rgb) / 0.39);
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
      background: rgb(var(--brand-rgb) / 0.13);
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
      background: linear-gradient(135deg, rgb(var(--brand-rgb) / 0.065), rgb(var(--accent-rgb) / 0.065));
      backdrop-filter: blur(20px);
      border: 2px solid rgb(var(--brand-rgb) / 0.195);
      border-radius: 1.5rem;
      padding: 3rem 2rem;
      box-shadow: 0 0 60px rgb(var(--brand-rgb) / 0.13);
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
      color: rgb(var(--brand-rgb));
      text-shadow: 0 0 30px rgb(var(--brand-rgb) / 0.52);
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
      background: linear-gradient(to bottom, transparent, rgb(var(--brand-rgb) / 0.325), transparent);
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
        background: linear-gradient(to right, transparent, rgb(var(--brand-rgb) / 0.325), transparent);
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
