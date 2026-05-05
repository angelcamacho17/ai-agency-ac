import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ScrollRevealDirective, TranslatePipe],
  template: `
    <section id="demo" class="relative py-16 md:py-32 overflow-hidden bg-dark-950">
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full opacity-15 pointer-events-none"
        style="background: radial-gradient(circle, rgb(var(--brand-rgb) / 0.163) 0%, transparent 60%); filter: blur(120px)"
      ></div>

      <div class="relative z-10 max-w-5xl mx-auto px-6">
        <h2
          appScrollReveal
          class="text-4xl md:text-5xl font-bold text-center text-text-primary mb-4 text-glow-green"
        >
          {{ 'demo.title' | translate }}
        </h2>
        <p
          appScrollReveal
          class="text-lg text-text-secondary text-center mb-8 md:mb-16 max-w-2xl mx-auto"
        >
          {{ 'demo.subtitle' | translate }}
        </p>

        <div
          appScrollReveal
          class="demo-frame relative mx-auto w-full max-w-4xl rounded-2xl overflow-hidden border border-neon-green/30 shadow-glow-green"
          style="aspect-ratio: 16 / 9;"
        >
          <iframe
            [src]="embedUrl"
            title="Demo de agente AI Michelangelo"
            allow="fullscreen"
            frameborder="0"
            loading="lazy"
            class="absolute inset-0 w-full h-full"
          ></iframe>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .demo-frame {
      box-shadow: 0 0 50px rgb(var(--brand-rgb) / 0.163), 0 20px 60px rgba(0, 0, 0, 0.4);
    }

    .play-icon {
      box-shadow: 0 0 40px rgb(var(--brand-rgb) / 0.423);
    }
  `]
})
export class DemoSectionComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly embedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.loom.com/embed/46eb3f85d63b4058bd629747f3b34c80'
  );
}
