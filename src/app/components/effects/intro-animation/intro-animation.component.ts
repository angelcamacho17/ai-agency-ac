import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * "THE SPARK" — Cinematic Genesis intro. Duration ~3.8s.
 *
 * Emotional arc: Void → Potential → Life → Tension → Creation → Arrival
 *
 * Timeline:
 *   0.00s  Absolute black. A single pixel breathes at center.
 *   0.60s  Pixel fractures into 80 golden neurons (Brownian motion).
 *   1.30s  Neurons begin magnetizing to two poles (left / right edges).
 *   1.80s  Michelangelo hand PNGs pierce darkness from both sides.
 *   2.40s  Electric arc canvas lightning crackles between approaching hands.
 *   3.00s  Hands stop at scroll-start position. Arc at peak intensity.
 *   3.20s  Full-screen white flash (CSS).
 *   3.50s  Flash clears → overlay gone → hero words already revealed.
 *          Scroll hands are now at startX — seamless visual handoff.
 *
 * Mobile: neurons skipped; hands slide in faster; arc is simpler.
 * Skip: jumps to flash immediately.
 * prefers-reduced-motion: instant reveal, no animation.
 */
@Component({
  selector: 'app-intro-animation',
  standalone: true,
  template: `
    <div class="intro-overlay" #overlay>
      <!-- Full canvas: breathing pixel → neurons → electric arc -->
      <canvas class="spark-canvas" #canvas aria-hidden="true"></canvas>

      <!-- Michelangelo left hand — same PNG as scroll animation -->
      <img class="intro-hand left" #leftWrap
           src="/michelangelo_hand_left.png" aria-hidden="true" />

      <!-- Michelangelo right hand — mirrored entry from right -->
      <img class="intro-hand right" #rightWrap
           src="/michelangelo_hand_right.png" aria-hidden="true" />

      <!-- Skip button -->
      <button class="skip-btn" #skipBtn type="button" (click)="skip()" aria-label="Skip intro">
        skip
      </button>
    </div>
  `,
  styles: [`
    /* ── Overlay ── */
    .intro-overlay {
      position: fixed;
      inset: 0;
      z-index: 200;
      background: #060606;
      overflow: hidden;
      pointer-events: none;
    }

    /* ── Canvas ── */
    .spark-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    /* ── Michelangelo hand images — same sizing as hands-scroll ── */
    .intro-hand {
      position: absolute;
      top: 50%;
      height: auto;
      width: clamp(280px, 38vw, 520px);
      will-change: transform, filter;
      filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
      pointer-events: none;
    }

    .intro-hand.left  { left: 0;  transform-origin: center left; }
    .intro-hand.right { right: 0; transform-origin: center right; }

    /* ── Skip button ── */
    .skip-btn {
      position: absolute;
      bottom: clamp(24px, 5vh, 48px);
      right: clamp(24px, 4vw, 48px);
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: rgba(255, 255, 255, 0.45);
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 4px;
      cursor: pointer;
      pointer-events: auto;
      opacity: 0;
      transition: color 0.2s, border-color 0.2s;
      will-change: opacity;
    }

    .skip-btn:hover {
      color: rgba(255, 255, 255, 0.85);
      border-color: rgba(255, 255, 255, 0.4);
    }

    /* ── Mobile: smaller hands, same vertical center as hands-scroll ── */
    @media (max-width: 767px) {
      .intro-hand {
        width: clamp(130px, 42vw, 200px);
        top: 55%;
      }
    }
  `]
})
export class IntroAnimationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('overlay')    overlay!:    ElementRef<HTMLDivElement>;
  @ViewChild('canvas')     canvas!:     ElementRef<HTMLCanvasElement>;
  @ViewChild('leftWrap')   leftWrap!:   ElementRef<HTMLImageElement>;
  @ViewChild('rightWrap')  rightWrap!:  ElementRef<HTMLImageElement>;
  @ViewChild('skipBtn')    skipBtn!:    ElementRef<HTMLButtonElement>;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly ngZone    = inject(NgZone);

  private ctx!: CanvasRenderingContext2D | null;
  private neurons: Neuron[]  = [];
  private rafId = 0;
  private phase: IntroPhase = 'void';
  private gsapCtx: { revert: () => void } | null = null;
  private skipFired = false;

  /* Tweened values driven by GSAP */
  private readonly tw = {
    breathScale:   0,   // 0→1 for the breathing pixel
    neuronSpawn:   0,   // 0→1 controls how many neurons are visible
    polarity:      0,   // 0→1 pulls neurons to left/right poles
  };

  ngAfterViewInit(): void {
    if (!this.isBrowser) { this.hideOverlay(); return; }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { this.completeInstantly(); return; }

    document.body.style.overflow = 'hidden';

    this.ngZone.runOutsideAngular(async () => {
      const { gsap } = await import('gsap');

      this.initCanvas();
      this.tickLoop();

      this.gsapCtx = gsap.context(() => {
        const isMobile = window.innerWidth < 768;
        this.buildTimeline(gsap, isMobile);
      });
    });
  }

  ngOnDestroy(): void {
    this.stopLoop();
    this.gsapCtx?.revert();
  }

  skip(): void {
    if (this.skipFired) return;
    this.skipFired = true;
    this.ngZone.runOutsideAngular(async () => {
      const { gsap } = await import('gsap');
      this.gsapCtx?.revert();
      this.stopLoop();
      this.phase = 'done';
      this.revealHero(gsap, 0);
      gsap.to(this.overlay.nativeElement, {
        opacity: 0, duration: 0.4,
        onComplete: () => this.hideOverlay()
      });
    });
  }

  // ────────────────────────────────────────────────────────────────
  //  TIMELINE
  // ────────────────────────────────────────────────────────────────

  private buildTimeline(gsap: any, isMobile: boolean): void {
    const tl  = gsap.timeline({ defaults: { ease: 'power2.out' } });
    const tw  = this.tw;
    const lw  = this.leftWrap.nativeElement;
    const rw  = this.rightWrap.nativeElement;
    const btn = this.skipBtn.nativeElement;

    const vw      = window.innerWidth;
    const fingerW = lw.offsetWidth || (isMobile ? 160 : 420);

    // Hands start off-screen. yPercent: -50 centers vertically — same as hands-scroll.
    gsap.set(lw, { x: -(fingerW + 40), yPercent: -50, opacity: 1 });
    gsap.set(rw, { x:  (fingerW + 40), yPercent: -50, opacity: 1 });

    // Touch position: right edge of left hand meets left edge of right hand at center.
    const touchLeft  =  vw / 2 - fingerW;
    const touchRight = -(vw / 2 - fingerW);

    // Scroll start position = HandsScrollComponent.startX() — hands open here after touch
    // so when the overlay fades away, the scroll hands underneath are in the exact same spot.
    const scrollStartLeft  =  vw / 2 - vw * 0.275 - fingerW;
    const scrollStartRight = -(vw / 2 - vw * 0.275 - fingerW);

    // ── 0. VOID — breathing pixel ──────────────────────────────────
    this.phase = 'void';
    tl.to(tw, { breathScale: 1, duration: 0.55, ease: 'sine.inOut' }, 0.05);
    tl.to(tw, { breathScale: 0.35, duration: 0.55, ease: 'sine.inOut' }, 0.60);

    // ── 1. BIRTH — neurons spawn ───────────────────────────────────
    if (!isMobile) {
      tl.add(() => { this.phase = 'neurons'; }, 0.60);
      tl.to(tw, { neuronSpawn: 1, duration: 0.70, ease: 'power1.out' }, 0.60);

      // ── 2. POLARITY — neurons split to edges ──────────────────────
      tl.add(() => { this.phase = 'polarity'; }, 1.25);
      tl.to(tw, { polarity: 1, duration: 0.55, ease: 'power2.in' }, 1.25);
    }

    // ── 3. HANDS ENTER — slide toward center ──────────────────────
    const fingerStart    = isMobile ? 0.65 : 1.75;
    const slideDuration  = isMobile ? 1.3  : 1.6;

    tl.add(() => { this.phase = 'fingers'; }, fingerStart);
    tl.to(lw, { x: touchLeft,  duration: slideDuration, ease: 'power3.inOut' }, fingerStart);
    tl.to(rw, { x: touchRight, duration: slideDuration, ease: 'power3.inOut' }, fingerStart);

    // Glow builds as hands approach
    tl.to([lw, rw], {
      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5)) drop-shadow(0 0 25px rgba(211,222,71,0.5))',
      duration: 0.6,
      ease: 'power1.out',
    }, fingerStart + 0.5);

    // Skip button appears
    tl.to(btn, {
      opacity: 1, duration: 0.3,
      onStart: () => { btn.style.pointerEvents = 'auto'; }
    }, fingerStart);

    // ── 4. TOUCH — peak glow, brief hold ──────────────────────────
    const touchAt = fingerStart + slideDuration;
    tl.add(() => { this.phase = 'held'; }, touchAt);
    tl.to([lw, rw], {
      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5)) drop-shadow(0 0 70px rgba(211,222,71,0.95)) drop-shadow(0 0 130px rgba(211,222,71,0.5))',
      duration: 0.18,
      ease: 'power3.in',
    }, touchAt);

    // ── 5. CURTAIN OPENS — hands slide to scroll start position ───
    // This frames the reveal perfectly: hands open like curtains, landing
    // at the exact position the scroll animation begins from.
    const openAt = touchAt + 0.25;
    tl.to(lw, { x: scrollStartLeft,  duration: 0.45, ease: 'power2.inOut' }, openAt);
    tl.to(rw, { x: scrollStartRight, duration: 0.45, ease: 'power2.inOut' }, openAt);
    tl.to([lw, rw], {
      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5)) drop-shadow(0 0 15px rgba(211,222,71,0.25))',
      duration: 0.35,
    }, openAt);

    // Reveal hero as the curtain opens
    tl.add(() => {
      import('gsap').then(({ gsap: g }) => this.revealHero(g, 0.08));
    }, openAt + 0.12);

    // ── 6. FADE OUT — overlay dissolves, scroll hands take over ───
    tl.to(this.overlay.nativeElement, {
      opacity: 0,
      duration: 0.55,
      ease: 'power1.inOut',
      onComplete: () => { this.phase = 'done'; this.hideOverlay(); }
    }, openAt + 0.35);
  }

  // ────────────────────────────────────────────────────────────────
  //  CANVAS RENDER LOOP
  // ────────────────────────────────────────────────────────────────

  private initCanvas(): void {
    const el  = this.canvas.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    const W   = window.innerWidth;
    const H   = window.innerHeight;
    el.width  = W * dpr;
    el.height = H * dpr;
    el.style.width  = W + 'px';
    el.style.height = H + 'px';
    this.ctx  = el.getContext('2d');
    if (this.ctx) this.ctx.scale(dpr, dpr);

    this.neurons = Array.from({ length: 80 }, () => this.makeNeuron(W, H));
  }

  private makeNeuron(W: number, H: number): Neuron {
    return {
      x:    W * 0.2 + Math.random() * W * 0.6,
      y:    H * 0.2 + Math.random() * H * 0.6,
      r:    Math.random() * 1.6 + 0.4,
      alpha:Math.random() * 0.5 + 0.5,
      vx:   (Math.random() - 0.5) * 0.35,
      vy:   (Math.random() - 0.5) * 0.35,
      side: Math.random() < 0.5 ? 'left' : 'right',
    };
  }

  private tickLoop(): void {
    const tick = () => {
      if (this.phase === 'done') return;
      this.rafId = requestAnimationFrame(tick);
      this.draw();
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;
    const tw = this.tw;

    ctx.clearRect(0, 0, W, H);

    switch (this.phase) {
      case 'void':
        this.drawBreathingPixel(ctx, cx, cy, tw.breathScale);
        break;

      case 'neurons':
        this.drawNeurons(ctx, W, H, tw.neuronSpawn, 0);
        break;

      case 'polarity':
        this.drawNeurons(ctx, W, H, 1, tw.polarity);
        break;

      case 'fingers':
        this.drawNeurons(ctx, W, H, 1, tw.polarity);
        break;

      case 'held':
        this.drawNeurons(ctx, W, H, 1, tw.polarity);
        break;

      default:
        break;
    }
  }

  // ── Breathing pixel ──────────────────────────────────────────────

  private drawBreathingPixel(
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number,
    scale: number
  ): void {
    const r = Math.max(0.5, scale * 3.5);
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 6);
    grd.addColorStop(0,   `rgba(211,222,71,${scale * 0.9})`);
    grd.addColorStop(0.4, `rgba(211,222,71,${scale * 0.3})`);
    grd.addColorStop(1,   'rgba(211,222,71,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, r * 6, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(240,250,180,${scale})`;
    ctx.fill();
  }

  // ── Neurons ──────────────────────────────────────────────────────

  private drawNeurons(
    ctx: CanvasRenderingContext2D,
    W: number, H: number,
    spawn: number, polarity: number
  ): void {
    const count = Math.floor(spawn * this.neurons.length);
    const leftTarget  = { x: W * 0.06, y: H / 2 };
    const rightTarget = { x: W * 0.94, y: H / 2 };

    for (let i = 0; i < count; i++) {
      const n = this.neurons[i];

      if (polarity > 0) {
        const tgt = n.side === 'left' ? leftTarget : rightTarget;
        const dx  = tgt.x - n.x;
        const dy  = tgt.y - n.y;
        n.vx += dx * polarity * 0.018;
        n.vy += dy * polarity * 0.018;
        n.vx *= 0.84;
        n.vy *= 0.84;
      } else {
        n.vx += (Math.random() - 0.5) * 0.05;
        n.vy += (Math.random() - 0.5) * 0.05;
        n.vx *= 0.97;
        n.vy *= 0.97;
      }

      n.x += n.vx;
      n.y += n.vy;

      for (let j = i + 1; j < Math.min(count, i + 8); j++) {
        const b = this.neurons[j];
        const dist = Math.hypot(b.x - n.x, b.y - n.y);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(211,222,71,${(1 - dist / 90) * 0.12 * spawn})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      const a = n.alpha * spawn;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + polarity * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(211,222,71,${a})`;
      ctx.fill();
    }
  }

  // ────────────────────────────────────────────────────────────────
  //  HERO REVEAL
  // ────────────────────────────────────────────────────────────────

  private revealHero(gsap: any, stagger: number): void {
    const words = document.querySelectorAll<HTMLElement>('.hero-word');
    const sub   = document.querySelector<HTMLElement>('.hero-sub');

    if (words.length) {
      gsap.to(Array.from(words), {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        stagger,
        duration: 0.55,
        ease: 'power3.out',
      });
    }
    if (sub) {
      gsap.to(sub, {
        opacity: 1,
        duration: 0.5,
        delay: stagger * (words.length || 0) + 0.1,
      });
    }
  }

  // ────────────────────────────────────────────────────────────────
  //  UTILS
  // ────────────────────────────────────────────────────────────────

  private stopLoop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
    if (this.ctx) this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  private hideOverlay(): void {
    if (this.isBrowser) document.body.style.overflow = '';
    const ov = this.overlay?.nativeElement;
    if (ov) {
      ov.style.display = 'none';
      ov.style.pointerEvents = 'none';
    }
    this.stopLoop();
  }

  private completeInstantly(): void {
    this.hideOverlay();
  }
}

// ── Types ────────────────────────────────────────────────────────────────────

type IntroPhase = 'void' | 'neurons' | 'polarity' | 'fingers' | 'arc' | 'held' | 'done';

interface Neuron {
  x: number;
  y: number;
  r: number;
  alpha: number;
  vx: number;
  vy: number;
  side: 'left' | 'right';
}
