import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMagneticButton]',
  standalone: true
})
export class MagneticButtonDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const button = this.el.nativeElement;
    const rect = button.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Calculate distance from center
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 100;

    if (distance < maxDistance) {
      const strength = 1 - distance / maxDistance;
      const moveX = x * strength * 0.3;
      const moveY = y * strength * 0.3;

      button.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.style.transform = 'translate(0, 0)';
  }
}
