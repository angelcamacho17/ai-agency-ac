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
 * Cinematic brand payoff — "We write art, Not just Code."
 *
 * Appears as a fixed centered overlay while the Michelangelo hands are closing.
 * Words resolve from blur to sharp one-by-one at ~88-94% of the hands scroll zone.
 * "Code." fires a single neon-green glow pulse at the end.
 * The overlay fades out when the CTA section enters the viewport.
 *
 * Works on all screen sizes — the hands are visible on mobile too.
 */
@Component({
  selector: 'app-brand-statement',
  standalone: true,
  template: `
    <div class="bso" #overlay aria-hidden="true">
      <p class="line line-one">
        <span #w1 class="word">We</span>
        <span #w2 class="word">&nbsp;write</span>
        <span #w3 class="word serif-italic accent">&nbsp;art,</span>
      </p>
      <p class="line line-two">
        <span #w4 class="word muted">Not</span>
        <span #w5 class="word muted">&nbsp;just</span>
        <span #w6 class="word serif-italic">&nbsp;Code.</span>
      </p>
    </div>
  `,
  styles: [`
    /* ── Overlay ── */
    .bso {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 25;
      pointer-events: none;
      text-align: center;
      opacity: 0;
      width: 90vw;
      will-change: opacity;
    }

    .line {
      display: block;
      line-height: 1.05;
      margin: 0;
      white-space: nowrap;

      @media (max-width: 520px) {
        white-space: normal;
      }
    }

    .line-one { margin-bottom: 0.1em; }

    /* ── Words ── */
    .word {
      display: inline-block;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: clamp(2rem, 6vw, 5.5rem);
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.01em;
      /* Animated via CSS custom properties driven by JS */
      opacity: var(--wo, 0);
      filter: blur(var(--wb, 20px));
      transform: translateY(var(--wy, 6px));
      will-change: opacity, filter, transform;
      transition: none; /* JS owns these values */
    }

    .word.serif-italic {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-weight: 700;
    }

    .word.muted { color: rgba(255, 255, 255, 0.72); }

    /* "art," — the payoff word */
    .word.accent {
      color: #d3de47;
      text-shadow:
        0 0 30px rgb(211 222 71 / 0.55),
        0 0 60px rgb(211 222 71 / 0.28);
    }

    .word.accent.pulse-once {
      animation: glow-pulse 1.1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes glow-pulse {
      0%   { text-shadow: 0 0 30px rgb(211 222 71 / 0.55), 0 0 60px rgb(211 222 71 / 0.28); }
      38%  { text-shadow: 0 0 80px rgb(211 222 71 / 1), 0 0 160px rgb(211 222 71 / 0.8), 0 0 260px rgb(211 222 71 / 0.5); }
      100% { text-shadow: 0 0 30px rgb(211 222 71 / 0.55), 0 0 60px rgb(211 222 71 / 0.28); }
    }

    @media (prefers-reduced-motion: reduce) {
      .word.accent.pulse-once { animation: none; }
    }
  `]
})
export class BrandStatementComponent implements AfterViewInit, OnDestroy {
  @ViewChild('overlay') overlay!: ElementRef<HTMLDivElement>;
  @ViewChild('w1') w1!: ElementRef<HTMLSpanElement>;
  @ViewChild('w2') w2!: ElementRef<HTMLSpanElement>;
  @ViewChild('w3') w3!: ElementRef<HTMLSpanElement>;
  @ViewChild('w4') w4!: ElementRef<HTMLSpanElement>;
  @ViewChild('w5') w5!: ElementRef<HTMLSpanElement>;
  @ViewChild('w6') w6!: ElementRef<HTMLSpanElement>;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly ngZone = inject(NgZone);

  /** Scroll progress thresholds (0–1 within the 250vh hands zone) */
  private readonly BLEED   = 0.80; // overlay starts to form
  private readonly RESOLVE = 0.88; // words resolve one by one
  private readonly END     = 0.94; // all words sharp — pulse fires

  /** Word stagger offsets (0–1 inside the RESOLVE→END window) */
  private readonly STAGGER = [0, 0.15, 0.30, 0.50, 0.65, 0.80];

  private pulseFired = false;
  private rafId = 0;
  private ctaObserver?: IntersectionObserver;
  private cleanups: Array<() => void> = [];

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { this.forceReveal(); return; }

