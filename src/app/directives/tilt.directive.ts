import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  NgZone,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * 3D perspective tilt that tracks the pointer across the host element, for the
 * cosmic glassmorphism cards. Moving the mouse rotates the card toward the
 * cursor and shifts a `--tilt-glare` highlight; leaving springs it back flat.
 *
 * Usage: <div appTilt [tiltMax]="10"> ... </div>
 * SSR-safe, runs outside Angular (no change detection on mousemove), and is
 * disabled for touch and prefers-reduced-motion.
 */
@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective implements OnInit, OnDestroy {
  /** Max rotation in degrees on each axis. */
  @Input() tiltMax = 9;
  /** Lift toward the viewer on hover (px). */
  @Input() tiltLift = 6;

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private rafId?: number;
  private enabled = false;

  private readonly onMove = (e: MouseEvent) => {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = undefined;
      const node = this.el.nativeElement;
      const rect = node.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;  // 0..1
      const py = (e.clientY - rect.top) / rect.height;  // 0..1
      const rotY = (px - 0.5) * 2 * this.tiltMax;
      const rotX = -(py - 0.5) * 2 * this.tiltMax;
      node.style.setProperty('--tilt-x', `${rotX.toFixed(2)}deg`);
      node.style.setProperty('--tilt-y', `${rotY.toFixed(2)}deg`);
      node.style.setProperty('--tilt-glare-x', `${(px * 100).toFixed(1)}%`);
      node.style.setProperty('--tilt-glare-y', `${(py * 100).toFixed(1)}%`);
    });
  };

  private readonly onEnter = () => {
    this.el.nativeElement.style.setProperty('--tilt-lift', `${this.tiltLift}px`);
  };

  private readonly onLeave = () => {
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = undefined; }
    const node = this.el.nativeElement;
    node.style.setProperty('--tilt-x', '0deg');
    node.style.setProperty('--tilt-y', '0deg');
    node.style.setProperty('--tilt-lift', '0px');
  };

  ngOnInit(): void {
    if (!this.isBrowser) return;
    const touch = window.matchMedia('(hover: none)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (touch || reduced) return;
    this.enabled = true;

    const node = this.el.nativeElement;
    node.classList.add('tilt-host');
    this.zone.runOutsideAngular(() => {
      node.addEventListener('mousemove', this.onMove, { passive: true });
      node.addEventListener('mouseenter', this.onEnter, { passive: true });
      node.addEventListener('mouseleave', this.onLeave, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser || !this.enabled) return;
    const node = this.el.nativeElement;
    node.removeEventListener('mousemove', this.onMove);
    node.removeEventListener('mouseenter', this.onEnter);
    node.removeEventListener('mouseleave', this.onLeave);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
