import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/shared/navigation/navigation.component';
import { CustomCursorDirective } from './directives/custom-cursor.directive';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationComponent,
    CustomCursorDirective
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
