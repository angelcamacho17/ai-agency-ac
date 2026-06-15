import { Directive, ElementRef, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (!this.isBrowser) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            entry.target.classList.add('animate-fade-in-glow');
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-50px'
      }
    );

    this.observer.observe(this.el.nativeElement);

    // Set initial state
    this.el.nativeElement.style.opacity = '0';
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
