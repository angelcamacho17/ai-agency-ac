import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleAuthor } from './blog.types';

/**
 * Author bio block (T6) — full name, title, years of experience, LinkedIn URL.
 * Rendered on every article so AI engines attribute authorship (E-E-A-T).
 */
@Component({
  selector: 'app-author-bio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="mt-16 border-t border-white/10 pt-8 flex items-start gap-4">
      <div
        class="shrink-0 w-14 h-14 rounded-full bg-neon-green/15 text-neon-green flex items-center justify-center font-bold text-lg"
        aria-hidden="true"
      >
        {{ initials }}
      </div>
      <div>
        <p class="text-text-primary font-semibold">{{ author.name }}</p>
        <p class="text-text-tertiary text-sm">{{ author.title }}</p>
        <p class="text-text-tertiary text-sm mt-1">
          {{ author.experience }} años construyendo software de producción.
        </p>
        <a
          [href]="author.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block mt-2 text-neon-green hover:text-neon-teal text-sm transition-colors"
          >LinkedIn &rarr;</a
        >
      </div>
    </aside>
  `,
})
export class AuthorBioComponent {
  @Input({ required: true }) author!: ArticleAuthor;

  get initials(): string {
    return this.author.name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
