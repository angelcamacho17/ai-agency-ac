import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <section class="relative py-32 overflow-hidden bg-dark-950">
      <!-- Intense green gradient from center -->
      <div
        class="absolute inset-0 pointer-events-none"
        style="background: radial-gradient(ellipse at center, rgba(16, 185, 129, 0.15) 0%, transparent 60%)"
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
                style="filter: drop-shadow(0 0 40px rgba(16, 185, 129, 0.6))"
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
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .to-neon-teal {
      font-size: 6rem;
    }
  `]
})
export class StatsComponent implements OnInit {
  stats = [
    { target: 10, suffix: '+', label: 'Años' },
    { target: 50, suffix: '+', label: 'Proyectos' },
  ];

  currentValues = [
    signal(0),
    signal(0),
    signal(0),
    signal(0)
  ];

  ngOnInit() {
    // Start counter animations after a delay
    setTimeout(() => {
      this.stats.forEach((stat, index) => {
        this.animateCounter(index, stat.target);
      });
    }, 500);
  }

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
