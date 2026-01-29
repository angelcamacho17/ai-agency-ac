import { Component, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nebula-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="nebula-container absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <!-- Main green nebula -->
      <div
        class="nebula nebula-1 absolute w-[800px] h-[800px] rounded-full animate-float"
        [style.transform]="nebula1Transform()"
        [style.top]="'20%'"
        [style.left]="'-10%'"
      ></div>

      <!-- Orange nebula -->
      <div
        class="nebula nebula-2 absolute w-[600px] h-[600px] rounded-full animate-float-reverse"
        [style.transform]="nebula2Transform()"
        [style.top]="'-10%'"
        [style.right]="'-5%'"
      ></div>

      <!-- Teal nebula -->
      <div
        class="nebula nebula-3 absolute w-[700px] h-[700px] rounded-full animate-float"
        [style.transform]="nebula3Transform()"
        [style.bottom]="'10%'"
        [style.left]="'30%'"
      ></div>

      <!-- Noise texture overlay -->
      <div class="grain absolute inset-0 opacity-[0.03] mix-blend-overlay"></div>
    </div>
  `,
  styles: [`
    .nebula-1 {
      background: radial-gradient(
        circle,
        rgba(16, 185, 129, 0.25) 0%,
        rgba(20, 184, 166, 0.15) 30%,
        transparent 70%
      );
      filter: blur(120px);
    }

    .nebula-2 {
      background: radial-gradient(
        circle,
        rgba(251, 146, 60, 0.18) 0%,
        rgba(245, 158, 11, 0.10) 40%,
        transparent 70%
      );
      filter: blur(100px);
    }

    .nebula-3 {
      background: radial-gradient(
        circle,
        rgba(20, 184, 166, 0.20) 0%,
        rgba(16, 185, 129, 0.12) 40%,
        transparent 70%
      );
      filter: blur(110px);
    }

    .grain {
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    @media (prefers-reduced-motion: reduce) {
      .nebula {
        animation: none !important;
      }
    }
  `]
})
export class NebulaBackgroundComponent {
  private scrollY = signal(0);
  private time = signal(0);

  nebula1Transform = computed(() => {
    const parallax = this.scrollY() * 0.3;
    const float = Math.sin(this.time() * 0.0005) * 50;
    return `translateY(${parallax + float}px)`;
  });

  nebula2Transform = computed(() => {
    const parallax = this.scrollY() * 0.2;
    const float = Math.cos(this.time() * 0.0004) * 40;
    return `translateY(${parallax + float}px)`;
  });

  nebula3Transform = computed(() => {
    const parallax = this.scrollY() * 0.25;
    const float = Math.sin(this.time() * 0.0006) * 60;
    return `translateY(${parallax + float}px)`;
  });

  @HostListener('window:scroll')
  onScroll() {
    this.scrollY.set(window.pageYOffset);
    this.time.update(t => t + 1);
  }
}
