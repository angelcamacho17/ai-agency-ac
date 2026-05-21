import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LanguageService } from '../../services/language.service';

export interface RoiPayload {
  inputs: {
    messagesPerDay: number;
    conversionRate: number;
    avgTicket: number;
  };
  monthlyRevenue: number;
  suggestedTier: 'single' | 'cluster' | 'full';
  tierCost: number;
  paybackWeeks: number | null;
}

/* ----- /agents ----- */
@Component({
  selector: 'tsec-agents',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './terminal-sections.scss',
  template: `
    <div class="tsec">
      <header class="tsec-header">
        <h2 class="tsec-title">{{ es() ? 'Los agentes que desplegamos' : 'AI agents we deploy' }}</h2>
        <p class="tsec-sub">{{ es() ? 'Tres canales. Un cerebro. Cada agente se entrega en menos de 5 días.' : 'Three channels. One brain. Each agent ships in <5 days.' }}</p>
      </header>
      <div class="agents-grid">
        @for (a of agents(); track a.name; let i = $index) {
          <article class="agent-card" [style.animationDelay.ms]="i * 120">
            <div class="agent-card-head">
              <span class="agent-dot"></span>
              <span class="agent-name">{{ a.name }}</span>
              <span class="agent-status">● live</span>
            </div>
            <p class="agent-role">{{ a.role }}</p>
            <ul class="agent-lines">
              @for (l of a.lines; track l) {
                <li><span class="tsec-bullet">→</span>{{ l }}</li>
              }
            </ul>
            <div class="agent-card-foot">
              <div class="agent-stack">
                @for (s of a.stack; track s) { <span class="agent-chip">{{ s }}</span> }
              </div>
              <div class="agent-kpi">{{ a.kpi }}</div>
            </div>
          </article>
        }
      </div>

      <div class="caps-block">
        <div class="caps-head">
          <span class="caps-tag">[{{ es() ? 'capacidades' : 'capabilities' }}]</span>
          <span class="caps-rule"></span>
          <span class="caps-idx">{{ es() ? 'todos los agentes' : 'all agents' }}</span>
        </div>
        <ul class="caps-grid">
          @for (c of capabilities(); track c.k) {
            <li class="cap-item">
              <span class="cap-num">{{ c.k }}</span>
              <div class="cap-body">
                <span class="cap-title">{{ c.title }}</span>
                <span class="cap-sub">{{ c.sub }}</span>
              </div>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
})
export class TsecAgents {
  private readonly lang = inject(LanguageService);
  readonly es = computed(() => this.lang.current() === 'es');

  readonly agents = computed(() =>
    this.es()
      ? [
          {
            name: 'instagram.agent',
            role: 'Cierra desde DMs y comentarios de Instagram',
            stack: ['Claude', 'Meta API', 'n8n'],
            kpi: '+40% conversión',
            lines: [
              'monitorea @inbox 24/7',
              'entiende audios e imágenes que te mandan',
              'clasifica el lead y agenda en tu calendario',
              'escala a un humano si se traba',
            ],
          },
          {
            name: 'whatsapp.agent',
            role: 'Atiende y vende por WhatsApp Business',
            stack: ['Claude', 'WhatsApp Cloud API', 'Gmail'],
            kpi: '< 30s de respuesta',
            lines: [
              'responde en el idioma del cliente (30+)',
              'sigue conversaciones de días sin perder contexto',
              'rutea a ventas / soporte / billing vía Gmail',
              'hace seguimiento automático a leads en frío',
            ],
          },
          {
            name: 'web.agent',
            role: 'Chat en tu sitio + base de conocimiento',
            stack: ['Claude', 'Pinecone', 'Webhook API'],
            kpi: '100% atendidos',
            lines: [
              'conoce todo tu negocio (docs, FAQs, precios)',
              'visualizas las conversaciones en vivo',
              'califica intención y enruta a quien debe',
              'aprende de cada conversación cerrada',
            ],
          },
        ]
      : [
          {
            name: 'instagram.agent',
            role: 'Closes from Instagram DMs and comments',
            stack: ['Claude', 'Meta API', 'n8n'],
            kpi: '+40% conversion',
            lines: [
              'monitors @inbox 24/7',
              'understands voice notes and images you receive',
              'classifies the lead and books in your calendar',
              'escalates to a human when stuck',
            ],
          },
          {
            name: 'whatsapp.agent',
            role: 'Answers and sells through WhatsApp Business',
            stack: ['Claude', 'WhatsApp Cloud API', 'Gmail'],
            kpi: '< 30s reply time',
            lines: [
              "speaks the customer's language (30+)",
              'keeps multi-day conversations in context',
              'routes to sales / support / billing via Gmail',
              'auto-follows up with cold leads',
            ],
          },
          {
            name: 'web.agent',
            role: 'On-site chat backed by your knowledge base',
            stack: ['Claude', 'Pinecone', 'Webhook API'],
            kpi: '100% answered',
            lines: [
              'knows your whole business (docs, FAQs, pricing)',
              'live view of every conversation',
              'scores intent and routes to the right team',
              'learns from every closed conversation',
            ],
          },
        ]
  );

  readonly capabilities = computed(() =>
    this.es()
      ? [
          { k: '01', title: 'IA conversacional',           sub: 'cierra ventas hablando como un humano de tu equipo' },
          { k: '02', title: 'Multilenguaje (30+)',          sub: 'inglés, portugués, español, hebreo, francés, italiano, …' },
          { k: '03', title: 'Entiende audios',             sub: 'transcribe e interpreta notas de voz al instante' },
          { k: '04', title: 'Entiende imágenes',           sub: 'lee fotos, facturas, screenshots y documentos' },
          { k: '05', title: 'Clasificación automática',    sub: 'puntúa cada lead 0–100 según intención de compra' },
          { k: '06', title: 'Seguimiento automatizado',    sub: 'reactiva conversaciones que se enfrían sin perderse' },
          { k: '07', title: 'Escalamiento por Gmail',      sub: 'enruta a ventas / soporte / billing con contexto completo' },
          { k: '08', title: 'Base de conocimiento',        sub: 'todo el dominio del negocio en su memoria' },
          { k: '09', title: 'Visualización en vivo',       sub: 'dashboard con cada conversación al momento' },
          { k: '10', title: 'Respuesta < 30s',             sub: 'sin cola, sin horario, sin excusas' },
          { k: '11', title: 'Aprende de cada cierre',      sub: 'mejora con cada conversación, sin reentrenamiento manual' },
        ]
      : [
          { k: '01', title: 'Conversational AI',           sub: 'closes deals talking like a senior teammate' },
          { k: '02', title: 'Multilingual (30+)',          sub: 'English, Portuguese, Spanish, Hebrew, French, Italian, …' },
          { k: '03', title: 'Understands audio',           sub: 'transcribes and acts on voice notes instantly' },
          { k: '04', title: 'Understands images',          sub: 'reads photos, invoices, screenshots and docs' },
          { k: '05', title: 'Auto lead scoring',           sub: 'rates every lead 0–100 by buying intent' },
          { k: '06', title: 'Auto follow-ups',             sub: 'revives cooling conversations before they die' },
          { k: '07', title: 'Routes via Gmail',            sub: 'hands off to sales / support / billing with full context' },
          { k: '08', title: 'Knowledge base',              sub: 'your whole business domain in its memory' },
          { k: '09', title: 'Live conversation view',      sub: 'dashboard with every chat in real time' },
          { k: '10', title: 'Replies in < 30s',            sub: 'no queue, no business hours, no excuses' },
          { k: '11', title: 'Learns from every win',       sub: 'improves on each closed conversation, no retraining' },
        ]
  );
}

/* ----- /pricing ----- */
@Component({
  selector: 'tsec-pricing',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './terminal-sections.scss',
  template: `
    <div class="tsec">
      <header class="tsec-header">
        <h2 class="tsec-title">{{ es() ? 'Lo que cuesta' : 'What it costs' }}</h2>
        <p class="tsec-sub">{{ es() ? 'No vendemos licencias. Vendemos sistemas funcionando. Rangos abajo — cotización exacta en 24h.' : "We don't sell licences. We sell working systems. Ranges below — exact quote in 24h." }}</p>
      </header>
      <div class="price-grid">
        @for (t of tiers(); track t.name) {
          <article class="price-card" [class.price-card-featured]="t.featured">
            @if (t.featured) { <div class="price-card-flag">{{ es() ? 'más elegido' : 'most picked' }}</div> }
            <div class="price-card-name">{{ t.name }}</div>
            <p class="price-card-blurb">{{ t.blurb }}</p>
            <div class="price-card-amount">
              <span class="price-card-from">{{ es() ? 'desde' : 'from' }}</span>
              <span class="price-card-value">{{ t.from }}</span>
            </div>
            <ul class="price-card-lines">
              @for (l of t.lines; track l) { <li><span class="tsec-bullet">+</span>{{ l }}</li> }
            </ul>
            <div class="price-card-payback">
              <span>{{ es() ? 'recuperación' : 'payback' }}</span>
              <strong>{{ t.payback }}</strong>
            </div>
          </article>
        }
      </div>
      <p class="price-foot">
        {{ es() ? '* Todos los builds incluyen código fuente, deploy y 30 días de ajuste. Hosting y tokens LLM se facturan al costo.' : '* All builds include source code, deploy, and a 30-day tuning window. Hosting + LLM tokens billed at cost.' }}
      </p>
    </div>
  `,
})
export class TsecPricing {
  private readonly lang = inject(LanguageService);
  readonly es = computed(() => this.lang.current() === 'es');
  readonly tiers = computed(() =>
    this.es()
      ? [
          { name: 'single.agent', blurb: 'Un agente. Un canal. Lanzado en 5 días.', from: '$1.8k', payback: '≈ 3–6 semanas', lines: ['1 caso de uso', '1 canal (DM / web / WA)', '30 días de tuning'] },
          { name: 'agent.cluster', blurb: 'Sistema multi-agente en tu funnel.', from: '$4.5k', payback: '≈ 4–8 semanas', featured: true, lines: ['2–4 agentes cooperando', 'CRM + analítica', '60 días tuning + revisión mensual'] },
          { name: 'full.build', blurb: 'Web app + agentes + automatizaciones, todo.', from: 'hablemos', payback: 'custom', lines: ['UI / dashboard a medida', 'Herramientas internas + APIs', 'Retainer o scope fijo'] },
        ]
      : [
          { name: 'single.agent', blurb: 'One agent. One channel. Shipped in 5 days.', from: '$1.8k', payback: '≈ 3–6 weeks', lines: ['1 use-case', '1 channel (DM / web / WA)', '30-day tuning window'] },
          { name: 'agent.cluster', blurb: 'Multi-agent system across your funnel.', from: '$4.5k', payback: '≈ 4–8 weeks', featured: true, lines: ['2–4 cooperating agents', 'CRM + analytics', '60-day tuning + monthly review'] },
          { name: 'full.build', blurb: 'Web app + agents + automations, end-to-end.', from: 'talk to us', payback: 'custom', lines: ['Custom UI / dashboard', 'Internal tools + APIs', 'Retainer or fixed scope'] },
        ]
  );
}

/* ----- /process ----- */
@Component({
  selector: 'tsec-process',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './terminal-sections.scss',
  template: `
    <div class="tsec">
      <header class="tsec-header">
        <h2 class="tsec-title">{{ es() ? '5 días. De onboarding a producción.' : '5 days. Onboard to live.' }}</h2>
        <p class="tsec-sub">{{ es() ? 'Sin trimestres de discovery. Cada día tiene un entregable.' : "We don't do quarter-long discovery phases. Pick the day, get the deliverable." }}</p>
      </header>
      <ol class="process-timeline">
        @for (s of steps(); track s.day; let i = $index) {
          <li class="process-step" [style.animationDelay.ms]="i * 140">
            <div class="process-rail">
              <span class="process-node">0{{ i + 1 }}</span>
            </div>
            <div class="process-meta">
              <span class="process-day">{{ s.day }}</span>
              <h3 class="process-title">{{ s.title }}</h3>
              <p class="process-body">{{ s.body }}</p>
            </div>
          </li>
        }
      </ol>
    </div>
  `,
})
export class TsecProcess {
  private readonly lang = inject(LanguageService);
  readonly es = computed(() => this.lang.current() === 'es');
  readonly steps = computed(() =>
    this.es()
      ? [
          { day: 'Día 1', title: 'Onboarding', body: 'Aprendemos tu negocio, metas y conectamos tus canales.' },
          { day: 'Día 2–3', title: 'Setup & build', body: 'El agente recibe tu voz, datos y lógica de ventas. Construimos en vivo.' },
          { day: 'Día 4', title: 'Test real', body: 'Lo rompes con escenarios reales. Ajustamos hasta que cierre como tú.' },
          { day: 'Día 5', title: 'Ship a prod', body: 'En línea, 24/7, con dashboards. Luego 30 días de tuning gratis.' },
        ]
      : [
          { day: 'Day 1', title: 'Onboarding', body: 'We learn your business, set the goals, connect your channels.' },
          { day: 'Day 2–3', title: 'Setup & build', body: 'Agent gets your voice, your data, your sales logic. We build in the open.' },
          { day: 'Day 4', title: 'Test in the wild', body: "You break it with real scenarios. We tune until it closes like you would." },
          { day: 'Day 5', title: 'Ship to prod', body: 'Live, 24/7, with dashboards. Then 30 days of free fine-tuning.' },
        ]
  );
}

/* ----- /work ----- */
@Component({
  selector: 'tsec-work',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './terminal-sections.scss',
  template: `
    <div class="tsec">
      <header class="tsec-header">
        <h2 class="tsec-title">{{ es() ? 'Lanzado — y corriendo' : 'Shipped — and still running' }}</h2>
        <p class="tsec-sub">{{ es() ? 'Equipos que confían en nosotros con sus operaciones AI ahora mismo.' : 'A few teams trusting us with their AI ops right now.' }}</p>
      </header>
      <div class="brands-grid">
        @for (c of clients(); track c.name; let i = $index) {
          <figure class="brand-card" [style.animationDelay.ms]="i * 90">
            <div class="brand-logo-wrap">
              <img [src]="c.file" [alt]="c.name" class="brand-logo" />
            </div>
            <figcaption class="brand-caption">
              <span class="brand-name">{{ c.name }}</span>
              <span class="brand-note">{{ c.note }}</span>
            </figcaption>
          </figure>
        }
      </div>
    </div>
  `,
})
export class TsecWork {
  private readonly lang = inject(LanguageService);
  readonly es = computed(() => this.lang.current() === 'es');
  readonly clients = computed(() => {
    const es = this.es();
    return [
      { name: 'Amplify',          file: 'brands/amplify_white_transparent.png',        note: es ? 'DM concierge + booking' : 'DM concierge + booking agent' },
      { name: 'AR Studio',        file: 'brands/ar_studio_white_transparent.png',      note: es ? 'Lead-routing automatizado' : 'Lead-routing automations' },
      { name: 'Axial',            file: 'brands/axial_white_transparent.png',          note: es ? 'Dashboard de ops interno' : 'Internal ops dashboard' },
      { name: 'Safaera',          file: 'brands/safaera_icon_white_transparent.png',   note: es ? 'Chat con voz de marca' : 'Brand-voice chat agent' },
      { name: 'Terraccotta VIP',  file: 'brands/terraccotta_vip.png',                  note: es ? 'Reservas y atención 24/7' : '24/7 bookings + support' },
      { name: 'Turismo de Playa', file: 'brands/turismodeplaya_white_transparent.png', note: es ? 'Reservas 24/7' : '24/7 reservations agent' },
      { name: 'Viajes Premiere',  file: 'brands/viajes_premiere.png',                  note: es ? 'Agente de itinerarios' : 'Itinerary agent' },
      { name: 'Victoria SM',      file: 'brands/vic_white_transparent.png',            note: es ? 'IG setter — 200 msgs/sem' : 'IG setter — 200 msgs/wk handled' },
      { name: 'XUP',              file: 'brands/xup_white_transparent.png',            note: es ? 'Calificador de leads de ads' : 'Sales-qualifier on paid ads' },
    ];
  });
}

/* ----- /philosophy ----- */
@Component({
  selector: 'tsec-philosophy',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './terminal-sections.scss',
  template: `
    <div class="tsec">
      <header class="tsec-header">
        <h2 class="tsec-title">{{ es() ? 'Por qué construimos como construimos' : 'Why we build the way we build' }}</h2>
        <p class="tsec-sub">{{ es() ? 'Escribimos arte, no solo código. Esto significa en práctica:' : 'We write art, not just code. Here is what that means in practice.' }}</p>
      </header>
      <div class="philo-grid">
        @for (p of items(); track p.k; let i = $index) {
          <article class="philo-card" [style.animationDelay.ms]="i * 140">
            <span class="philo-k">{{ p.k }}</span>
            <h3 class="philo-title">{{ p.title }}</h3>
            <p class="philo-body">{{ p.body }}</p>
          </article>
        }
      </div>
    </div>
  `,
})
export class TsecPhilosophy {
  private readonly lang = inject(LanguageService);
  readonly es = computed(() => this.lang.current() === 'es');
  readonly items = computed(() =>
    this.es()
      ? [
          { k: '01', title: 'Nunca pares', body: 'La resiliencia construye excelencia. Cada reto es una chance de hacer algo que vale la pena lanzar.' },
          { k: '02', title: 'Falla rápido', body: 'Iterar es aprender. Las respuestas equivocadas rápidas llevan a las correctas brillantes. Construimos en 5 días, no en 5 meses.' },
          { k: '03', title: 'Software que inspira', body: 'Más allá de funcional. Hacemos herramientas que transforman cómo trabaja un equipo — no solo otro dashboard.' },
        ]
      : [
          { k: '01', title: 'Never stop', body: 'Resilience builds excellence. Every challenge is a chance to make something worth shipping.' },
          { k: '02', title: 'Fail fast', body: 'Iteration is learning. Fast wrong answers lead to bright right ones. We build in 5 days, not 5 months.' },
          { k: '03', title: 'Software that inspires', body: 'Beyond functional. We make tools that transform how a team works — not just another dashboard.' },
        ]
  );
}

/* ----- /contact ----- */
@Component({
  selector: 'tsec-contact',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './terminal-sections.scss',
  template: `
    <div class="tsec">
      <header class="tsec-header">
        <h2 class="tsec-title">{{ es() ? 'Habla con un humano' : 'Talk to a human' }}</h2>
        <p class="tsec-sub">{{ es() ? 'O con el agente. Ambos funcionan. El agente responde más rápido.' : 'Or to the agent. Both work. The agent replies faster.' }}</p>
      </header>
      <div class="contact-grid">
        <a class="contact-card" href="https://wa.me/584125671953" target="_blank" rel="noreferrer">
          <span class="contact-k">WA</span>
          <div>
            <div class="contact-card-title">whatsapp.us</div>
            <div class="contact-card-sub">{{ es() ? 'Respondemos rápido' : 'We reply fast' }}</div>
          </div>
          <span class="contact-arrow">→</span>
        </a>
        <a class="contact-card" href="https://ig.me/m/michelangelo.devs" target="_blank" rel="noreferrer">
          <span class="contact-k">DM</span>
          <div>
            <div class="contact-card-title">instagram.dm → &#64;michelangelo.devs</div>
            <div class="contact-card-sub">{{ es() ? 'El agente responde 24/7' : 'The agent replies 24/7' }}</div>
          </div>
          <span class="contact-arrow">→</span>
        </a>
        <a class="contact-card" href="https://calendly.com/angel-camacho-michelangelodevs/30min" target="_blank" rel="noreferrer">
          <span class="contact-k">$</span>
          <div>
            <div class="contact-card-title">book.call → 30min</div>
            <div class="contact-card-sub">{{ es() ? 'Calendly · agenda un horario' : 'Calendly · pick a slot' }}</div>
          </div>
          <span class="contact-arrow">→</span>
        </a>
        <a class="contact-card" href="mailto:angel.camacho@michelangelodevs.com">
          <span class="contact-k">&#64;</span>
          <div>
            <div class="contact-card-title">mail.us → angel.camacho&#64;michelangelodevs.com</div>
            <div class="contact-card-sub">{{ es() ? 'Para briefs y NDAs' : 'For briefs and NDAs' }}</div>
          </div>
          <span class="contact-arrow">→</span>
        </a>
      </div>
    </div>
  `,
})
export class TsecContact {
  private readonly lang = inject(LanguageService);
  readonly es = computed(() => this.lang.current() === 'es');
}

/* ----- /demo ----- */
@Component({
  selector: 'tsec-demo',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './terminal-sections.scss',
  template: `
    <div class="tsec">
      <header class="tsec-header">
        <h2 class="tsec-title">{{ es() ? 'Mira cómo trabaja' : 'See it work' }}</h2>
        <p class="tsec-sub">{{ es() ? 'Un agente cerrando ventas en tiempo real.' : 'An agent closing sales in real time.' }}</p>
      </header>
      <div class="demo-wrap">
        <div class="demo-ascii-top">┌─ loom.demo ──────────────────────────────────────────────┐</div>
        <div class="demo-frame">
          <iframe
            [src]="src()"
            title="Demo Loom"
            allow="fullscreen"
            frameborder="0"
            loading="lazy"
          ></iframe>
        </div>
        <div class="demo-ascii-bot">└──────────────────────────────────────────────────────────┘</div>
      </div>
    </div>
  `,
})
export class TsecDemo {
  private readonly lang = inject(LanguageService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly es = computed(() => this.lang.current() === 'es');

  private readonly LOOM_BY_LANG: Record<'es' | 'en', string> = {
    es: 'https://www.loom.com/embed/5f2c3e40bf2945919e798dd822f219c4',
    en: 'https://www.loom.com/embed/46eb3f85d63b4058bd629747f3b34c80',
  };

  readonly src = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.LOOM_BY_LANG[this.lang.current()])
  );
}

/* ----- /roi (calculator) ----- */
@Component({
  selector: 'tsec-roi',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './terminal-sections.scss',
  template: `
    <div class="tsec">
      <header class="tsec-header">
        <h2 class="tsec-title">{{ es() ? 'Calculadora de impacto' : 'Impact calculator' }}</h2>
        <p class="tsec-sub">{{ es() ? 'Ajusta a tu negocio. Te decimos cuánto agrega un agente AI.' : 'Tune to your business. We show you what an AI agent adds.' }}</p>
      </header>
      <div class="roi-grid">
        <div class="roi-inputs">
          <label class="roi-field">
            <span class="roi-k">{{ es() ? 'mensajes/día' : 'messages/day' }}</span>
            <input type="number" min="1" max="100000" [value]="dpm()" (input)="setDpm($any($event.target).value)" />
          </label>
          <label class="roi-field">
            <span class="roi-k">{{ es() ? 'tasa de cierre' : 'close rate' }}</span>
            <input type="number" min="0" max="100" step="0.1" [value]="crPct()" (input)="setCrPct($any($event.target).value)" />
            <span class="roi-unit">%</span>
          </label>
          <label class="roi-field">
            <span class="roi-k">{{ es() ? 'ticket promedio (USD)' : 'avg ticket (USD)' }}</span>
            <input type="number" min="1" max="100000" [value]="ticket()" (input)="setTicket($any($event.target).value)" />
          </label>
        </div>
        <div class="roi-output">
          <div class="roi-out-row">
            <span class="roi-out-k">{{ es() ? 'ingreso/mes' : 'revenue/mo' }}</span>
            <span class="roi-out-v">\${{ monthlyRevenue() | number:'1.0-0' }}</span>
          </div>
          <div class="roi-out-row">
            <span class="roi-out-k">{{ es() ? 'tier sugerido' : 'suggested tier' }}</span>
            <span class="roi-out-v">{{ tier() }}</span>
          </div>
          <div class="roi-out-row">
            <span class="roi-out-k">{{ es() ? 'recuperación' : 'payback' }}</span>
            <span class="roi-out-v">{{ paybackText() }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TsecRoi {
  private readonly lang = inject(LanguageService);
  readonly es = computed(() => this.lang.current() === 'es');

  readonly dpm = signal(120);
  readonly crPct = signal(5);
  readonly ticket = signal(60);

  setDpm(v: string): void { const n = parseInt(v, 10); if (Number.isFinite(n) && n >= 1) this.dpm.set(Math.min(100000, n)); }
  setCrPct(v: string): void { const n = parseFloat(v); if (Number.isFinite(n) && n >= 0) this.crPct.set(Math.min(100, n)); }
  setTicket(v: string): void { const n = parseFloat(v); if (Number.isFinite(n) && n >= 1) this.ticket.set(Math.min(100000, n)); }

  readonly monthlyRevenue = computed(() => Math.round(this.dpm() * 30 * (this.crPct() / 100) * this.ticket()));
  readonly tier = computed(() => {
    const r = this.monthlyRevenue();
    if (r >= 50000) return 'full.build';
    if (r >= 12000) return 'agent.cluster';
    return 'single.agent';
  });
  readonly paybackText = computed(() => {
    const r = this.monthlyRevenue();
    if (r <= 0) return this.es() ? 'n/d' : 'n/a';
    const cost = this.tier() === 'single.agent' ? 1800 : this.tier() === 'agent.cluster' ? 4500 : 12000;
    const weeks = Math.max(1, Math.round((cost / r) * 4.33));
    return this.es() ? `≈ ${weeks} semanas` : `≈ ${weeks} weeks`;
  });

  @Input() set initial(value: { messagesPerDay: number; conversionRate: number; avgTicket: number } | null) {
    if (!value) return;
    this.dpm.set(value.messagesPerDay);
    this.crPct.set(Math.round(value.conversionRate * 100 * 10) / 10);
    this.ticket.set(value.avgTicket);
  }
}

/* ----- /custom (LLM-extracted build for this visitor) ----- */
@Component({
  selector: 'tsec-custom',
  standalone: true,
  imports: [CommonModule, TsecRoi],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './terminal-sections.scss',
  template: `
    <div class="tsec">
      <header class="tsec-header">
        <h2 class="tsec-title">{{ es() ? 'Construido para ti' : 'Built for you' }} <span class="tsec-noun" *ngIf="noun">· {{ noun }}</span></h2>
        <p class="tsec-sub">
          {{ es() ? 'Estos son tus números y el sistema que sugerimos. Edita los valores para refinar.' : 'These are your numbers and the system we suggest. Edit values to refine.' }}
        </p>
      </header>

      @if (roi) {
        <div class="custom-assumption">
          <span class="tsec-bullet">→</span>
          {{ es() ? 'asumimos:' : 'we assumed:' }}
          <strong>{{ roi.inputs.messagesPerDay }}</strong> {{ es() ? 'msgs/día' : 'msgs/day' }} ·
          <strong>{{ (roi.inputs.conversionRate * 100) | number:'1.0-1' }}%</strong> {{ es() ? 'cierre' : 'close' }} ·
          <strong>\${{ roi.inputs.avgTicket }}</strong> {{ es() ? 'ticket' : 'ticket' }}
          <span class="custom-edit-hint">— {{ es() ? '¿mal? edita abajo' : 'wrong? edit below' }}</span>
        </div>
        <tsec-roi [initial]="roi.inputs"></tsec-roi>
      }

      <a class="custom-cta" href="https://calendly.com/angel-camacho-michelangelodevs/30min" target="_blank" rel="noreferrer">
        $ ship.this --in 5d →
      </a>
    </div>
  `,
})
export class TsecCustom {
  private readonly lang = inject(LanguageService);
  readonly es = computed(() => this.lang.current() === 'es');
  @Input() noun: string | null = null;
  @Input() roi: RoiPayload | null = null;
}
