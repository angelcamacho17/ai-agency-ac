import { Directive, ElementRef, HostListener, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCustomCursor]',
  standalone: true
})
export class CustomCursorDirective implements OnInit, OnDestroy {
  private cursor!: HTMLElement;
  private mouseX = 0;
  private mouseY = 0;
  private animationFrame?: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Only enable on desktop
    if (window.innerWidth >= 1024) {
      this.createCursor();
      this.hideCursor();
    }
  }

  private createCursor() {
    this.cursor = this.renderer.createElement('div');
    this.renderer.addClass(this.cursor, 'custom-cursor-glow');
    this.renderer.setStyle(this.cursor, 'position', 'fixed');
    this.renderer.setStyle(this.cursor, 'width', '20px');
    this.renderer.setStyle(this.cursor, 'height', '20px');
    this.renderer.setStyle(this.cursor, 'border-radius', '50%');
    this.renderer.setStyle(this.cursor, 'pointer-events', 'none');
    this.renderer.setStyle(this.cursor, 'mix-blend-mode', 'screen');
    this.renderer.setStyle(this.cursor, 'filter', 'blur(10px)');
    this.renderer.setStyle(this.cursor, 'z-index', '9999');
    this.renderer.setStyle(this.cursor, 'background', 'radial-gradient(circle, rgba(16, 185, 129, 0.8) 0%, transparent 70%)');
    this.renderer.setStyle(this.cursor, 'transition', 'width 0.3s, height 0.3s');
    this.renderer.setStyle(this.cursor, 'transform', 'translate(-50%, -50%)');

    this.renderer.appendChild(document.body, this.cursor);
  }

  private hideCursor() {
    this.renderer.setStyle(document.body, 'cursor', 'none');
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (window.innerWidth >= 1024 && this.cursor) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (!this.animationFrame) {
        this.animationFrame = requestAnimationFrame(() => this.updateCursorPosition());
      }
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.cursor) {
      this.renderer.setStyle(this.cursor, 'width', '40px');
      this.renderer.setStyle(this.cursor, 'height', '40px');
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.cursor) {
      this.renderer.setStyle(this.cursor, 'width', '20px');
      this.renderer.setStyle(this.cursor, 'height', '20px');
    }
  }

  private updateCursorPosition() {
    if (this.cursor) {
      this.renderer.setStyle(this.cursor, 'left', `${this.mouseX}px`);
      this.renderer.setStyle(this.cursor, 'top', `${this.mouseY}px`);
    }
    this.animationFrame = undefined;
  }

  ngOnDestroy() {
    if (this.cursor) {
      this.renderer.removeChild(document.body, this.cursor);
      this.renderer.setStyle(document.body, 'cursor', 'auto');
    }
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}
