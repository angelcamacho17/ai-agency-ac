import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-roi',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-dark-900 text-text-secondary pt-32 pb-24 px-6">
      <div class="max-w-5xl mx-auto">
        <a routerLink="/" class="inline-block mb-8 text-neon-green hover:text-neon-teal transition-colors duration-300">&larr; Volver al inicio</a>

        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-6xl font-bold text-text-primary mb-4 tracking-tight">
            Calculadora de <span class="text-neon-green">ROI</span>
          </h1>
          <p class="text-lg md:text-xl text-text-tertiary max-w-2xl mx-auto">
            Descubre en cuánto tiempo recuperas la inversión del agente de IA y cuánto más ganarías al cierre del año.
          </p>
          <div class="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/30">
            <span class="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
            <span class="text-sm text-neon-green font-medium">Inversión única: $1,997</span>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Inputs -->
          <div class="bg-dark-800/50 backdrop-blur-glass border border-white/5 rounded-2xl p-8 space-y-8">
            <h2 class="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center text-neon-green">1</span>
              Tus datos
            </h2>

            <div>
              <label class="flex items-center justify-between mb-3 text-text-secondary">
                <span class="font-medium">% de cierre por conversación</span>
                <span class="text-neon-green font-mono font-semibold">{{ closeRate() }}%</span>
              </label>
              <input type="range" min="1" max="100" step="1"
                     [ngModel]="closeRate()" (ngModelChange)="closeRate.set($event)"
                     class="roi-slider w-full" />
              <p class="text-xs text-text-tertiary mt-2">De cada 100 conversaciones atendidas, cuántas terminan en venta.</p>
            </div>

            <div>
              <label class="flex items-center justify-between mb-3 text-text-secondary">
                <span class="font-medium">Conversaciones perdidas al mes</span>
                <span class="text-neon-green font-mono font-semibold">{{ lostConversations() }}</span>
              </label>
              <input type="range" min="0" max="1000" step="10"
                     [ngModel]="lostConversations()" (ngModelChange)="lostConversations.set($event)"
                     class="roi-slider w-full" />
              <p class="text-xs text-text-tertiary mt-2">Mensajes no respondidos o contestados demasiado tarde cada mes.</p>
            </div>

            <div>
              <label class="flex items-center justify-between mb-3 text-text-secondary">
                <span class="font-medium">Ganancia neta promedio por venta</span>
                <span class="text-neon-green font-mono font-semibold">\${{ formatNumber(avgProfit()) }}</span>
              </label>
              <input type="range" min="10" max="5000" step="10"
                     [ngModel]="avgProfit()" (ngModelChange)="avgProfit.set($event)"
                     class="roi-slider w-full" />
              <p class="text-xs text-text-tertiary mt-2">Lo que te queda limpio después de costos por cada cliente cerrado.</p>
            </div>

            <div class="pt-4 border-t border-white/5">
              <label class="flex items-center justify-between mb-3 text-text-secondary">
                <span class="font-medium">% de conversaciones que el agente recuperará</span>
                <span class="text-neon-teal font-mono font-semibold">{{ recoveryRate() }}%</span>
              </label>
              <input type="range" min="10" max="100" step="1"
                     [ngModel]="recoveryRate()" (ngModelChange)="recoveryRate.set($event)"
                     class="roi-slider-teal w-full" />
              <p class="text-xs text-text-tertiary mt-2">Conservador: 70%. El agente responde 24/7 sin dejar pasar leads.</p>
            </div>
          </div>

          <!-- Results -->
          <div class="space-y-6">
            <div class="bg-gradient-to-br from-neon-green/20 to-neon-teal/10 border border-neon-green/30 rounded-2xl p-8 shadow-glow-green">
              <p class="text-sm uppercase tracking-wide text-neon-green font-semibold mb-2">Recuperas la inversión en</p>
              <p class="text-5xl md:text-6xl font-bold text-text-primary mb-2">
                {{ paybackText() }}
              </p>
              <p class="text-text-tertiary text-sm">{{ paybackDetail() }}</p>
            </div>

            <div class="bg-dark-800/50 backdrop-blur-glass border border-white/5 rounded-2xl p-8">
              <p class="text-sm uppercase tracking-wide text-text-tertiary font-semibold mb-6">Desglose mensual</p>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-text-secondary">Conversaciones recuperadas / mes</span>
                  <span class="text-text-primary font-mono font-semibold">{{ formatNumber(recoveredConversations()) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-text-secondary">Ventas extras / mes</span>
                  <span class="text-text-primary font-mono font-semibold">{{ formatNumber(extraSales()) }}</span>
                </div>
                <div class="flex justify-between items-center pt-4 border-t border-white/5">
                  <span class="text-text-secondary">Ganancia extra / mes</span>
                  <span class="text-neon-green font-mono font-bold text-xl">\${{ formatNumber(monthlyProfit()) }}</span>
                </div>
              </div>
            </div>

            <div class="bg-dark-800/50 backdrop-blur-glass border border-neon-teal/30 rounded-2xl p-8">
              <p class="text-sm uppercase tracking-wide text-neon-teal font-semibold mb-2">Ganancia neta al final del año</p>
              <p class="text-4xl md:text-5xl font-bold text-text-primary mb-2">
                \${{ formatNumber(yearlyNetProfit()) }}
              </p>
              <p class="text-text-tertiary text-sm">
                Después de restar la inversión única de $1,997.
              </p>
              <div class="mt-6 pt-6 border-t border-white/5">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-text-tertiary">ROI a 12 meses</span>
                  <span class="text-neon-teal font-mono font-bold">{{ roiPercent() }}x</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-16 text-center">
          <p class="text-text-tertiary mb-6">¿Listo para dejar de perder clientes?</p>
          <a routerLink="/" fragment="contact"
             class="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-neon-green text-dark-900 font-semibold hover:bg-neon-teal transition-colors duration-300 shadow-glow-green">
            Quiero mi agente
            <span>&rarr;</span>
          </a>
        </div>

        <p class="text-center text-xs text-text-tertiary mt-12 max-w-2xl mx-auto">
          * Esta calculadora muestra una proyección estimada basada en los datos que ingresas. Los resultados reales pueden variar según tu industria, audiencia y volumen real de tráfico.
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
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
      background: #10b981;
      cursor: pointer;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
      transition: transform 0.2s ease;
    }

    .roi-slider::-webkit-slider-thumb:hover {
      transform: scale(1.15);
    }

    .roi-slider::-moz-range-thumb {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #10b981;
      cursor: pointer;
      border: none;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
    }

    .roi-slider-teal::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #14b8a6;
      cursor: pointer;
      box-shadow: 0 0 20px rgba(20, 184, 166, 0.6);
      transition: transform 0.2s ease;
    }

    .roi-slider-teal::-webkit-slider-thumb:hover {
      transform: scale(1.15);
    }

    .roi-slider-teal::-moz-range-thumb {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #14b8a6;
      cursor: pointer;
      border: none;
      box-shadow: 0 0 20px rgba(20, 184, 166, 0.6);
    }
  `]
})
export class RoiComponent {
  private readonly AGENT_COST: number = 1997;

  closeRate = signal(25);
  lostConversations = signal(150);
  avgProfit = signal(200);
  recoveryRate = signal(70);

  recoveredConversations = computed(() =>
    Math.round(this.lostConversations() * (this.recoveryRate() / 100))
  );

  extraSales = computed(() =>
    Math.round(this.recoveredConversations() * (this.closeRate() / 100))
  );

  monthlyProfit = computed(() => this.extraSales() * this.avgProfit());

  yearlyNetProfit = computed(() => this.monthlyProfit() * 12 - this.AGENT_COST);

  roiPercent = computed(() => {
    if (this.AGENT_COST === 0) return '0';
    const ratio = (this.monthlyProfit() * 12) / this.AGENT_COST;
    return ratio.toFixed(1);
  });

  paybackText = computed(() => {
    const profit = this.monthlyProfit();
    if (profit <= 0) return '—';
    const months = this.AGENT_COST / profit;
    if (months < 1) {
      const days = Math.max(1, Math.round(months * 30));
      return `${days} día${days === 1 ? '' : 's'}`;
    }
    if (months < 12) {
      const rounded = Math.ceil(months * 10) / 10;
      return `${rounded} mes${rounded === 1 ? '' : 'es'}`;
    }
    const years = (months / 12).toFixed(1);
    return `${years} años`;
  });

  paybackDetail = computed(() => {
    const profit = this.monthlyProfit();
    if (profit <= 0) {
      return 'Ajusta los parámetros para ver tu proyección.';
    }
    return `Con una ganancia extra de $${this.formatNumber(profit)} al mes.`;
  });

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  }
}
