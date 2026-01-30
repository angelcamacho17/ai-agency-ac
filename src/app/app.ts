import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/shared/navigation/navigation.component';
import { Hero } from './components/hero/hero';
import { PhilosophyComponent } from './components/sections/philosophy/philosophy.component';
import { TrustedBrandsComponent } from './components/sections/trusted-brands/trusted-brands.component';
import { RoiComponent } from './components/sections/roi/roi.component';
import { WorkComponent } from './components/sections/work/work.component';
import { ProcessComponent } from './components/sections/process/process.component';
import { StatsComponent } from './components/sections/stats/stats.component';
import { CtaComponent } from './components/sections/cta/cta.component';
import { FooterComponent } from './components/sections/footer/footer.component';
import { CustomCursorDirective } from './directives/custom-cursor.directive';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationComponent,
    Hero,
    PhilosophyComponent,
    TrustedBrandsComponent,
    RoiComponent,
    WorkComponent,
    ProcessComponent,
    StatsComponent,
    CtaComponent,
    FooterComponent,
    CustomCursorDirective
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
