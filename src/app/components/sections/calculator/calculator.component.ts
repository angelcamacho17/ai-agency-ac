import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';
import { RoiCalculatorService } from '../../../services/roi-calculator.service';

@Component({
  selector: 'app-landing-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ScrollRevealDirective, TranslatePipe],
  template: `
    <section id="calculadora" class="relative py-16 md:py-32 overflow-hidden bg-dark-900">
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] rounded-full opacity-15 pointer-events-none"
        style="background: radial-gradient(circle, rgb(var(--brand-rgb) / 0.163) 0%, transparent 70%); filter: blur(120px)"
      ></div>

      <div class="relative z-10 max-w-5xl mx-auto px-6">
        <h2
          appScrollReveal
          class="text-4xl md:text-5xl font-bold text-center text-text-primary mb-4"
        >
          {{ 'calculator.titleStart' | translate }}
          <span class="text-neon-green text-glow-green">{{ 'calculator.titleAccent' | translate }}</span>
        </h2>
        <p
          appScrollReveal
          class="text-lg text-text-secondary text-center mb-8 md:mb-16 max-w-2xl mx-auto"
        >
          {{ 'calculator.subtitle' | translate }}
        </p>

        <div class="grid lg:grid-cols-2 gap-8">
          <div appScrollReveal class="bg-dark-800/50 backdrop-blur-glass border border-white/5 rounded-2xl p-8 space-y-8">
            <h3 class="text-xl font-semibold text-text-primary flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center text-neon-green text-sm">1</span>
              {{ 'calculator.yourData' | translate }}
            </h3>

            <div>
              <label class="flex items-center justify-between mb-3 text-text-secondary">
                <span class="font-medium">{{ 'calculator.closeRate' | translate }}</span>
                <div class="flex items-center gap-1">
                  <input type="number" min="1" max="100" step="1"
                         [ngModel]="closeRate()" (ngModelChange)="setCloseRate($event)"
                         class="roi-input w-16" />
                  <span class="text-neon-green font-mono font-semibold">%</span>
                </div>
              </label>
              <input type="range" min="1" max="100" step="1"
                     [ngModel]="closeRate()" (ngModelChange)="closeRate.set($event)"
                     class="roi-slider w-full" />
              <p class="text-xs text-text-tertiary mt-2">{{ 'calculator.closeRateHint' | translate }}</p>
            </div>

            <div>
              <label class="flex items-center justify-between mb-3 text-text-secondary">
                <span class="font-medium">{{ 'calculator.lostConv' | translate }}</span>
                <input type="number" min="0" max="1000000" step="1"
                       [ngModel]="lostConversations()" (ngModelChange)="setLostConversations($event)"
                       class="roi-input w-28" />
              </label>
              <input type="range" min="0" max="1000000" step="100"
                     [ngModel]="lostConversations()" (ngModelChange)="lostConversations.set($event)"
                     class="roi-slider w-full" />
              <p class="text-xs text-text-tertiary mt-2">{{ 'calculator.lostConvHint' | translate }}</p>
            </div>

            <div>
              <label class="flex items-center justify-between mb-3 text-text-secondary">
                <span class="font-medium">{{ 'calculator.avgProfit' | translate }}</span>
                <div class="flex items-center gap-1">
                  <span class="text-neon-green font-mono font-semibold">$</span>
                  <input type="number" min="10" max="100000" step="1"
                         [ngModel]="avgProfit()" (ngModelChange)="setAvgProfit($event)"
                         class="roi-input w-24" />
                </div>
              </label>
              <input type="range" min="10" max="5000" step="10"
                     [ngModel]="avgProfit()" (ngModelChange)="avgProfit.set($event)"
                     class="roi-slider w-full" />
              <p class="text-xs text-text-tertiary mt-2">{{ 'calculator.avgProfitHint' | translate }}</p>
            </div>

            <div class="pt-4 border-t border-white/5">
              <label class="flex items-center justify-between mb-3 text-text-secondary">
                <span class="font-medium">{{ 'calculator.recoveryRate' | translate }}</span>
                <div class="flex items-center gap-1">
                  <input type="number" min="10" max="100" step="1"
                         [ngModel]="recoveryRate()" (ngModelChange)="setRecoveryRate($event)"
                         class="roi-input w-16" />
                  <span class="text-neon-teal font-mono font-semibold">%</span>
                </div>
              </label>
              <input type="range" min="10" max="100" step="1"
                     [ngModel]="recoveryRate()" (ngModelChange)="recoveryRate.set($event)"
                     class="roi-slider-teal w-full" />
              <p class="text-xs text-text-tertiary mt-2">{{ 'calculator.recoveryRateHint' | translate }}</p>
            </div>
          </div>

          <div class="space-y-6">
            <div appScrollReveal class="bg-gradient-to-br from-neon-green/20 to-neon-teal/10 border border-neon-green/30 rounded-2xl p-8 shadow-glow-green">
              <p class="text-sm uppercase tracking-wide text-neon-green font-semibold mb-2">{{ 'calculator.paybackTitle' | translate }}</p>
              <p class="text-5xl md:text-6xl font-bold text-text-primary mb-2">
                {{ paybackText() }}
              </p>
              <p class="text-text-tertiary text-sm">
                {{ 'calculator.paybackHelp' | translate }}
              </p>
            </div>

            <div appScrollReveal class="bg-dark-800/50 backdrop-blur-glass border border-white/5 rounded-2xl p-8">
              <p class="text-sm uppercase tracking-wide text-text-tertiary font-semibold mb-6">{{ 'calculator.monthlyTitle' | translate }}</p>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-text-secondary">{{ 'calculator.monthlyConv' | translate }}</span>
                  <span class="text-text-primary font-mono font-semibold">{{ formatNumber(recoveredConversations()) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-text-secondary">{{ 'calculator.monthlySales' | translate }}</span>
                  <span class="text-text-primary font-mono font-semibold">{{ formatNumber(extraSales()) }}</span>
                </div>
                <div class="flex justify-between items-center pt-4 border-t border-white/5">
                  <span class="text-text-secondary">{{ 'calculator.monthlyProfit' | translate }}</span>
                  <span class="text-neon-green font-mono font-bold text-xl">\${{ formatNumber(monthlyProfit()) }}</span>
                </div>
              </div>
            </div>

            <div appScrollReveal class="bg-dark-800/50 backdrop-blur-glass border border-neon-teal/30 rounded-2xl p-8">
              <p class="text-sm uppercase tracking-wide text-neon-teal font-semibold mb-2">{{ 'calculator.yearlyTitle' | translate }}</p>
              <p class="text-4xl md:text-5xl font-bold text-text-primary mb-2">
                \${{ formatNumber(yearlyProfit()) }}
              </p>
              <p class="text-text-tertiary text-sm">
                {{ 'calculator.yearlyHelp' | translate }}
              </p>
            </div>
          </div>
        </div>

        <div appScrollReveal class="mt-12 text-center">
          <a href="#contact"
             class="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-neon-green text-dark-900 font-semibold hover:bg-neon-teal transition-colors duration-300 shadow-glow-green">
            {{ 'calculator.ctaButton' | translate }}
            <span>&rarr;</span>
          </a>
        </div>

        <p class="text-center text-xs text-text-tertiary mt-12 max-w-2xl mx-auto">
          {{ 'calculator.disclaimer' | translate }}
        </p>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .roi-input {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 0.5rem;
      padding: 0.25rem 0.5rem;
      color: rgb(var(--brand-rgb));
      font-family: ui-monospace, monospace;
      font-weight: 600;
      font-size: 0.875rem;
      text-align: right;
      outline: none;
      transition: border-color 0.2s ease;
      -moz-appearance: textfield;
    }

    .roi-input::-webkit-outer-spin-button,
    .roi-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .roi-input:focus {
      border-color: rgb(var(--brand-rgb) / 0.39);
      box-shadow: 0 0 12px rgb(var(--brand-rgb) / 0.13);
    }

    .roi-slider,
    .roi-slider-teal {
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.08);
      outline: none;
    }

    .roi-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgb(var(--brand-rgb));
      cursor: pointer;
      box-shadow: 0 0 20px rgb(var(--brand-rgb) / 0.39);
      transition: transform 0.2s ease;
    }

    .roi-slider::-webkit-slider-thumb:hover {
      transform: scale(1.15);
    }

    .roi-slider::-moz-range-thumb {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgb(var(--brand-rgb));
      cursor: pointer;
      border: none;
      box-shadow: 0 0 20px rgb(var(--brand-rgb) / 0.39);
    }

    .roi-slider-teal::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgb(var(--accent-rgb));
      cursor: pointer;
      box-shadow: 0 0 20px rgb(var(--accent-rgb) / 0.39);
      transition: transform 0.2s ease;
    }

    .roi-slider-teal::-webkit-slider-thumb:hover {
      transform: scale(1.15);
    }

    .roi-slider-teal::-moz-range-thumb {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgb(var(--accent-rgb));
      cursor: pointer;
      border: none;
      box-shadow: 0 0 20px rgb(var(--accent-rgb) / 0.39);
    }
  `]
})
export class LandingCalculatorComponent {
  private readonly calc = inject(RoiCalculatorService);
  private readonly LANDING_BUNDLE_INVESTMENT = 1997;

