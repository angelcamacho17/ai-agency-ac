import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ParticlesComponent } from '../shared/particles/particles.component';

@Component({
  selector: 'app-hero',
  imports: [ParticlesComponent, TranslatePipe],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {}
