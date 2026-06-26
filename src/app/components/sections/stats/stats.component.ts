import { AfterViewInit, Component, ElementRef, OnDestroy, PLATFORM_ID, ViewChild, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <section class="relative py-32 overflow-hidden bg-dark-950" #sectionEl>
      <!-- Intense green gradient from center -->
      <div
        class="absolute inset-0 pointer-events-none"
        style="background: radial-gradient(ellipse at center, rgb(var(--brand-rgb) / 0.098) 0%, transparent 60%)"
      ></div>

      <!-- Dense particles background -->
      <div class="absolute inset-0 opacity-30 pointer-events-none"></div>

      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <div
          appScrollReveal
          class="stats-container glassmorphism-card rounded-3xl p-20 shadow-inner-glow"
        >
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <div
              *ngFor="let stat of stats; let i = index"
              class="stat-item text-center relative"
            >
              <!-- Divider (except first item) -->
              <div
                *ngIf="i !== 0"
                class="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-neon-green/50 to-transparent"
              ></div>

              <!-- Stat Number -->
              <div
                class="stat-number text-[120px] font-extrabold leading-none mb-4 bg-gradient-to-br from-neon-green to-neon-teal bg-clip-text text-transparent"
                style="filter: drop-shadow(0 0 40px rgb(var(--brand-rgb) / 0.39))"
              >
                {{ currentValues[i]() }}{{ stat.suffix }}
              </div>

              <!-- Stat Label -->
              <div class="stat-label text-xl text-text-secondary uppercase tracking-widest">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .stats-container {
      background: rgb(var(--brand-rgb) / 0.033);
      border: 1px solid rgb(var(--brand-rgb) / 0.195);
    }

    .to-neon-teal {
      font-size: 6rem;
    }
  `]
})
export class StatsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sectionEl', { static: true }) sectionEl!: ElementRef<HTMLElement>;

  stats = [
    { target: 10, suffix: '+', label: 'Años' },
    { target: 50, suffix: '+', label: 'Proyectos' },
  ];

  currentValues = [signal(0), signal(0), signal(0), signal(0)];

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      this.stats.forEach((s, i) => this.currentValues[i].set(s.target));
      return;
    }
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.stats.forEach((stat, i) => this.animateCounter(i, stat.target));
          this.observer?.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    this.observer.observe(this.sectionEl.nativeElement);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }

  private animateCounter(index: number, target: number, duration: number = 2000) {
    const start = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic easing
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.currentValues[index].set(Math.floor(start + (target - start) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}
