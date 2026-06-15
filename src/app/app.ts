import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
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
export class App {
  private readonly router = inject(Router);
  private readonly currentUrl = signal<string>(this.router.url);

  // Hide the global nav on routes that ship their own top bar (the terminal
  // experience and the links page). The scrollable home ('/') uses it.
  readonly showNav = computed(() => {
    const url = this.currentUrl();
    const path = url.split('?')[0];
    return !path.startsWith('/terminal') && !path.startsWith('/links');
  });

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.currentUrl.set(e.urlAfterRedirects));
  }
}