  closeRate = signal(15);
  lostConversations = signal(150);
  avgProfit = signal(200);
  recoveryRate = signal(70);

  private inputs = computed(() => ({
    closeRate: this.closeRate(),
    lostConversations: this.lostConversations(),
    avgProfit: this.avgProfit(),
    recoveryRate: this.recoveryRate()
  }));

  setCloseRate(val: number): void {
    this.closeRate.set(Math.min(100, Math.max(1, Math.round(val || 0))));
  }
  setLostConversations(val: number): void {
    this.lostConversations.set(Math.min(1000000, Math.max(0, Math.round(val || 0))));
  }
  setAvgProfit(val: number): void {
    this.avgProfit.set(Math.max(1, Math.round(val || 0)));
  }
  setRecoveryRate(val: number): void {
    this.recoveryRate.set(Math.min(100, Math.max(10, Math.round(val || 0))));
  }

  recoveredConversations = computed(() => this.calc.recoveredConversations(this.inputs()));
  extraSales = computed(() => this.calc.extraSales(this.inputs()));
  monthlyProfit = computed(() => this.calc.monthlyProfit(this.inputs()));
  yearlyProfit = computed(() => this.calc.yearlyProfit(this.inputs()));
  paybackText = computed(() => this.calc.paybackText(this.inputs(), this.LANDING_BUNDLE_INVESTMENT));

  formatNumber(value: number): string {
    return this.calc.formatNumber(value);
  }
}