    this.ngZone.runOutsideAngular(() => {
      const tick = () => {
        this.rafId = 0;
        this.applyProgress(this.readProgress());
      };
      const onScroll = () => { if (!this.rafId) this.rafId = requestAnimationFrame(tick); };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      this.cleanups.push(
        () => window.removeEventListener('scroll', onScroll),
        () => window.removeEventListener('resize', onScroll),
      );
      tick();
    });

    this.initCtaObserver();
  }

  ngOnDestroy(): void {
    this.cleanups.forEach(f => f());
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.ctaObserver?.disconnect();
  }

  /**
   * Progress (0→1) within the 250vh hands scroll zone.
   * Zone travel = 250vh - 100vh = 150vh.
   */
  private readProgress(): number {
    const travel = window.innerHeight * 1.5;
    return Math.min(1, Math.max(0, window.scrollY / travel));
  }

  private applyProgress(p: number): void {
    const ov = this.overlay?.nativeElement;
    if (!ov) return;

    // Past the 250vh hands zone — hide completely so it doesn't linger
    if (window.scrollY > window.innerHeight * 1.5) {
      ov.style.opacity = '0';
      return;
    }

    if (p < this.BLEED) {
      ov.style.opacity = '0';
      this.setWords(0, 20, 6);
      // Reset pulse so it re-fires if user scrolls back into the zone
      this.pulseFired = false;
      return;
    }

    // Bleed phase: overlay fades in subtly, words are still very blurry
    if (p < this.RESOLVE) {
      const t = (p - this.BLEED) / (this.RESOLVE - this.BLEED);
      ov.style.opacity = String(lerp(0, 0.2, t));
      this.setWords(lerp(0, 0.2, t), lerp(20, 12, t), lerp(6, 3, t));
      return;
    }

    ov.style.opacity = '1';

    // Resolve phase: words sharpen one by one
    const rt = (p - this.RESOLVE) / (this.END - this.RESOLVE);
    const words = [this.w1, this.w2, this.w3, this.w4, this.w5, this.w6];
    words.forEach((ref, i) => {
      const el = ref?.nativeElement;
      if (!el) return;
      const wt = easeOutCubic(clamp01((rt - this.STAGGER[i]) / 0.25));
      el.style.setProperty('--wo', String(lerp(0.2, 1, wt)));
      el.style.setProperty('--wb', `${lerp(12, 0, wt)}px`);
      el.style.setProperty('--wy', `${lerp(3, 0, wt)}px`);
    });

    // One-shot pulse on "art," when all words are resolved
    if (p >= this.END && !this.pulseFired) {
      this.pulseFired = true;
      const el = this.w3?.nativeElement;
      if (el) {
        el.classList.remove('pulse-once');
        void el.offsetWidth; // reflow to restart animation
        el.classList.add('pulse-once');
      }
    }
  }

  private setWords(opacity: number, blur: number, ty: number): void {
    [this.w1, this.w2, this.w3, this.w4, this.w5, this.w6].forEach(ref => {
      const el = ref?.nativeElement;
      if (!el) return;
      el.style.setProperty('--wo', String(opacity));
      el.style.setProperty('--wb', `${blur}px`);
      el.style.setProperty('--wy', `${ty}px`);
    });
  }

  private forceReveal(): void {
    const ov = this.overlay?.nativeElement;
    if (ov) { ov.style.opacity = '1'; }
    this.setWords(1, 0, 0);
    if (!this.pulseFired) {
      this.pulseFired = true;
      this.w3?.nativeElement?.classList.add('pulse-once');
    }
  }

  /** Fade the overlay out when the CTA section scrolls into view. */
  private initCtaObserver(): void {
    const cta = document.getElementById('contact');
    if (!cta) return;
    this.ctaObserver = new IntersectionObserver(
      entries => {
        const ov = this.overlay?.nativeElement;
        if (!ov) return;
        entries.forEach(e => {
          if (e.intersectionRatio > 0.55) {
            ov.style.transition = 'opacity 0.5s ease';
            ov.style.opacity = '0';
          } else if (e.intersectionRatio < 0.25 && this.readProgress() >= this.END) {
            ov.style.transition = 'opacity 0.5s ease';
            ov.style.opacity = '1';
          }
        });
      },
      { threshold: [0.25, 0.55] }
    );
    this.ctaObserver.observe(cta);
  }
}

function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }
function clamp01(v: number): number { return v < 0 ? 0 : v > 1 ? 1 : v; }
function easeOutCubic(t: number): number { return 1 - Math.pow(1 - t, 3); }
