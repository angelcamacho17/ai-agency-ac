import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  NgZone,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Star {
  x: number;
  y: number;
  z: number; // depth 0..1 — drives size, brightness and parallax speed
  twinkle: number; // phase offset for twinkle
}

/**
 * Fixed, full-viewport cosmic starfield + drifting nebula. Sits behind the
 * entire app (z-index: -1) on a deep-purple/black base, giving every section a
 * cohesive "cosmic" backdrop while keeping the brand green for the foreground.
 *
 * - SSR-safe: canvas only animates in the browser; markup renders on the server.
 * - Cheap: ~one RAF, additive blending, parallax driven by scroll (no layout).
 * - Respects prefers-reduced-motion (renders a static field, no animation).
 */
@Component({
  selector: 'app-cosmic-background',
  standalone: true,
  template: `
    <div class="cosmic-root" aria-hidden="true">
      <div class="cosmic-nebula"></div>
      <canvas #starCanvas class="cosmic-stars"></canvas>
    </div>
  `,
  styles: [`
    .cosmic-root {
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      /* Deep-purple cosmic base — the foundation of the new look. */
      background:
        radial-gradient(ellipse 120% 80% at 50% -10%, #1a0633 0%, transparent 55%),
        radial-gradient(ellipse 100% 90% at 80% 110%, #0d0420 0%, transparent 50%),
        #060010;
    }

    .cosmic-nebula {
      position: absolute;
      inset: -20%;
      background:
        radial-gradient(circle at 22% 30%, rgb(var(--brand-rgb) / 0.10) 0%, transparent 38%),
        radial-gradient(circle at 78% 68%, rgba(120, 40, 200, 0.16) 0%, transparent 42%),
        radial-gradient(circle at 60% 18%, rgba(40, 120, 220, 0.10) 0%, transparent 40%);
      filter: blur(40px);
      will-change: transform;
      animation: nebula-drift 38s ease-in-out infinite alternate;
    }

    .cosmic-stars {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    @keyframes nebula-drift {
      from { transform: translate3d(0, 0, 0) scale(1); }
      to   { transform: translate3d(3%, -2%, 0) scale(1.08); }
    }

    @media (prefers-reduced-motion: reduce) {
      .cosmic-nebula { animation: none; }
    }
  `],
})
export class CosmicBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('starCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly zone = inject(NgZone);

  private ctx!: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private rafId?: number;
  private scrollY = 0;
  private frame = 0;
  private dpr = 1;
  private reduced = false;
  private readonly STAR_COUNT = 5200;

  private readonly onResize = () => this.setup();
  private readonly onScroll = () => { this.scrollY = window.scrollY; };

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.setup();

    this.zone.runOutsideAngular(() => {
      window.addEventListener('resize', this.onResize, { passive: true });
      window.addEventListener('scroll', this.onScroll, { passive: true });
      if (this.reduced) {
        this.draw(); // single static frame
      } else {
        this.animate();
      }
    });
  }

  private setup(): void {
    const canvas = this.canvas.nativeElement;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * this.dpr);
    canvas.height = Math.floor(h * this.dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.initStars(w, h);
  }

  private initStars(w: number, h: number): void {
    // Stars span 2x viewport height so parallax has room before wrapping.
    const fieldH = h * 2;
    this.stars = new Array(this.STAR_COUNT);
    for (let i = 0; i < this.STAR_COUNT; i++) {
      this.stars[i] = {
        x: Math.random() * w,
        y: Math.random() * fieldH,
        z: Math.random(),
        twinkle: Math.random() * Math.PI * 2,
      };
    }
  }

  private animate = () => {
    this.frame++;
    this.draw();
    this.rafId = requestAnimationFrame(this.animate);
  };

  private draw(): void {
    const ctx = this.ctx;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const fieldH = h * 2;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    const t = this.frame * 0.03;

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      // Closer stars (high z) parallax faster against the scroll.
      const parallax = this.scrollY * (0.1 + s.z * 0.5);
      let y = s.y - parallax;
      // Wrap within the doubled field for an endless scroll.
      y = ((y % fieldH) + fieldH) % fieldH;
      if (y > h + 4) continue; // off-screen below

      const size = 0.4 + s.z * 1.6;
      const base = 0.25 + s.z * 0.6;
      const tw = this.reduced ? 1 : 0.65 + 0.35 * Math.sin(t + s.twinkle);
      const alpha = Math.min(1, base * tw);

      // Brand-green tint on the brightest near stars, cool white otherwise.
      if (s.z > 0.8) {
        ctx.fillStyle = `rgba(211, 222, 71, ${alpha})`;
      } else if (s.z > 0.55) {
        ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
      } else {
        ctx.fillStyle = `rgba(235, 235, 255, ${alpha})`;
      }

      ctx.beginPath();
      ctx.arc(s.x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
  }
}
