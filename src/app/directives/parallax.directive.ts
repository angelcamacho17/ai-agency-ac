import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Lightweight scroll parallax. Drives the `--parallax-y` CSS var on the host
 * (see styles.scss `[data-parallax]`) from the element's position in the
 * viewport, so the element drifts slower/faster than the page for depth.
 *
 * Usage: <div appParallax [parallaxSpeed]="0.12" data-parallax> ... </div>
 * speed = fraction of the element's viewport travel applied as offset.
 * SSR-safe and respects prefers-reduced-motion (CSS disables the transform).
 */
@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements OnInit, OnDestroy {
  /** Drift strength. Positive = moves up as you scroll down. */
  @Input() parallaxSpeed = 0.12;
  /** Clamp the travel so elements never drift too far. */
  @Input() parallaxMax = 80;

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private rafId?: number;

  private readonly onScroll = () => {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = undefined;
      const node = this.el.nativeElement;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 (below) .. 1 (above) relative to viewport center.
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const shift = Math.max(
        -this.parallaxMax,
        Math.min(this.parallaxMax, progress * -this.parallaxSpeed * vh)
      );
      node.style.setProperty('--parallax-y', `${shift.toFixed(1)}px`);
    });
  };

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.el.nativeElement.setAttribute('data-parallax', '');
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    window.removeEventListener('scroll', this.onScroll);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
