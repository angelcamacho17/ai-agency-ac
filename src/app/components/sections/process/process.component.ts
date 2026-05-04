import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

interface Step {
  number: string;
  dayKey: string;
  titleKey: string;
  descriptionKey: string;
  icon: 'handshake' | 'gear' | 'flask' | 'rocket';
}

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section
      id="process"
      class="relative py-32 overflow-hidden bg-dark-900"
      #section
    >
      <!-- Accent nebula gradient -->
      <div
        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-20 pointer-events-none"
        style="background: radial-gradient(circle, rgb(var(--accent-rgb) / 0.13) 0%, transparent 50%); filter: blur(120px)"
      ></div>

      <!-- Dot grid -->
      <div
        class="absolute inset-0 opacity-10 pointer-events-none"
        style="background-image: radial-gradient(circle, rgb(var(--brand-rgb) / 0.195) 1px, transparent 1px); background-size: 50px 50px; mask-image: radial-gradient(ellipse at center, black, transparent 80%);"
      ></div>

      <div class="relative z-10 max-w-6xl mx-auto px-6" [class.is-visible]="visible()">
        <!-- Eyebrow badge: speed claim -->
        <div class="flex justify-center mb-6">
          <span class="speed-badge">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5">
              <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>
            </svg>
            {{ 'process.titleAccent' | translate | uppercase }}
          </span>
        </div>

        <!-- Section Title -->
        <h2 class="text-3xl md:text-4xl font-bold text-text-primary text-center mb-20 leading-tight">
          {{ 'process.titleStart' | translate }}
          <span class="font-serif italic text-neon-green text-glow-green">{{ 'process.titleAccent' | translate }}</span>
        </h2>

        <!-- Timeline -->
        <div class="timeline">
          <div class="timeline-rail" aria-hidden="true">
            <div class="timeline-rail-fill"></div>
          </div>

          <div class="timeline-steps">
            <div
              *ngFor="let step of processSteps; let i = index"
              class="timeline-step"
              [style.--delay]="(i * 150) + 'ms'"
            >
              <div class="step-day">{{ step.dayKey | translate }}</div>

              <div class="step-node">
                <span class="step-icon" aria-hidden="true">
                  <ng-container [ngSwitch]="step.icon">
                    <svg *ngSwitchCase="'handshake'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 17l-3 3-4-4 6-6 3 3"/>
                      <path d="M14 7l3-3 4 4-6 6-3-3"/>
                      <path d="M9 11l4 4"/>
                    </svg>
                    <svg *ngSwitchCase="'gear'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    <svg *ngSwitchCase="'flask'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 3h6"/>
                      <path d="M10 3v7l-5 9a2 2 0 0 0 1.7 3h10.6A2 2 0 0 0 19 19l-5-9V3"/>
                      <path d="M7 15h10"/>
                    </svg>
                    <svg *ngSwitchCase="'rocket'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                    </svg>
                  </ng-container>
                </span>
                <span class="step-number">{{ step.number }}</span>
              </div>

              <div class="step-content">
                <h3 class="step-title">{{ step.titleKey | translate }}</h3>
                <p class="step-description">{{ step.descriptionKey | translate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Speed badge */
    .speed-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      color: rgb(var(--brand-rgb));
      background: rgb(var(--brand-rgb) / 0.08);
      border: 1px solid rgb(var(--brand-rgb) / 0.3);
      text-shadow: 0 0 12px rgb(var(--brand-rgb) / 0.5);
      box-shadow: 0 0 30px rgb(var(--brand-rgb) / 0.15);
    }

    .speed-badge svg {
      filter: drop-shadow(0 0 6px rgb(var(--brand-rgb) / 0.6));
    }

    /* Timeline container */
    .timeline {
      position: relative;
    }

    /* The shared rail behind the nodes — horizontal on md+, vertical on mobile */
    .timeline-rail {
      position: absolute;
      pointer-events: none;
    }

    .timeline-rail-fill {
      position: absolute;
      background: linear-gradient(90deg, transparent, rgb(var(--brand-rgb)), rgb(var(--accent-rgb)), transparent);
      box-shadow: 0 0 20px rgb(var(--brand-rgb) / 0.45);
      border-radius: 999px;
      transform-origin: left center;
    }

    /* Steps wrapper */
    .timeline-steps {
      display: grid;
      gap: 3rem 1.5rem;
      grid-template-columns: 1fr;
    }

    .timeline-step {
      position: relative;
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: start;
      gap: 1.25rem;
      opacity: 0;
      transform: translateY(20px);
    }

    /* Stagger entry — uses --delay set inline per step */
    .is-visible .timeline-step {
      animation: step-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      animation-delay: var(--delay, 0ms);
    }

    @keyframes step-in {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Day caption */
    .step-day {
      grid-column: 2 / 3;
      grid-row: 1;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgb(var(--brand-rgb) / 0.85);
      margin-bottom: 0.4rem;
    }

    /* Node = circle with icon and number badge */
    .step-node {
      grid-column: 1 / 2;
      grid-row: 1 / 4;
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(20, 20, 20, 0.85);
      border: 2px solid rgb(var(--brand-rgb) / 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgb(var(--brand-rgb));
      box-shadow: 0 0 30px rgb(var(--brand-rgb) / 0.25);
      backdrop-filter: blur(8px);
      transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
      flex-shrink: 0;
    }

    .timeline-step:hover .step-node {
      transform: scale(1.06);
      border-color: rgb(var(--brand-rgb));
      box-shadow: 0 0 50px rgb(var(--brand-rgb) / 0.55);
    }

    .step-icon {
      width: 28px;
      height: 28px;
      display: block;
    }

    .step-icon svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 6px rgb(var(--brand-rgb) / 0.65));
    }

    .step-number {
      position: absolute;
      bottom: -6px;
      right: -6px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: rgb(var(--brand-rgb));
      color: #0a0a0a;
      font-size: 0.7rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    }

    /* Step content (title + description) */
    .step-content {
      grid-column: 2 / 3;
      grid-row: 2 / 3;
    }

    .step-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.4rem;
      line-height: 1.25;
    }

    .step-description {
      font-size: 0.875rem;
      color: rgba(229, 231, 235, 0.65);
      line-height: 1.55;
    }

    /* Mobile vertical rail — sits behind the column of nodes */
    @media (max-width: 767px) {
      .timeline-rail {
        top: 32px;
        bottom: 32px;
        left: 31px;
        width: 2px;
      }

      .timeline-rail-fill {
        left: 0;
        right: 0;
        top: 0;
        height: 0;
        background: linear-gradient(180deg, transparent, rgb(var(--brand-rgb)), rgb(var(--accent-rgb)), transparent);
        transition: height 1.4s cubic-bezier(0.22, 1, 0.36, 1);
        transition-delay: 0.2s;
      }

      .is-visible .timeline-rail-fill {
        height: 100%;
      }
    }

    /* Desktop: horizontal timeline */
    @media (min-width: 768px) {
      .timeline-steps {
        grid-template-columns: repeat(4, 1fr);
        gap: 0;
      }

      .timeline-step {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        text-align: center;
        padding: 0 1rem;
        gap: 0;
      }

      .step-day {
        grid-column: 1;
        grid-row: 1;
        margin-bottom: 0.75rem;
      }

      .step-node {
        grid-column: 1;
        grid-row: 2;
        margin: 0 auto 1.5rem auto;
        width: 72px;
        height: 72px;
      }

      .step-icon {
        width: 30px;
        height: 30px;
      }

      .step-content {
        grid-column: 1;
        grid-row: 3;
      }

      .step-title {
        font-size: 1.25rem;
      }

      /* Horizontal rail behind the nodes */
      .timeline-rail {
        top: 64px;        /* position over node centers (with day caption above) */
        left: 12.5%;      /* span between center of step 1 and step 4 */
        right: 12.5%;
        height: 2px;
      }

      .timeline-rail::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 999px;
      }

      .timeline-rail-fill {
        top: 0;
        left: 0;
        right: auto;
        height: 100%;
        width: 0;
        transition: width 1.6s cubic-bezier(0.22, 1, 0.36, 1);
        transition-delay: 0.2s;
      }

      .is-visible .timeline-rail-fill {
        width: 100%;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .timeline-step,
      .timeline-rail-fill {
        animation: none !important;
        transition: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
      .is-visible .timeline-rail-fill { width: 100%; height: 100%; }
    }
  `]
})
export class ProcessComponent implements AfterViewInit, OnDestroy {
  @ViewChild('section', { static: true }) sectionRef!: ElementRef<HTMLElement>;

  readonly visible = signal(false);
  private observer?: IntersectionObserver;

  readonly processSteps: Step[] = [
    {
      number: '01',
      dayKey: 'process.step1.day',
      titleKey: 'process.step1.title',
      descriptionKey: 'process.step1.description',
      icon: 'handshake'
    },
    {
      number: '02',
      dayKey: 'process.step2.day',
      titleKey: 'process.step2.title',
      descriptionKey: 'process.step2.description',
      icon: 'gear'
    },
    {
      number: '03',
      dayKey: 'process.step3.day',
      titleKey: 'process.step3.title',
      descriptionKey: 'process.step3.description',
      icon: 'flask'
    },
    {
      number: '04',
      dayKey: 'process.step4.day',
      titleKey: 'process.step4.title',
      descriptionKey: 'process.step4.description',
      icon: 'rocket'
    }
  ];

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      this.visible.set(true);
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.ngZone.run(() => this.visible.set(true));
            this.observer?.disconnect();
            break;
          }
        }
      }, { threshold: 0.25 });

      this.observer.observe(this.sectionRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
