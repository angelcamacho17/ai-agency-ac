import { AfterViewInit, Component, ElementRef, Injectable, NgZone, OnDestroy, ViewChild, effect, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HandsTouchService {
  readonly touched = signal(false);

  trigger(): void {
    this.touched.set(true);
  }
}

@Component({
  selector: 'app-hands-scroll',
  standalone: true,
  template: `
    <div class="hands-layer hidden md:block" [class.touched]="touch.touched()" aria-hidden="true">
      <div class="burst" #burst></div>
      <img
        #leftHand
        src="/michelangelo_hand_left.png"
        alt=""
        class="hand hand-left"
        fetchpriority="high"
      />
      <img
        #rightHand
        src="/michelangelo_hand_right.png"
        alt=""
        class="hand hand-right"
        fetchpriority="high"
      />
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }

    .hands-layer {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    .hand {
      position: absolute;
      top: 50%;
      width: clamp(280px, 38vw, 520px);
      height: auto;
      will-change: transform, opacity;
      filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
      transform: translate3d(0, -50%, 0);
      transition: opacity 0.3s ease, filter 0.5s ease;
    }

    .hand-left {
      left: 0;
      transform-origin: center left;
    }

    .hand-right {
      right: 0;
      transform-origin: center right;
    }

    /* Touch state — fingertips meet at center, brand-color glow flares up. */
    .hands-layer.touched .hand {
      transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease, filter 0.5s ease;
      opacity: 1 !important;
      filter:
        drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))
        drop-shadow(0 0 60px rgb(var(--brand-rgb) / 0.95))
        drop-shadow(0 0 120px rgb(var(--brand-rgb) / 0.7));
    }

    /* Touch end-state — final pixel positions are written via inline style
       from JS (see applyTouchEndState) because they depend on the real
       rendered hand width and the viewport width. */

    /* Burst — radial flash of brand color from the meeting point. */
    .burst {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      transform: translate3d(-50%, -50%, 0);
      background: radial-gradient(
        circle,
        rgb(var(--brand-rgb) / 1) 0%,
        rgb(var(--brand-rgb) / 0.6) 25%,
        rgb(var(--brand-rgb) / 0.2) 55%,
        transparent 75%
      );
      opacity: 0;
      pointer-events: none;
      will-change: width, height, opacity, filter;
    }

    .hands-layer.touched .burst {
      animation: miracle-burst 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes miracle-burst {
      0% {
        width: 0;
        height: 0;
        opacity: 0;
        filter: blur(0px);
      }
      30% {
        width: 30vw;
        height: 30vw;
        opacity: 1;
        filter: blur(10px);
      }
      70% {
        width: 180vw;
        height: 180vw;
        opacity: 0.8;
        filter: blur(40px);
      }
      100% {
        width: 280vw;
        height: 280vw;
        opacity: 0;
        filter: blur(80px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .hands-layer.touched .burst {
        animation: none;
      }
    }
  `]
})
export class HandsScrollComponent implements AfterViewInit, OnDestroy {
  @ViewChild('leftHand', { static: true }) leftHand!: ElementRef<HTMLImageElement>;
  @ViewChild('rightHand', { static: true }) rightHand!: ElementRef<HTMLImageElement>;

  readonly touch = inject(HandsTouchService);

  /**
   * Distance (px) between the fingertips at the closest scroll position
   * (page bottom). 4px = ~2px gap on each side of the centerline.
   */
  private readonly NEAR_GAP_PX = 4;

  /**
   * The visible fingertip in each PNG isn't exactly at the inner edge of the
   * image bounding box — there's transparent padding. Tweak this if the hands
   * still cross or stay too far apart at the bottom of the page. Negative
   * values pull each hand closer to the center, positive values push apart.
   */
  private readonly FINGERTIP_INSET_PX = 0;

  private cleanup?: () => void;

  constructor(private ngZone: NgZone) {
    effect(() => {
      if (this.touch.touched()) {
        this.applyTouchEndState();
      }
    });
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      this.applyProgress(1);
      return;
    }

    if (window.innerWidth < 768) {
      this.applyProgress(0);
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      let rafId = 0;
      const compute = () => {
        rafId = 0;
        const doc = document.documentElement;
        const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
        const raw = window.scrollY / maxScroll;
        const progress = Math.min(1, Math.max(0, raw));
        this.applyProgress(progress);
      };
      const onScroll = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(compute);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      this.cleanup = () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      };

      compute();
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }

  /**
   * For the left hand (anchored at left: 0), the inner edge sits at `width`
   * pixels from the left of the viewport. To bring that edge to the
   * centerline minus a small gap, translateX must equal:
   *   (viewportWidth / 2) - gap/2 - width
   *
   * Right hand (anchored at right: 0): inner edge sits at
   * `viewportWidth - width` pixels from the left. Final desired position is
   * `viewportWidth / 2 + gap/2`. translateX must equal
   *   (viewportWidth / 2 + gap/2) - (viewportWidth - width)
   * = width - viewportWidth/2 + gap/2  (negative when measured from
   *   right anchor, so we apply it as-is).
   */
  private targetTranslateX(side: 'left' | 'right', gapPx: number): number {
    const left = this.leftHand?.nativeElement;
    const right = this.rightHand?.nativeElement;
    if (!left || !right) return 0;

    const vw = window.innerWidth;
    const handWidth = side === 'left' ? left.offsetWidth : right.offsetWidth;
    const halfGap = gapPx / 2;
    const inset = this.FINGERTIP_INSET_PX;

    if (side === 'left') {
      return vw / 2 - halfGap - handWidth + inset;
    }
    // For the right hand, anchor is right: 0, so positive X moves further
    // right (off-screen). We want negative X to move it inward.
    return -(vw / 2 - halfGap - handWidth + inset);
  }

  private applyProgress(p: number): void {
    const left = this.leftHand?.nativeElement;
    const right = this.rightHand?.nativeElement;
    if (!left || !right) return;

    // Once touched, the touch end-state takes over; don't fight it.
    if (this.touch.touched()) return;

    // Hands are already inside the viewport at p = 0 — they peek in from
    // each side with a wide gap, then close to NEAR_GAP_PX at the bottom.
    const farGapPx = window.innerWidth * 0.55; // visible from the top
    const gap = farGapPx - p * (farGapPx - this.NEAR_GAP_PX);

    const leftX = this.targetTranslateX('left', gap);
    const rightX = this.targetTranslateX('right', gap);

    // Opacity ramps from 0.55 → 0.9 across the page — visible from the start.
    const handOpacity = 0.55 + p * 0.35;

    left.style.transform = `translate3d(${leftX}px, -50%, 0)`;
    right.style.transform = `translate3d(${rightX}px, -50%, 0)`;
    left.style.opacity = String(handOpacity);
    right.style.opacity = String(handOpacity);
  }

  private applyTouchEndState(): void {
    const left = this.leftHand?.nativeElement;
    const right = this.rightHand?.nativeElement;
    if (!left || !right) return;

    // On touch, fingertips meet exactly at the center (zero gap).
    const leftX = this.targetTranslateX('left', 0);
    const rightX = this.targetTranslateX('right', 0);

    left.style.transform = `translate3d(${leftX}px, -50%, 0)`;
    right.style.transform = `translate3d(${rightX}px, -50%, 0)`;
  }
}
