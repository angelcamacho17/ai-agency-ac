import {
  afterNextRender,
  Component,
  ElementRef,
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class HandsTouchService {
  readonly touched = signal(false);
  trigger(): void { this.touched.set(true); }
}

@Component({
  selector: 'app-hands-scroll',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div class="el-gap-wrapper" #wrapper>
      <div class="el-gap-sticky" #sticky [class.touched]="touch.touched()">

        <!-- Hero projected inside the sticky viewport (z-index: 15) -->
        <ng-content></ng-content>

        <!-- Chapter narrative text (z-index: 20) -->
        <div class="chapter-copy" aria-hidden="true">
          <div class="chapter" #ch1>{{ 'elgap.ch1' | translate }}</div>
          <div class="chapter" #ch2>
            {{ 'elgap.ch2' | translate }}
            <span class="chapter-sub" #ch2sub>{{ 'elgap.ch2sub' | translate }}</span>
          </div>
          <div class="chapter" #ch3>
            {{ 'elgap.ch3' | translate }}
            <span class="chapter-sub" #ch3sub>{{ 'elgap.ch3sub' | translate }}</span>
          </div>
        </div>

        <!-- Touch payoff word — emerges from the glow when fingertips meet (z-index: 25) -->
        <a class="touch-word" #touchWord href="#contact" (click)="scrollToCta($event)">{{ 'elgap.touch' | translate }}</a>
        <span class="cta-arrow" #ctaArrow aria-hidden="true">↓</span>

        <!-- Neon glow between fingertips (z-index: 10) -->
        <div class="gap-glow" #gapGlow aria-hidden="true"></div>

        <!-- Burst on CTA click (z-index: 30) -->
        <div class="burst" #burst aria-hidden="true"></div>

        <!-- Scroll progress bar — thin neon line at base of viewport (mobile trust signal) -->
        <div class="scroll-progress" #scrollProgress aria-hidden="true"></div>

        <!-- Scroll affordance — visible once intro overlay is gone, hides on first scroll -->
        <div class="scroll-cue" #scrollCue aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <!-- Hands (z-index: 5) -->
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
    </div>
  `,
  styles: [`
    :host { display: contents; }

    /* ── Scroll container: 200vh gives 100vh of scroll travel ── */
    .el-gap-wrapper {
      position: relative;
      height: 200vh;
      width: 100%;
      z-index: 0;
    }

    /* ── Sticky viewport ── */
    .el-gap-sticky {
      position: sticky;
      top: 0;
      height: 100vh;
      width: 100%;
      overflow: hidden;
      pointer-events: none;
    }

    /* ── Hands ── */
    .hand {
      position: absolute;
      top: 50%;
      height: auto;
      width: clamp(280px, 38vw, 520px);
      will-change: transform, opacity;
      filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
      z-index: 5;
    }

    .hand-left  { left: 0;  transform-origin: center left; }
    .hand-right { right: 0; transform-origin: center right; }

    /* ── Touch state: glow flare + spring to center ── */
    .el-gap-sticky.touched .hand {
      filter:
        drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))
        drop-shadow(0 0 60px rgb(var(--brand-rgb) / 0.95))
        drop-shadow(0 0 120px rgb(var(--brand-rgb) / 0.7));
    }

    /* ── Chapter labels ── */
    .chapter-copy {
      position: absolute;
      inset: 0;
      z-index: 20;
      pointer-events: none;
    }

    .chapter {
      position: absolute;
      bottom: 14vh;
      left: 0;
      right: 0;
      width: 100%;
      text-align: center;
      padding: 0 1.5rem;
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-size: clamp(1.1rem, 3.5vw, 2.8rem);
      font-weight: 700;
      color: rgba(255, 255, 255, 0.88);
      letter-spacing: 0.01em;
      text-shadow:
        0 0 40px rgb(var(--brand-rgb) / 0.4),
        0 2px 12px rgba(0, 0, 0, 0.9);
      will-change: opacity;
    }

    .chapter-sub {
      display: block;
      font-family: 'Inter', system-ui, sans-serif;
      font-style: normal;
      font-size: clamp(0.6rem, 1.6vw, 0.85rem);
      font-weight: 400;
      color: rgba(255, 255, 255, 0.68);
      letter-spacing: 0.04em;
      text-shadow: none;
      margin-top: 0.6em;
      opacity: 0;
      will-change: opacity;
    }

    /* ── Touch payoff word ── */
    .touch-word {
      position: absolute;
      top: 50%;
      left: 50%;
      /* Sits BELOW the fingertip union point (hands centered at 50vh via yPercent:-50).
         The fingertips land at ~top:50%; this offset pushes the word beneath them. */
      transform: translate(-50%, 14vh);
      z-index: 25;
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-size: clamp(2rem, 5vw, 4.5rem);
      font-weight: 700;
      color: #ffffff;
      text-shadow:
        0 0 40px rgb(211 222 71 / 0.7),
        0 0 80px rgb(211 222 71 / 0.35);
      letter-spacing: -0.01em;
      text-decoration: none;
      opacity: 0;
      filter: blur(8px);
      scale: 0.85;
      will-change: opacity, filter, scale;
      pointer-events: auto;
      cursor: pointer;
      white-space: nowrap;
      transition: text-shadow 0.3s ease;
    }

    .touch-word:hover {
      text-shadow:
        0 0 60px rgb(211 222 71 / 1),
        0 0 120px rgb(211 222 71 / 0.6),
        0 0 200px rgb(211 222 71 / 0.3);
    }

    /* ── CTA scroll affordance arrow ── */
    .cta-arrow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, 23vh);
      z-index: 25;
      font-size: clamp(1rem, 2vw, 1.5rem);
      color: rgb(211 222 71 / 0.7);
      opacity: 0;
      pointer-events: none;
      animation: arrow-pulse 1.6s ease-in-out infinite;
    }

    @keyframes arrow-pulse {
      0%, 100% { transform: translate(-50%, 23vh);       opacity: 0.5; }
      50%       { transform: translate(-50%, calc(23vh + 6px)); opacity: 1;   }
    }

    /* ── Fingertip glow ── */
    .gap-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      width: clamp(60px, 10vw, 140px);
      height: clamp(60px, 10vw, 140px);
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: radial-gradient(
        circle,
        rgb(var(--brand-rgb) / 1.0)   0%,
        rgb(var(--brand-rgb) / 0.65)  30%,
        rgb(var(--brand-rgb) / 0.2)   65%,
        transparent 80%
      );
      filter: blur(10px);
      opacity: 0;
      pointer-events: none;
      will-change: transform, opacity;
      z-index: 10;
    }

    /* ── Burst ── */
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
        rgb(var(--brand-rgb) / 1)   0%,
        rgb(var(--brand-rgb) / 0.6) 25%,
        rgb(var(--brand-rgb) / 0.2) 55%,
        transparent 75%
      );
      opacity: 0;
      pointer-events: none;
      will-change: width, height, opacity, filter;
      z-index: 30;
    }

    .el-gap-sticky.touched .burst {
      animation: miracle-burst 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes miracle-burst {
      0%   { width: 0;      height: 0;      opacity: 0;   filter: blur(0px); }
      30%  { width: 30vw;   height: 30vw;   opacity: 1;   filter: blur(10px); }
      70%  { width: 180vw;  height: 180vw;  opacity: 0.8; filter: blur(40px); }
      100% { width: 280vw;  height: 280vw;  opacity: 0;   filter: blur(80px); }
    }

    /* ── Scroll affordance chevron ── */
    .scroll-cue {
      position: absolute;
      bottom: 6vh;
      left: 50%;
      transform: translateX(-50%);
      z-index: 22;
      color: rgb(211 222 71 / 0.6);
      pointer-events: none;
      animation: cue-bounce 1.8s ease-in-out infinite;
    }

    @keyframes cue-bounce {
      0%, 100% { transform: translateX(-50%) translateY(0);   opacity: 0.5; }
      50%       { transform: translateX(-50%) translateY(6px); opacity: 1;   }
    }

    /* ── Scroll progress bar ── */
    .scroll-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: rgb(211 222 71 / 0.85);
      transform-origin: left center;
      transform: scaleX(0);
      z-index: 35;
      pointer-events: none;
    }

    /* ── Mobile ── */
    @media (max-width: 767px) {
      .hand {
        width: clamp(130px, 42vw, 200px);
        top: 55%;
      }
      .chapter {
        font-size: clamp(0.75rem, 4vw, 1.1rem);
        padding: 0 1rem;
      }
      .chapter { bottom: 10vh; }
      .touch-word {
        font-size: clamp(1.5rem, 7vw, 2.5rem);
        /* Mobile: hands don't close as far; keep word below the union point */
        transform: translate(-50%, 18vh);
      }
      .cta-arrow {
        transform: translate(-50%, 27vh);
      }
      @keyframes arrow-pulse {
        0%, 100% { transform: translate(-50%, 27vh);       opacity: 0.5; }
        50%       { transform: translate(-50%, calc(27vh + 6px)); opacity: 1;   }
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .el-gap-sticky.touched .burst { animation: none; }
    }
  `]
})
export class HandsScrollComponent implements OnDestroy {
  @ViewChild('wrapper',   { static: true }) wrapper!:   ElementRef<HTMLDivElement>;
  @ViewChild('leftHand',  { static: true }) leftHand!:  ElementRef<HTMLImageElement>;
  @ViewChild('rightHand', { static: true }) rightHand!: ElementRef<HTMLImageElement>;
  @ViewChild('ch1',       { static: true }) ch1!:       ElementRef<HTMLDivElement>;
  @ViewChild('ch2',       { static: true }) ch2!:       ElementRef<HTMLDivElement>;
  @ViewChild('ch2sub',    { static: true }) ch2sub!:    ElementRef<HTMLSpanElement>;
  @ViewChild('ch3',       { static: true }) ch3!:       ElementRef<HTMLDivElement>;
  @ViewChild('ch3sub',    { static: true }) ch3sub!:    ElementRef<HTMLSpanElement>;
  @ViewChild('gapGlow',   { static: true }) gapGlow!:   ElementRef<HTMLDivElement>;
  @ViewChild('touchWord',     { static: true }) touchWord!:     ElementRef<HTMLAnchorElement>;
  @ViewChild('ctaArrow',      { static: true }) ctaArrow!:      ElementRef<HTMLSpanElement>;
  @ViewChild('scrollProgress',{ static: true }) scrollProgress!: ElementRef<HTMLDivElement>;
  @ViewChild('scrollCue',     { static: true }) scrollCue!:      ElementRef<HTMLDivElement>;

  readonly touch = inject(HandsTouchService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private killGsap?: () => void;

  /** Gap between fingertips at end of scroll (px). */
  private readonly NEAR_GAP = 4;

  constructor() {
    effect(() => {
      if (this.touch.touched()) this.applyTouchEndState();
    });

    if (!this.isBrowser) return;

    afterNextRender(async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const lh = this.leftHand.nativeElement;
      const rh = this.rightHand.nativeElement;
      const tw = this.touchWord.nativeElement;
      const ar = this.ctaArrow.nativeElement;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduced) {
        gsap.set(lh, { x: () => this.endX(lh), yPercent: -50, opacity: 0.9 });
        gsap.set(rh, { x: () => -this.endX(rh), yPercent: -50, opacity: 0.9 });
        gsap.set(this.ch3.nativeElement, { opacity: 1 });
        gsap.set(tw, { opacity: 1, filter: 'blur(0px)', scale: 1 });
        gsap.set(ar, { opacity: 1 });
        return;
      }

      // ch1 visible via CSS default; hide ch2, ch3 and subs, glow, touchWord, arrow
      gsap.set(lh, { x: () => this.startX(lh), yPercent: -50, opacity: 0.55 });
      gsap.set(rh, { x: () => -this.startX(rh), yPercent: -50, opacity: 0.55 });
      gsap.set([this.ch2.nativeElement, this.ch3.nativeElement], { opacity: 0 });
      gsap.set([this.ch2sub.nativeElement, this.ch3sub.nativeElement], { opacity: 0 });
      gsap.set(this.gapGlow.nativeElement, { opacity: 0, scale: 0 });
      gsap.set(tw, { opacity: 0, filter: 'blur(8px)', scale: 0.85 });
      gsap.set(ar, { opacity: 0 });

      const progressEl = this.scrollProgress.nativeElement;
      const cueEl = this.scrollCue.nativeElement;
      let cueDismissed = false;

      // Mobile touch scroll is much faster — tighter scrub keeps animation in sync.
      const scrubAmount = window.innerWidth <= 767 ? 0.5 : 1.2;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.wrapper.nativeElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: scrubAmount,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(progressEl, { scaleX: self.progress });
            if (!cueDismissed && self.progress > 0.02) {
              cueDismissed = true;
              gsap.to(cueEl, { opacity: 0, duration: 0.4, ease: 'power2.out' });
            }
          },
        }
      });

      // Hands close — power3.inOut: slow drift → surge → decelerate into gap
      tl.to(lh, { x: () => this.endX(lh),  opacity: 0.9, ease: 'power3.inOut' }, 0);
      tl.to(rh, { x: () => -this.endX(rh), opacity: 0.9, ease: 'power3.inOut' }, 0);

      // Chapter cross-fades with y parallax (chapters slide up as they exit, down as they enter)
      tl.to(this.ch1.nativeElement,
        { opacity: 0, y: -8, scale: 0.97, duration: 0.12 }, 0.30);
      tl.fromTo(this.ch2.nativeElement,
        { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.12 }, 0.32);
      tl.to(this.ch2sub.nativeElement,  { opacity: 1, duration: 0.08 }, 0.36);
      tl.to(this.ch2.nativeElement,
        { opacity: 0, y: -8, scale: 0.97, duration: 0.12 }, 0.65);
      tl.to(this.ch2sub.nativeElement,  { opacity: 0, duration: 0.08 }, 0.65);
      tl.fromTo(this.ch3.nativeElement,
        { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.12 }, 0.67);
      tl.to(this.ch3sub.nativeElement,  { opacity: 1, duration: 0.08 }, 0.72);

      // Fade hero headline + subhead UP (transcendent lift) before the finale
      const heroWords = Array.from(document.querySelectorAll<HTMLElement>('.hero-word'));
      const heroSub   = document.querySelector<HTMLElement>('.hero-sub');
      if (heroWords.length) {
        tl.to(heroWords, {
          opacity: 0, y: -20, stagger: 0.02, duration: 0.08, ease: 'power2.in'
        }, 0.70);
      }
      if (heroSub) {
        tl.to(heroSub, { opacity: 0, y: -20, duration: 0.06, ease: 'power2.in' }, 0.70);
      }

      // Glow appears as fingertips approach — then energy-discharge pulse at the hold
      tl.to(this.gapGlow.nativeElement, {
        opacity: 1, scale: 1, ease: 'power3.in', duration: 0.15
      }, 0.82);
      // Pulse: scale bursts 1 → 2 → 1.2 (energy discharge on touch)
      tl.to(this.gapGlow.nativeElement, {
        scale: 2, opacity: 1, ease: 'power4.out', duration: 0.06
      }, 0.90);
      tl.to(this.gapGlow.nativeElement, {
        scale: 1.2, opacity: 0.85, ease: 'sine.inOut', duration: 0.10
      }, 0.96);

      // Fade ch3 as the touch payoff appears
      tl.to([this.ch3.nativeElement, this.ch3sub.nativeElement], {
        opacity: 0, y: -8, duration: 0.08
      }, 0.88);

      // Hands scale slightly at the hold — fingertip touch feels alive
      tl.to([lh, rh], { scale: 1.03, ease: 'power2.out', duration: 0.10 }, 0.90);

      // "Hablemos." / "Let's talk." — emerges from the glow (blur → sharp, green shadow burst)
      tl.to(tw, {
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        textShadow: '0 0 60px rgb(211 222 71 / 0.95), 0 0 120px rgb(211 222 71 / 0.55), 0 0 200px rgb(211 222 71 / 0.25)',
        duration: 0.18,
        ease: 'power3.out',
      }, 0.93);

      // CTA arrow fades in just after the word — signals "tap to go"
      tl.to(ar, { opacity: 1, duration: 0.10, ease: 'power2.out' }, 0.97);

      this.killGsap = () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });
  }

  ngOnDestroy(): void { this.killGsap?.(); }

  scrollToCta(e: Event): void {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  /** X that places the fingertip near the viewport center with NEAR_GAP clearance. */
  private endX(el: HTMLElement): number {
    return window.innerWidth / 2 - this.NEAR_GAP / 2 - el.offsetWidth;
  }

  /** X at scroll = 0: fingertip is 27.5% of vw from center (wide gap). */
  private startX(el: HTMLElement): number {
    return window.innerWidth / 2 - window.innerWidth * 0.275 - el.offsetWidth;
  }

  private applyTouchEndState(): void {
    const lh = this.leftHand?.nativeElement;
    const rh = this.rightHand?.nativeElement;
    if (!lh || !rh || !this.isBrowser) return;

    this.killGsap?.();

    import('gsap').then(({ gsap }) => {
      const endX = this.endX(lh);
      gsap.to(lh, { x: endX,  yPercent: -50, opacity: 1,
                    duration: 0.6, ease: 'back.out(1.7)', overwrite: true });
      gsap.to(rh, { x: -endX, yPercent: -50, opacity: 1,
                    duration: 0.6, ease: 'back.out(1.7)', overwrite: true });
    });
  }
}
