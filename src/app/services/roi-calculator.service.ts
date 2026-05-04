import { Injectable } from '@angular/core';

export type AgentKey = 'ig' | 'wa' | 'web';

export interface Agent {
  key: AgentKey;
  name: string;
  basePrice: number;
  icon: string;
}

export interface RoiInputs {
  closeRate: number;
  lostConversations: number;
  avgProfit: number;
  recoveryRate: number;
}

export const AGENTS: Agent[] = [
  { key: 'ig', name: 'Agente Instagram', basePrice: 1997, icon: '📸' },
  { key: 'wa', name: 'Agente WhatsApp', basePrice: 2132, icon: '💬' },
  { key: 'web', name: 'Agente Web', basePrice: 1456, icon: '🌐' }
];

@Injectable({ providedIn: 'root' })
export class RoiCalculatorService {
  bundleInvestment(keys: AgentKey[]): number {
    const hasIg = keys.includes('ig');
    const hasWa = keys.includes('wa');
    const hasWeb = keys.includes('web');

    if (hasIg && hasWa && hasWeb) return 4597;
    if (hasIg && hasWa) return 3490;

    let total = 0;
    if (hasIg) total += 1997;
    if (hasWa) total += 2132;
    if (hasWeb) {
      total += (hasIg || hasWa) ? 1456 * 0.7 : 1456;
    }
    return total;
  }

  packageSavings(keys: AgentKey[]): number {
    const fullPrice = keys.reduce((sum, key) => {
      const agent = AGENTS.find(a => a.key === key);
      return sum + (agent?.basePrice ?? 0);
    }, 0);
    return Math.max(0, fullPrice - this.bundleInvestment(keys));
  }

  recoveredConversations(inputs: RoiInputs): number {
    return Math.round(inputs.lostConversations * (inputs.recoveryRate / 100));
  }

  extraSales(inputs: RoiInputs): number {
    return Math.round(this.recoveredConversations(inputs) * (inputs.closeRate / 100));
  }

  monthlyProfit(inputs: RoiInputs): number {
    return this.extraSales(inputs) * inputs.avgProfit;
  }

  yearlyProfit(inputs: RoiInputs): number {
    return this.monthlyProfit(inputs) * 12;
  }

  yearlyNetProfit(inputs: RoiInputs, investment: number): number {
    return this.monthlyProfit(inputs) * 12 - investment;
  }

  roiPercent(inputs: RoiInputs, investment: number): string {
    if (investment === 0) return '0';
    const ratio = (this.monthlyProfit(inputs) * 12) / investment;
    return ratio.toFixed(1);
  }

  paybackText(inputs: RoiInputs, investment: number): string {
    const profit = this.monthlyProfit(inputs);
    if (profit <= 0 || investment <= 0) return '—';
    const months = investment / profit;
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
  }

  paybackDetail(inputs: RoiInputs): string {
    const profit = this.monthlyProfit(inputs);
    if (profit <= 0) {
      return 'Ajusta los parámetros para ver tu proyección.';
    }
    return `Con una ganancia extra de $${this.formatNumber(profit)} al mes.`;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  }
}
