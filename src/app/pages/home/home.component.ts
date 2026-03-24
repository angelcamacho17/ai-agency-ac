import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { PhilosophyComponent } from '../../components/sections/philosophy/philosophy.component';
import { TrustedBrandsComponent } from '../../components/sections/trusted-brands/trusted-brands.component';
import { RoiComponent } from '../../components/sections/roi/roi.component';
import { WorkComponent } from '../../components/sections/work/work.component';
import { ProcessComponent } from '../../components/sections/process/process.component';
import { CtaComponent } from '../../components/sections/cta/cta.component';
import { FooterComponent } from '../../components/sections/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Hero,
    PhilosophyComponent,
    TrustedBrandsComponent,
    RoiComponent,
    WorkComponent,
    ProcessComponent,
    CtaComponent,
    FooterComponent
  ],
  template: `
    <app-hero></app-hero>
    <app-philosophy></app-philosophy>
    <app-trusted-brands></app-trusted-brands>
    <app-roi></app-roi>
    <app-work></app-work>
    <app-process></app-process>
    <app-cta></app-cta>
    <app-footer></app-footer>
  `
})
export class HomeComponent {}
