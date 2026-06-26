import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

@Component({
  selector: 'app-particles',
  standalone: true,
  template: '<canvas #particleCanvas class="absolute inset-0 z-[5] pointer-events-none"></canvas>',
})
export class ParticlesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId?: number;
  private resizeObserver?: ResizeObserver;
  private visibilityObserver?: IntersectionObserver;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.ctx = ctx;
    this.resizeCanvas();
    this.initParticles();
    this.animate();

    // Handle resize
    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvas();
    });
    this.resizeObserver.observe(canvas.parentElement || document.body);

    // Pause the RAF loop when the hero is not visible — saves GPU on long pages
    this.visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!this.animationId) this.animate();
        } else {
          if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = undefined;
          }
        }
      },
      { threshold: 0 }
    );
    this.visibilityObserver.observe(canvas);
  }

  private resizeCanvas() {
    const canvas = this.canvas.nativeElement;
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }
  }

  private initParticles() {
    const canvas = this.canvas.nativeElement;
    const particleCount = Math.floor((canvas.width * canvas.height) / 8000);

    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.2,
        size: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  private animate = () => {
    const canvas = this.canvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;

      // Draw particle with brand glow
      this.ctx.shadowBlur = 25;
      this.ctx.shadowColor = '#d3de47';
      this.ctx.fillStyle = `rgba(211, 222, 71, ${particle.opacity * 0.65})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Add extra glow layer
      this.ctx.shadowBlur = 40;
      this.ctx.fillStyle = `rgba(211, 222, 71, ${particle.opacity * 0.3 * 0.65})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.animationId = requestAnimationFrame(this.animate);
  };

  ngOnDestroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.resizeObserver?.disconnect();
    this.visibilityObserver?.disconnect();
  }
}
