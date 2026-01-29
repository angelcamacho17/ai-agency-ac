import { Component } from '@angular/core';
import { NebulaBackgroundComponent } from '../shared/nebula-background/nebula-background.component';
import { ParticlesComponent } from '../shared/particles/particles.component';
import { MagneticButtonDirective } from '../../directives/magnetic-button.directive';

@Component({
  selector: 'app-hero',
  imports: [NebulaBackgroundComponent, ParticlesComponent, MagneticButtonDirective],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {}
