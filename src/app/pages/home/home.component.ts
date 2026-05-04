import { Component } from '@angular/core';
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
    <app-trusted-brands></app-trusted-brands>
    <app-demo></app-demo>
    <app-roi></app-roi>
    <app-work></app-work>
    <app-process></app-process>
    <app-landing-calculator></app-landing-calculator>
    <app-cta></app-cta>
    <app-footer></app-footer>
  `
})
export class HomeComponent {}
