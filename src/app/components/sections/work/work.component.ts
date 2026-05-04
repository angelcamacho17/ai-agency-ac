import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, TranslatePipe],
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
          {{ 'work.title' | translate }}
        </h2>
        <p
          appScrollReveal
          class="text-lg text-text-secondary text-center mb-20 max-w-3xl mx-auto"
        >
          {{ 'work.subtitle' | translate }}
        </p>

        <!-- Services Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

          <!-- Card 1: AI Agents -->
          <div appScrollReveal class="service-card group">
            <div class="card-icon">🤖</div>
            <h3 class="card-title">
              {{ 'work.agents.titleStart' | translate }}
              <span class="text-neon-green">{{ 'work.agents.titleAccent' | translate }}</span>
            </h3>
            <p class="card-description">{{ 'work.agents.description' | translate }}</p>

            <div class="card-features">
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>{{ 'work.agents.feature1' | translate }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>{{ 'work.agents.feature2' | translate }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>{{ 'work.agents.feature3' | translate }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>{{ 'work.agents.feature4' | translate }}</span>
              </div>
            </div>

            <div class="card-tech">
              <span class="tech-badge">Claude</span>
              <span class="tech-badge">n8n</span>
              <span class="tech-badge">OpenAI</span>
            </div>
          </div>

          <!-- Card 2: Automations -->
          <div appScrollReveal class="service-card group">
            <div class="card-icon">⚡</div>
            <h3 class="card-title">
              {{ 'work.automations.titleStart' | translate }}
              <span class="text-neon-green">{{ 'work.automations.titleAccent' | translate }}</span>
            </h3>
            <p class="card-description">{{ 'work.automations.description' | translate }}</p>

            <div class="card-features">
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>{{ 'work.automations.feature1' | translate }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>{{ 'work.automations.feature2' | translate }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>{{ 'work.automations.feature3' | translate }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>{{ 'work.automations.feature4' | translate }}</span>
              </div>
            </div>

            <div class="card-tech">
              <span class="tech-badge">n8n</span>
              <span class="tech-badge">Make</span>
              <span class="tech-badge">Zapier</span>
            </div>
          </div>

          <!-- Card 3: Web Applications -->
          <div appScrollReveal class="service-card group">
            <div class="card-icon">💻</div>
            <h3 class="card-title">
              {{ 'work.webapps.titleStart' | translate }}
              <span class="text-neon-green">{{ 'work.webapps.titleAccent' | translate }}</span>
            </h3>
            <p class="card-description">{{ 'work.webapps.description' | translate }}</p>

            <div class="card-features">
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>{{ 'work.webapps.feature1' | translate }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>{{ 'work.webapps.feature2' | translate }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>{{ 'work.webapps.feature3' | translate }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>{{ 'work.webapps.feature4' | translate }}</span>
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
      border: 1px solid rgb(var(--brand-rgb) / 0.13);
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
      background: linear-gradient(90deg, rgb(var(--brand-rgb)), rgb(var(--accent-rgb)));
      border-radius: 1.5rem 1.5rem 0 0;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .service-card:hover {
      border-color: rgb(var(--brand-rgb) / 0.325);
      box-shadow: 0 0 40px rgb(var(--brand-rgb) / 0.13);
      transform: translateY(-8px);
    }

    .service-card:hover::before {
      opacity: 1;
    }

    /* Card Icon */
    .card-icon {
      font-size: 4rem;
      text-align: center;
      filter: drop-shadow(0 0 20px rgb(var(--brand-rgb) / 0.39));
    }

    /* Card Title */
    .card-title {
      font-size: 1.75rem;
      font-weight: bold;
      color: #FFFFFF;
      text-align: center;
      text-shadow: 0 0 20px rgb(var(--brand-rgb) / 0.26);
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
      background: rgb(var(--brand-rgb) / 0.13);
      color: rgb(var(--brand-rgb));
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
      border-top: 1px solid rgb(var(--brand-rgb) / 0.065);
    }

    .tech-badge {
      font-size: 0.75rem;
      font-weight: 600;
      color: rgb(var(--brand-rgb));
      background: rgb(var(--brand-rgb) / 0.065);
      padding: 0.375rem 0.875rem;
      border-radius: 1rem;
      border: 1px solid rgb(var(--brand-rgb) / 0.195);
      transition: all 0.2s ease;
    }

    .tech-badge:hover {
      background: rgb(var(--brand-rgb) / 0.13);
      box-shadow: 0 0 15px rgb(var(--brand-rgb) / 0.195);
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
