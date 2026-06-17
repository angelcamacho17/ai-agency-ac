import { Component, inject } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { Hero } from '../../components/hero/hero';
import { TrustedBrandsComponent } from '../../components/sections/trusted-brands/trusted-brands.component';
import { DemoSectionComponent } from '../../components/sections/demo/demo.component';
import { RoiComponent } from '../../components/sections/roi/roi.component';
import { WorkComponent } from '../../components/sections/work/work.component';
import { ProcessComponent } from '../../components/sections/process/process.component';
import { LandingCalculatorComponent } from '../../components/sections/calculator/calculator.component';
import { CtaComponent } from '../../components/sections/cta/cta.component';
import { FooterComponent } from '../../components/sections/footer/footer.component';
import { HandsScrollComponent } from '../../components/effects/hands-scroll/hands-scroll.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Hero,
    TrustedBrandsComponent,
    DemoSectionComponent,
    RoiComponent,
    WorkComponent,
    ProcessComponent,
    LandingCalculatorComponent,
    CtaComponent,
    FooterComponent,
    HandsScrollComponent
  ],
  template: `
    <app-hands-scroll></app-hands-scroll>
    <app-hero></app-hero>
    <app-demo></app-demo>
    <app-roi></app-roi>
    <app-work></app-work>
    <app-process></app-process>
    <app-landing-calculator></app-landing-calculator>
    <app-trusted-brands></app-trusted-brands>
    <app-cta></app-cta>
    <app-footer></app-footer>
  `
})
export class HomeComponent {
  private readonly seo = inject(SeoService);

  constructor() {
    const origin = 'https://www.michelangelodevs.com';
    this.seo.apply({
      title: 'AI Agents for Instagram, WhatsApp & Web',
      description:
        'Michelangelo Devs builds production AI agents that answer every message, qualify leads and close sales 24/7 on Instagram, WhatsApp and the web. Deployed in about five days.',
      keywords:
        'ai agents, ai sales agent, instagram automation, whatsapp automation, ai chatbot, business automation, michelangelo devs',
      path: '/',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Michelangelo Devs',
          url: origin,
          logo: `${origin}/logo_white.png`,
          description:
            'We build production AI agents and automation for sales and support on Instagram, WhatsApp and the web.',
          sameAs: [
            'https://www.instagram.com/michelangelo.devs',
            'https://www.linkedin.com/company/michelangelodevs',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'sales',
            email: 'contact@michelangelodevs.com',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Michelangelo Devs',
          url: origin,
        },
      ],
    });
  }
}
