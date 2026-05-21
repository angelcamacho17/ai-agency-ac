import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';

export type LinkIcon = 'whatsapp' | 'instagram' | 'mail' | 'cash' | 'roi' | 'slash';

interface LinkItem {
  icon: LinkIcon;
  title: string;
  sub: string;
  href: string;
  external?: boolean;
  command?: string;
}

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinksComponent {
  readonly lang = inject(LanguageService);
  private readonly router = inject(Router);

  get isES(): boolean {
    return this.lang.current() === 'es';
  }

  get social(): LinkItem[] {
    const es = this.isES;
    return [
      {
        icon: 'whatsapp',
        title: 'whatsapp.us',
        sub: es ? 'Chatea con nosotros · respondemos rápido' : 'Chat with us · we reply fast',
        href: 'https://wa.me/584125671953?text=' + encodeURIComponent(es ? 'Hola, quiero saber más sobre michelangelo.devs' : 'Hi, I want to know more about michelangelo.devs'),
        external: true,
      },
      {
        icon: 'instagram',
        title: 'instagram.dm → @michelangelo.devs',
        sub: es ? 'El agente responde 24/7' : 'The agent replies 24/7',
        href: 'https://ig.me/m/michelangelo.devs',
        external: true,
      },
      {
        icon: 'instagram',
        title: 'instagram → @michelangelo.devs',
        sub: es ? 'Detrás de cámaras + lanzamientos' : 'Behind the scenes + launches',
        href: 'https://instagram.com/michelangelo.devs',
        external: true,
      },
      {
        icon: 'cash',
        title: 'book.call → 30min',
        sub: es ? 'Calendly · agenda un horario' : 'Calendly · pick a slot',
        href: 'https://calendly.com/angel-camacho-michelangelodevs/30min',
        external: true,
      },
      {
        icon: 'mail',
        title: 'mail.us → angel.camacho@michelangelodevs.com',
        sub: es ? 'Para briefs y NDAs' : 'For briefs and NDAs',
        href: 'mailto:angel.camacho@michelangelodevs.com',
        external: true,
      },
    ];
  }

  get sections(): LinkItem[] {
    const es = this.isES;
    return [
      {
        icon: 'slash',
        title: '/agents',
        sub: es ? 'Demo + agentes que desplegamos' : 'Demo + agents we deploy',
        href: '/#/?cmd=agents',
        command: 'agents',
      },
      {
        icon: 'slash',
        title: '/pricing',
        sub: es ? 'Calculadora ROI + rangos' : 'ROI calculator + ranges',
        href: '/#/?cmd=pricing',
        command: 'pricing',
      },
      {
        icon: 'roi',
        title: '/roi',
        sub: es ? 'Calculadora de impacto autónoma' : 'Standalone impact calculator',
        href: '/#/roi',
        external: false,
      },
      {
        icon: 'slash',
        title: '/process',
        sub: es ? 'Cómo lanzamos en 5 días' : 'How we ship in 5 days',
        href: '/#/?cmd=process',
        command: 'process',
      },
      {
        icon: 'slash',
        title: '/work',
        sub: es ? 'Clientes y marcas' : 'Clients and brands',
        href: '/#/?cmd=work',
        command: 'work',
      },
      {
        icon: 'slash',
        title: '/philosophy',
        sub: es ? 'Por qué construimos como construimos' : 'Why we build the way we build',
        href: '/#/?cmd=philosophy',
        command: 'philosophy',
      },
      {
        icon: 'slash',
        title: '/contact',
        sub: es ? 'Ponte en contacto' : 'Get in touch',
        href: '/#/?cmd=contact',
        command: 'contact',
      },
    ];
  }

  readonly iconArt: Record<LinkIcon, string> = {
    whatsapp:  '╭─◔─╮\n│ ╮ │\n╰─v─╯',
    instagram: '╭───╮\n│ ◉ │\n╰─•─╯',
    mail:      '╭───╮\n│ @ │\n╰───╯',
    cash:      '╭───╮\n│ $ │\n╰───╯',
    roi:       '╭───╮\n│ % │\n╰───╯',
    slash:     '╭───╮\n│ / │\n╰───╯',
  };

  onSection(item: LinkItem, e: MouseEvent): void {
    if (!item.command) return;
    e.preventDefault();
    this.router.navigate(['/'], { queryParams: { cmd: item.command } });
  }

  toggleLang(): void {
    this.lang.toggle();
  }

  goHome(e: MouseEvent): void {
    e.preventDefault();
    this.router.navigateByUrl('/');
  }
}
