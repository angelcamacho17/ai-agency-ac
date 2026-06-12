import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
  TsecAgents,
  TsecCaseStudy,
  TsecContact,
  TsecCustom,
  TsecDemo,
  TsecPhilosophy,
  TsecPricing,
  TsecProcess,
  TsecRoi,
  TsecTeamGrid,
  TsecWork,
  RoiPayload,
} from './terminal-sections';
import type { CaseStudyData, TeamMember } from '../../shared/facts.public';
import { LanguageService } from '../../services/language.service';

type LineKind = 'muted' | 'agent' | 'agent-soft' | 'user' | 'build' | 'menu' | 'spacer' | 'rule';
interface Line {
  id: string;
  kind: LineKind;
  prefix?: string;
  text: string;
}
type SectionKey = 'agents' | 'pricing' | 'process' | 'work' | 'philosophy' | 'contact' | 'demo' | 'roi' | 'custom';
type TemplateKind = 'case-study' | 'team-grid';

interface SectionMount {
  id: string;
  kind: SectionKey;
  noun?: string | null;
  roi?: RoiPayload | null;
  /** Suppress the duplicate `<tsec-roi>` inside `pricing` when `custom` already mounted one. */
  hideRoi?: boolean;
  /** "visitor-triggered" (extracted from prompt) ranks higher than LLM-volunteered when the queue overflows. */
  score?: number;
}
interface TemplateMount {
  id: string;
  kind: 'template';
  tplKind: TemplateKind;
  ref?: string;
  data: unknown;
  langFallback?: boolean;
  score?: number;
}
type Mounted = SectionMount | TemplateMount;

const SECTION_ALLOWLIST: SectionKey[] = ['agents', 'pricing', 'process', 'work', 'philosophy', 'contact'];
const TEMPLATE_KIND_ALLOWLIST: TemplateKind[] = ['case-study', 'team-grid'];
const NOUN_RE = /^[a-z0-9áéíóúüñ \-]{1,40}$/i;

function mountKey(m: Mounted): string {
  if (m.kind === 'template') return `tpl:${m.tplKind}:${m.ref ?? ''}`;
  return `sec:${m.kind}`;
}

const ASCII_LOGO = `
███╗   ███╗██╗ ██████╗██╗  ██╗███████╗██╗      █████╗ ███╗   ██╗ ██████╗ ███████╗██╗      ██████╗
████╗ ████║██║██╔════╝██║  ██║██╔════╝██║     ██╔══██╗████╗  ██║██╔════╝ ██╔════╝██║     ██╔═══██╗
██╔████╔██║██║██║     ███████║█████╗  ██║     ███████║██╔██╗ ██║██║  ███╗█████╗  ██║     ██║   ██║
██║╚██╔╝██║██║██║     ██╔══██║██╔══╝  ██║     ██╔══██║██║╚██╗██║██║   ██║██╔══╝  ██║     ██║   ██║
██║ ╚═╝ ██║██║╚██████╗██║  ██║███████╗███████╗██║  ██║██║ ╚████║╚██████╔╝███████╗███████╗╚██████╔╝
╚═╝     ╚═╝╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚══════╝ ╚═════╝
                                                                                       . d e v s
`;

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

@Component({
  selector: 'app-terminal-home',
  standalone: true,
  imports: [
    CommonModule,
    TsecAgents,
    TsecPricing,
    TsecProcess,
    TsecWork,
    TsecPhilosophy,
    TsecContact,
    TsecDemo,
    TsecRoi,
    TsecCustom,
    TsecCaseStudy,
    TsecTeamGrid,
  ],
  templateUrl: './terminal-home.component.html',
  styleUrl: './terminal-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminalHomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;
  @ViewChild('terminalEl') terminalEl?: ElementRef<HTMLDivElement>;
  @ViewChild('particles') particlesCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('stickyBar') stickyBar?: ElementRef<HTMLDivElement>;

  readonly asciiLogo = ASCII_LOGO;

  // Example prompts shown as chips after intro — natural questions, not commands.
  readonly chipExamplesES: ReadonlyArray<{ label: string; prompt: string }> = [
    { label: '¿cuánto cuesta un agente?',           prompt: '¿cuánto cuesta un agente para mi negocio?' },
    { label: 'muéstrame un demo',                   prompt: 'muéstrame un demo' },
    { label: 'agentes whatsapp + instagram',        prompt: 'quiero agentes para whatsapp e instagram' },
    { label: '¿en cuánto lo lanzan?',               prompt: '¿en cuánto tiempo lo lanzan?' },
    { label: 'qué marcas confían',                  prompt: 'qué marcas confían en ustedes' },
    { label: 'cómo construyen',                     prompt: 'por qué construyen como construyen' },
  ];
  readonly chipExamplesEN: ReadonlyArray<{ label: string; prompt: string }> = [
    { label: 'how much for an agent?',              prompt: 'how much for an agent for my business?' },
    { label: 'show me a demo',                      prompt: 'show me a demo' },
    { label: 'whatsapp + instagram agents',         prompt: 'i want agents for whatsapp and instagram' },
    { label: 'how fast can you ship?',              prompt: 'how fast can you ship this?' },
    { label: 'who trusts you',                      prompt: 'who already trusts you?' },
    { label: 'why you build that way',              prompt: 'why do you build the way you build?' },
  ];

  readonly lines = signal<Line[]>([]);
  readonly mounted = signal<Mounted[]>([]);
  readonly composed = signal(false);
  readonly busy = signal(true);
  readonly showChips = signal(false);
  readonly inputValue = signal('');
  readonly sessionId = signal(Math.random().toString(36).slice(2, 8));
  readonly placeholder = signal('');
  readonly remainingToday = signal<number | null>(null);
  readonly dailyLimit = 20;

  // Boot phases: 'loading' (Phase A) → 'success' (Phase B) → 'intro' (Phase C) → 'ready'
  readonly bootPhase = signal<'loading' | 'success' | 'intro' | 'ready'>('loading');

  // Sticky chat collapse state, driven by scroll listener with hysteresis.
  readonly chatCollapsed = signal(false);
  readonly lastAgentLine = computed(() => {
    const ls = this.lines();
    for (let i = ls.length - 1; i >= 0; i--) {
      if (ls[i].kind === 'agent' && ls[i].text) return ls[i].text;
    }
    return '';
  });

  // Decorative-only replayed visitor prompt (from ?q=base64)
  readonly replayedPrompt = signal<string | null>(null);

  // Build receipt state
  readonly visitorNoun = signal<string | null>(null);

  readonly receiptText = computed(() => {
    const noun = this.visitorNoun();
    const count = this.mounted().length;
    if (!count) return '';
    const isES = this.lang.current() === 'es';
    const moduleWord = count === 1 ? (isES ? 'módulo' : 'module') : (isES ? 'módulos' : 'modules');
    if (noun) {
      return isES
        ? `agent › construido para "${noun}" · ${count} ${moduleWord}`
        : `agent › built for "${noun}" · ${count} ${moduleWord}`;
    }
    return isES
      ? `agent › tu página · ${count} ${moduleWord}`
      : `agent › your page · ${count} ${moduleWord}`;
  });

  private readonly typeSpeed = 28;
  private cancelled = false;
  private rafId = 0;
  private particles: { x: number; y: number; r: number; vx: number; vy: number; a: number; tp: number; tr: number }[] = [];
  private resizeHandler?: () => void;
  private scrollHandler?: () => void;
  private scrollRaf = 0;
  private resizeObs?: ResizeObserver;
  private firstMountScrolled = false;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);
  readonly lang = inject(LanguageService);

  pad2(n: number): string { return n < 10 ? '0' + n : String(n); }

  /** Human-readable label used in the section header tag, data-key, and scroll target. */
  mountLabel(m: Mounted): string {
    if (m.kind === 'template') {
      return m.ref ? `${m.tplKind}:${m.ref}` : m.tplKind;
    }
    return m.kind;
  }

  async ngAfterViewInit(): Promise<void> {
    this.doc.body.classList.add('terminal-route');
    this.setPlaceholder();
    this.translate.onLangChange.subscribe(() => this.setPlaceholder());
    this.loadUsage();
    this.setupResizeObserver();
    this.setupScrollListener();
    this.runBoot();
    this.initParticles();
  }

  ngOnDestroy(): void {
    this.doc.body.classList.remove('terminal-route');
    this.cancelled = true;
    cancelAnimationFrame(this.rafId);
    cancelAnimationFrame(this.scrollRaf);
    this.resizeHandler && window.removeEventListener('resize', this.resizeHandler);
    this.scrollHandler && window.removeEventListener('scroll', this.scrollHandler);
    this.resizeObs?.disconnect();
  }

  private setPlaceholder(): void {
    this.placeholder.set(
      this.lang.current() === 'es'
        ? 'describe tu proyecto, o pulsa un chip…'
        : 'describe your project, or hit a chip…',
    );
  }

  private isES(): boolean { return this.lang.current() === 'es'; }

  /* ---------- Scroll listener with hysteresis for sticky chat ---------- */

  private readonly COLLAPSE_AT = 120;
  private readonly EXPAND_AT = 60;

  private setupScrollListener(): void {
    if (typeof window === 'undefined') return;
    // Run outside Angular zone — only flip back inside when state actually changes.
    this.zone.runOutsideAngular(() => {
      const tick = (): void => {
        this.scrollRaf = 0;
        const y = window.scrollY || this.doc.documentElement.scrollTop || 0;
        const collapsed = this.chatCollapsed();
        if (!collapsed && y > this.COLLAPSE_AT) {
          this.zone.run(() => this.chatCollapsed.set(true));
        } else if (collapsed && y < this.EXPAND_AT) {
          this.zone.run(() => this.chatCollapsed.set(false));
        }
      };
      this.scrollHandler = (): void => {
        if (this.scrollRaf) return;
        this.scrollRaf = requestAnimationFrame(tick);
      };
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    });
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver === 'undefined') return;
    this.resizeObs = new ResizeObserver(() => {
      const bar = this.stickyBar?.nativeElement;
      if (!bar) return;
      const h = bar.offsetHeight || 56;
      this.doc.documentElement.style.setProperty('--agent-bar-h', `${h}px`);
    });
    // Seed default synchronously; refine when the bar element appears.
    this.doc.documentElement.style.setProperty('--agent-bar-h', '56px');
  }

  private observeBar(): void {
    const bar = this.stickyBar?.nativeElement;
    if (bar && this.resizeObs) {
      this.resizeObs.observe(bar);
      this.doc.documentElement.style.setProperty('--agent-bar-h', `${bar.offsetHeight || 56}px`);
    }
  }

  scrollToTerminal(): void {
    const el = this.terminalEl?.nativeElement;
    if (!el) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- usage / fp ---------- */

  private fpKey(): string {
    let fp = '';
    try {
      fp = localStorage.getItem('md.fp') || '';
      if (!fp) {
        fp = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        localStorage.setItem('md.fp', fp);
      }
    } catch (_e) { /* noop */ }
    return fp;
  }

  private usageStorageKey(): string {
    const today = new Date().toISOString().slice(0, 10);
    return 'md.usage.' + today;
  }

  private loadUsage(): void {
    try {
      const raw = localStorage.getItem(this.usageStorageKey());
      if (raw == null) { this.remainingToday.set(this.dailyLimit); }
      else {
        const used = parseInt(raw, 10);
        if (!Number.isFinite(used)) { this.remainingToday.set(this.dailyLimit); }
        else { this.remainingToday.set(Math.max(0, this.dailyLimit - used)); }
      }
    } catch (_e) { this.remainingToday.set(this.dailyLimit); }

    // Server is the authority — sync from /api/agent/usage in the background.
    // If the client's stored counter is stale (different IP, cleared session,
    // or different day than the server thinks), we trust the server.
    this.syncUsageFromServer();
  }

  private async syncUsageFromServer(): Promise<void> {
    try {
      const res = await fetch('/api/agent/usage', { method: 'GET' });
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.remaining === 'number') {
        this.remainingToday.set(Math.max(0, Math.min(this.dailyLimit, data.remaining)));
        this.persistUsage();
      }
    } catch (_e) { /* server down or first-load offline — keep localStorage value */ }
  }

  private persistUsage(): void {
    try {
      const remaining = this.remainingToday();
      if (remaining == null) return;
      const used = this.dailyLimit - remaining;
      localStorage.setItem(this.usageStorageKey(), String(used));
    } catch (_e) { /* noop */ }
  }

  /* ---------- backend call ---------- */

  private async callAgent(text: string): Promise<{
    reply: string;
    sections: SectionKey[];
    noun: string | null;
    roi: RoiPayload | null;
    templates: TemplateMount[];
    redirect: { reason: string } | null;
    remaining: number | null;
    rateLimited: boolean;
    sharedLimit: boolean;
    offline: boolean;
    noKey: boolean;
    timedOut: boolean;
    refused: boolean;
  }> {
    const controller = new AbortController();
    // Render free plan cold-starts the Node service when idle; first call can
    // take 20–30 s. Give it room. Server-side rate limits still cap traffic.
    const hardAbort = setTimeout(() => controller.abort(), 40000);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text, fp: this.fpKey() }),
        signal: controller.signal,
      });
      clearTimeout(hardAbort);
      const emptyBag = {
        reply: '', sections: [] as SectionKey[], noun: null, roi: null,
        templates: [] as TemplateMount[], redirect: null,
        rateLimited: false, sharedLimit: false, offline: false, noKey: false, timedOut: false, refused: false,
      };
      if (res.status === 429) {
        const data = await res.json().catch(() => ({} as { error?: string }));
        return {
          ...emptyBag,
          remaining: 0,
          rateLimited: data.error === 'device_limit',
          sharedLimit: data.error === 'shared_ip_limit',
        };
      }
      if (res.status === 503) {
        return { ...emptyBag, remaining: null, noKey: true };
      }
      if (!res.ok) {
        return { ...emptyBag, remaining: null, offline: true };
      }
      const data = await res.json();
      const sections: SectionKey[] = Array.isArray(data.sections)
        ? data.sections.filter((s: string) => (SECTION_ALLOWLIST as string[]).includes(s))
        : [];
      const noun = typeof data.noun === 'string' && NOUN_RE.test(data.noun) ? data.noun : null;

      // Hydrate templates from server-validated payload.
      const templates: TemplateMount[] = Array.isArray(data.templates)
        ? data.templates
            .filter((t: { kind?: string }) => t && (TEMPLATE_KIND_ALLOWLIST as string[]).includes(t.kind ?? ''))
            .slice(0, 2)
            .map((t: {
              kind: TemplateKind; ref?: string; data: unknown; langFallback?: boolean;
            }) =>
              this.buildTemplateEntry({
                kind: t.kind,
                ref: t.ref,
                data: t.data,
                langFallback: !!t.langFallback,
                score: 2, // visitor-triggered (LLM chose because visitor asked)
              })
            )
        : [];

      const redirect = data.redirect && typeof data.redirect.reason === 'string'
        ? { reason: data.redirect.reason }
        : null;

      return {
        reply: typeof data.reply === 'string' ? data.reply : '',
        sections, noun,
        roi: data.roi ?? null,
        templates,
        redirect,
        remaining: typeof data.remaining === 'number' ? data.remaining : null,
        rateLimited: false, sharedLimit: false, offline: false, noKey: false, timedOut: false,
        refused: data.refused === true,
      };
    } catch (e: unknown) {
      clearTimeout(hardAbort);
      const isAbort = e instanceof DOMException && e.name === 'AbortError';
      return {
        reply: '', sections: [], noun: null, roi: null,
        templates: [], redirect: null,
        remaining: null,
        rateLimited: false, sharedLimit: false,
        offline: !isAbort, noKey: false,
        timedOut: isAbort, refused: false,
      };
    }
  }

  /** Heuristic fallback when the agent is unreachable.
      Maps Spanish/English keywords to section combos so the page still renders. */
  private heuristicPlan(raw: string): { sections: SectionKey[]; noun: string | null } {
    const s = raw.toLowerCase();
    const hits: SectionKey[] = [];
    const add = (k: SectionKey): void => { if (!hits.includes(k)) hits.push(k); };

    if (/\b(price|cost|cuanto|cuánto|costaría|costaria|presupuesto|pricing|cost|budget|roi)\b/.test(s)) {
      add('pricing'); add('roi');
    }
    if (/\b(agent|agente|bot|chatbot|whats?app|instagram|dm|inbox|cliente|client)\b/.test(s)) {
      add('agents');
    }
    if (/\b(process|proceso|tiempo|cuanto.*tarda|how.*long|5.?d[ií]as|five.?day|timeline)\b/.test(s)) {
      add('process');
    }
    if (/\b(work|portfolio|clientes|client|brands|marcas|trabajo|examples|ejemplos)\b/.test(s)) {
      add('work');
    }
    if (/\b(contact|contacto|llamar|book|reach|talk|hablar|email|correo)\b/.test(s)) {
      add('contact');
    }
    if (/\b(why|por.?qu[eé]|values|valores|filosof|believe|creen)\b/.test(s)) {
      add('philosophy');
    }

    // Noun extraction: look for "para mi <noun>" or "for my <noun>"
    let noun: string | null = null;
    const mES = s.match(/para\s+mi\s+([a-záéíóúüñ ]{3,30})/);
    const mEN = s.match(/for\s+my\s+([a-z ]{3,30})/);
    const candidate = (mES?.[1] || mEN?.[1] || '').trim().split(/[,.;]/)[0].trim();
    if (candidate && NOUN_RE.test(candidate)) {
      noun = candidate.slice(0, 40);
    }

    // Default fallback: if nothing matched but the message has words, show agents+pricing
    if (!hits.length) {
      hits.push('agents', 'pricing');
    }

    return { sections: hits.slice(0, 3), noun };
  }

  /* ---------- boot (3 phases) ---------- */

  /** Skip the boot intro — wired to [skip ›] button and any keypress during boot. */
  skipBoot(): void {
    if (this.bootPhase() === 'ready') return;
    this.cancelled = true;
    // hard cut to ready state with a minimal welcome line
    setTimeout(() => {
      this.cancelled = false;
      this.lines.set([
        { id: uid(), kind: 'muted', text: '[michelangelo.devs / agent.v3 / 2026 — skipped]' },
        { id: uid(), kind: 'spacer', text: '' },
        { id: uid(), kind: 'agent', prefix: 'agent ›', text: this.isES()
          ? 'listo. dime qué construyo para ti.' : 'ready. tell me what to build.' },
      ]);
      this.bootPhase.set('ready');
      this.showChips.set(true);
      this.busy.set(false);
      this.focusInput();
      this.maybeReplayUrl();
    }, 50);
  }

  private async runBoot(): Promise<void> {
    // PHASE A — Loading sequence (~2.0–2.4s)
    this.bootPhase.set('loading');
    await this.runLoadingPhase();
    if (this.cancelled || this.bootPhase() === 'ready') return;

    // PHASE B — Success card (~0.8s)
    this.bootPhase.set('success');
    await this.runSuccessPhase();
    if (this.cancelled || this.bootPhase() === 'ready') return;

    // PHASE C — Alex intro lines + chips
    this.bootPhase.set('intro');
    await this.runIntroPhase();
    if (this.cancelled) return;

    this.bootPhase.set('ready');
    this.showChips.set(true);
    this.busy.set(false);
    this.focusInput();
    this.maybeReplayUrl();
  }

  private async runLoadingPhase(): Promise<void> {
    const es = this.isES();
    const lines: { text: string; gap: number }[] = es
      ? [
          { text: '[michelangelo.devs / agent.v3 / 2026]',         gap: 280 },
          { text: 'iniciando modelo de lenguaje ........ ok',      gap: 240 },
          { text: 'cargando tono.voz ................... ok',      gap: 240 },
          { text: 'cargando personalidad.calida ........ ok',      gap: 240 },
          { text: 'cargando dominio.michelangelo ....... ok',      gap: 240 },
          { text: 'conectando con anthropic.api ........ ok',      gap: 240 },
          { text: 'calentando agente ................... ok',      gap: 320 },
        ]
      : [
          { text: '[michelangelo.devs / agent.v3 / 2026]',         gap: 280 },
          { text: 'booting language model .............. ok',      gap: 240 },
          { text: 'loading tone.voice .................. ok',      gap: 240 },
          { text: 'loading personality.warm ............ ok',      gap: 240 },
          { text: 'loading domain.michelangelo ......... ok',      gap: 240 },
          { text: 'connecting to anthropic.api ......... ok',      gap: 240 },
          { text: 'warming up agent .................... ok',      gap: 320 },
        ];
    await this.sleep(400);
    for (const ln of lines) {
      if (this.cancelled || this.bootPhase() === 'ready') return;
      this.pushLine({ kind: 'muted', text: ln.text });
      await this.sleep(ln.gap);
    }
  }

  private async runSuccessPhase(): Promise<void> {
    // Success card overlay — give the user time to actually see and read it.
    await this.sleep(1600);
  }

  private async runIntroPhase(): Promise<void> {
    const es = this.isES();
    // Clear loading lines — fresh canvas for the conversation.
    this.lines.set([]);
    await this.sleep(260);

    if (es) {
      await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: 'hola, soy alex — agente de michelangelo.devs.' });
      await this.sleep(500);
      await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: 'no hacemos landings — hacemos agentes.' });
      await this.sleep(380);
      await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: 'voy a construir esta landing page en vivo según lo que tu me pidas, let\'s create.' });
      await this.sleep(520);
      await this.typeLine({ kind: 'agent-soft', prefix: '       ', text: 'puedes pedirme cosas como:' });
      await this.sleep(180);
    } else {
      await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: "hi, i'm alex — michelangelo.devs agent." });
      await this.sleep(500);
      await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: "we don't ship landings — we ship agents." });
      await this.sleep(380);
      await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: "i'll build this landing page live based on what you ask me, let's create." });
      await this.sleep(520);
      await this.typeLine({ kind: 'agent-soft', prefix: '       ', text: 'you can ask me things like:' });
      await this.sleep(180);
    }
  }

  private async maybeReplayUrl(): Promise<void> {
    const params = this.route.snapshot.queryParamMap;
    const cmd = params.get('cmd');
    const forParam = params.get('for');
    const qParam = params.get('q');

    if (forParam && NOUN_RE.test(forParam)) {
      this.visitorNoun.set(forParam.toLowerCase());
    }

    // Decorative replay of the original prompt — render-only, no agent call.
    if (qParam) {
      try {
        let decoded = atob(qParam);
        decoded = decoded.replace(/[ -]/g, '').trim();
        if (decoded.length > 0 && decoded.length <= 200) {
          this.replayedPrompt.set(decoded);
          this.pushLine({ kind: 'muted', text: this.isES() ? '— prompt replicado (no se envió al agente) —' : '— replayed prompt (not sent to agent) —' });
          this.pushLine({ kind: 'user', prefix: 'visitor wrote ›', text: decoded });
        }
      } catch (_e) { /* silently drop invalid q */ }
    }

    if (cmd) {
      const parts = cmd.split(',').map((s) => s.trim()).filter((s): s is SectionKey => (SECTION_ALLOWLIST as string[]).includes(s)) as SectionKey[];
      if (parts.length) {
        await this.typeLine({
          kind: 'agent', prefix: 'agent ›',
          text: this.isES() ? 'replicando tu vista compartida.' : 'replaying your shared view.',
        });
        await this.renderSections(parts);
      }
    }
  }

  /* ---------- terminal helpers ---------- */

  private pushLine(line: Omit<Line, 'id'>): void {
    this.lines.update((prev) => [...prev, { ...line, id: uid() }]);
    this.scheduleScrollTerminal();
  }

  private async typeLine(line: Omit<Line, 'id'>): Promise<void> {
    const id = uid();
    this.lines.update((prev) => [...prev, { ...line, id, text: '' }]);
    for (let i = 0; i < line.text.length; i++) {
      if (this.cancelled) return;
      const cur = line.text.slice(0, i + 1);
      this.lines.update((prev) => prev.map((l) => l.id === id ? { ...l, text: cur } : l));
      this.scheduleScrollTerminal();
      await this.sleep(this.typeSpeed * (Math.random() * 0.4 + 0.8));
    }
  }

  private scheduleScrollTerminal(): void {
    requestAnimationFrame(() => {
      const el = this.terminalEl?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  private sleep(ms: number): Promise<void> { return new Promise((r) => setTimeout(r, ms)); }

  private focusInput(): void { setTimeout(() => this.inputEl?.nativeElement?.focus(), 60); }

  /* ---------- input handlers ---------- */

  onInput(v: string): void { this.inputValue.set(v); }

  onKeyDown(e: KeyboardEvent): void {
    // Any key during boot skips to ready state.
    if (this.bootPhase() !== 'ready') {
      e.preventDefault();
      this.skipBoot();
      return;
    }
    if (e.key === 'Enter') { e.preventDefault(); this.submit(this.inputValue()); }
    else if (e.key === 'Escape') { this.inputValue.set(''); this.submit('clear'); }
    else if (e.key === '?' && !this.inputValue().length) { e.preventDefault(); this.submit('help'); }
  }

  onChipClick(cmd: string): void { this.submit(cmd); }

  /* ---------- submit ---------- */

  async submit(raw: string): Promise<void> {
    const text = raw.trim();
    if (!text || this.busy()) return;
    this.inputValue.set('');
    this.busy.set(true);
    this.showChips.set(false);
    this.pushLine({ kind: 'user', prefix: 'you ›', text });
    await this.sleep(80);

    const plan = this.classifyLocally(text);
    const es = this.isES();

    if (!plan) {
      // Pre-filter: <4 chars or no letters → don't burn a quota call
      if (text.length < 4 || !/[a-záéíóúüñ]/i.test(text)) {
        await this.typeLine({
          kind: 'agent', prefix: 'agent ›',
          text: es
            ? 'eso no me dice mucho. cuéntame qué construyes — o usa los chips.'
            : "that's a bit thin. tell me what you're building — or use the chips.",
        });
        this.showChips.set(true);
        this.busy.set(false);
        this.focusInput();
        return;
      }
      await this.handleAgentCall(text);
      return;
    }

    if (plan.kind === 'help') {
      await this.sleep(80);
      await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: es ? 'comandos que entiendo:' : 'commands i answer to:' });
      const hints: Record<string, [string, string]> = {
        agents:     ['mira el demo y los agentes que desplegamos.',     'see the demo and the agents we deploy.'],
        pricing:    ['cuánto cuesta esto (ROI + precios).',              'how much this costs (ROI + pricing).'],
        process:    ['qué tan rápido lanzamos (5 días).',                'how fast we ship (5 days).'],
        work:       ['quién ya confía en nosotros.',                     'who already trusts us.'],
        philosophy: ['por qué construimos como construimos.',            'why we build the way we build.'],
        contact:    ['habla con un humano (o con el agente).',           'talk to a human (or to the agent).'],
      };
      for (const c of SECTION_ALLOWLIST) {
        this.pushLine({ kind: 'menu', prefix: '  $', text: `${c}  — ${es ? hints[c][0] : hints[c][1]}` });
        await this.sleep(40);
      }
      this.pushLine({ kind: 'menu', prefix: '  $', text: es ? 'surprise — yo elijo' : 'surprise — i pick something' });
      this.pushLine({ kind: 'menu', prefix: '  $', text: es ? 'clear    — limpia la página' : 'clear    — wipe the page' });
      this.pushLine({ kind: 'agent-soft', text: es ? 'o describe tu proyecto en lenguaje normal.' : 'or just describe your project in plain words.' });
      this.showChips.set(true);
      this.busy.set(false);
      this.focusInput();
      return;
    }

    if (plan.kind === 'clear') {
      await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: es ? 'borrando. empezando de cero.' : 'wiping. starting fresh.' });
      await this.sleep(220);
      this.mounted.set([]);
      this.composed.set(false);
      this.visitorNoun.set(null);
      this.firstMountScrolled = false;
      this.updateUrl();
      this.showChips.set(true);
      this.busy.set(false);
      this.focusInput();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (plan.kind === 'links') {
      await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: es ? 'aquí están todos los enlaces.' : 'here are all the links.' });
      await this.sleep(150);
      this.router.navigateByUrl('/links');
      return;
    }

    if (plan.kind === 'say') {
      await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: plan.text });
      this.showChips.set(true);
      this.busy.set(false);
      this.focusInput();
      return;
    }

    if (plan.kind === 'surprise') {
      const pool: SectionKey[] = ['agents', 'pricing', 'process', 'work', 'philosophy'];
      const pick = pool[Math.floor(Math.random() * pool.length)];
      await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: es ? `vamos con /${pick}.` : `let's go with /${pick}.` });
      await this.renderSections([pick]);
      this.showChips.set(true);
      this.busy.set(false);
      this.focusInput();
      return;
    }

    if (plan.kind === 'build') {
      const introsEN: Record<SectionKey, string> = {
        agents: 'spinning up the agent catalogue.',
        pricing: 'showing you the honest numbers.',
        process: "here's how we ship in five days.",
        work: 'pulling up who already trusts us.',
        philosophy: 'why we build the way we build.',
        contact: "ok. here's how to reach a human.",
        demo: 'pulling up the demo.',
        roi: 'opening the calculator.',
        custom: 'building for you.',
      };
      const introsES: Record<SectionKey, string> = {
        agents: 'arrancando el catálogo de agentes.',
        pricing: 'te muestro los números reales.',
        process: 'así enviamos en cinco días.',
        work: 'mostrando quién ya confía en nosotros.',
        philosophy: 'por qué construimos como construimos.',
        contact: 'ok. así llegas a un humano.',
        demo: 'abriendo el demo.',
        roi: 'abriendo la calculadora.',
        custom: 'construyendo para ti.',
      };
      const intros = es ? introsES : introsEN;
      const first = plan.sections[0];
      await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: intros[first] ?? (es ? 'renderizando.' : 'rendering.') });
      await this.renderSections(plan.sections);
      this.showChips.set(true);
      this.busy.set(false);
      this.focusInput();
    }
  }

  private async handleAgentCall(text: string): Promise<void> {
    const es = this.isES();
    const thinkingId = uid();
    this.lines.update((prev) => [...prev, { id: thinkingId, kind: 'muted', text: es ? 'pensando ...' : 'thinking ...' }]);
    this.scheduleScrollTerminal();

    // Second tick at 2.5s if still pending
    const stillId = uid();
    const stillTimer = setTimeout(() => {
      this.lines.update((prev) => [...prev, { id: stillId, kind: 'muted', text: es ? 'pensando todavía ...' : 'still thinking ...' }]);
      this.scheduleScrollTerminal();
    }, 2500);

    // Third tick at 8s — explains the cold-start wait if Render was idle.
    const wakingId = uid();
    const wakingTimer = setTimeout(() => {
      this.lines.update((prev) => [...prev, {
        id: wakingId, kind: 'muted',
        text: es
          ? 'despertando el agente (primera llamada del día tarda un toque)...'
          : 'waking the agent (first call of the day takes a moment)...',
      }]);
      this.scheduleScrollTerminal();
    }, 8000);

    const result = await this.callAgent(text);
    clearTimeout(stillTimer);
    clearTimeout(wakingTimer);

    this.lines.update((prev) => prev.filter((l) => l.id !== thinkingId && l.id !== stillId && l.id !== wakingId));

    if (result.rateLimited) {
      await this.typeLine({
        kind: 'agent', prefix: 'agent ›',
        text: es
          ? 'has alcanzado el límite diario (20 mensajes). vuelve mañana — o usa los chips.'
          : "you've hit today's limit (20 messages). come back tomorrow — or use the chips.",
      });
      this.remainingToday.set(0);
      this.persistUsage();
      this.showChips.set(true); this.busy.set(false); this.focusInput(); return;
    }

    if (result.sharedLimit) {
      await this.typeLine({
        kind: 'agent', prefix: 'agent ›',
        text: es
          ? 'esta red tocó un límite compartido. usa otra conexión o los chips.'
          : 'this network hit a shared limit. try another connection or the chips.',
      });
      this.showChips.set(true); this.busy.set(false); this.focusInput(); return;
    }

    if (result.timedOut) {
      await this.typeLine({
        kind: 'agent', prefix: 'agent ›',
        text: es ? 'no llegué a tiempo, armo lo que puedo con lo que entiendo.' : "i didn't make it in time, i'll build what i can from what i understood.",
      });
      const plan = this.heuristicPlan(text);
      if (plan.noun) this.visitorNoun.set(plan.noun);
      if (plan.sections.length) await this.renderSections(plan.sections);
      this.updateUrl();
      this.showChips.set(true); this.busy.set(false); this.focusInput(); return;
    }

    if (result.offline || result.noKey) {
      const plan = this.heuristicPlan(text);
      const fallbackMsg = result.noKey
        ? (es
            ? 'el modelo no está conectado todavía, pero entiendo tu pregunta — te muestro lo que tengo.'
            : "the model isn't connected yet, but i get your question — here's what i have.")
        : (es
            ? 'no logro hablar con el modelo ahora, pero entiendo tu pregunta — te muestro lo que tengo.'
            : "can't reach the model right now, but i get your question — here's what i have.");
      await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: fallbackMsg });
      if (plan.noun) this.visitorNoun.set(plan.noun);
      if (plan.sections.length) await this.renderSections(plan.sections);
      this.updateUrl();
      this.showChips.set(true); this.busy.set(false); this.focusInput(); return;
    }

    // Off-topic refusal — show the redirect but do NOT update noun/roi/url
    // and do NOT charge the visitor for the refused interaction visually.
    if (result.refused) {
      if (result.reply) await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: result.reply });
      if (typeof result.remaining === 'number') { this.remainingToday.set(result.remaining); this.persistUsage(); }
      this.showChips.set(true); this.busy.set(false); this.focusInput();
      return;
    }

    if (result.reply) await this.typeLine({ kind: 'agent', prefix: 'agent ›', text: result.reply });
    if (typeof result.remaining === 'number') { this.remainingToday.set(result.remaining); this.persistUsage(); }
    if (result.noun) this.visitorNoun.set(result.noun);

    // Redirect narration: if the model said "no shipped case for X", say it out loud
    // before mounting the fallback sections (UX reviewer Q2: disclosure builds trust).
    if (result.redirect && result.redirect.reason) {
      const subject = (result.redirect.reason.match(/^no_case_for_(.+)$/) || [])[1] || '';
      if (subject) {
        await this.typeLine({
          kind: 'agent-soft',
          prefix: '       ',
          text: es
            ? `aún no hemos lanzado un caso para "${subject.replace(/_/g, ' ')}" — te muestro cómo lo abordaríamos:`
            : `we haven't shipped a case for "${subject.replace(/_/g, ' ')}" yet — here's how we'd approach it:`,
        });
      }
    }

    // Build the combined queue: custom (with roi) + sections + templates.
    // Scoring: visitor-triggered items score 2, generic LLM-volunteered score 1.
    // mountQueue caps the total at 3.
    const queue: Mounted[] = [];

    if (result.roi) {
      queue.push(this.buildSectionEntry('custom', { roi: result.roi, noun: result.noun, score: 2 }));
    }

    for (const t of result.templates) {
      queue.push(t);
    }

    const sectionScore = (k: SectionKey): number => {
      // sections that align with extracted noun/roi rank higher.
      if (result.roi && k === 'pricing') return 2;
      return 1;
    };
    for (const k of result.sections) {
      queue.push(this.buildSectionEntry(k, {
        hideRoi: !!result.roi && k === 'pricing',
        score: sectionScore(k),
      }));
    }

    if (queue.length) await this.mountQueue(queue);

    // Track the organic prompt for share URL (only if a build actually happened).
    if (queue.length || result.roi) {
      this.originalPrompt = text;
    }
    this.updateUrl();
    this.showChips.set(true); this.busy.set(false); this.focusInput();
  }

  /** First organic visitor prompt (not from URL replay). Used to populate q= */
  private originalPrompt: string | null = null;

  /* ---------- local classifier ---------- */

  private classifyLocally(
    raw: string,
  ):
    | { kind: 'help' }
    | { kind: 'clear' }
    | { kind: 'say'; text: string }
    | { kind: 'surprise' }
    | { kind: 'links' }
    | { kind: 'build'; sections: SectionKey[] }
    | null {
    const s = raw.toLowerCase().trim();
    if (!s) return null;
    if (['help', '?', '/?', 'menu', 'ayuda'].includes(s)) return { kind: 'help' };
    if (['clear', 'cls', 'reset', 'limpiar'].includes(s)) return { kind: 'clear' };
    if (['links', '/links', 'linktree', 'enlaces'].includes(s)) return { kind: 'links' };
    if (['hi', 'hello', 'hey', 'yo', 'hola', 'buenas'].some((g) => s === g)) {
      return { kind: 'say', text: this.isES() ? 'hola. ¿qué quieres construir?' : 'hi. what do you want to build?' };
    }
    if (s === 'surprise' || s === 'surprise me' || s === 'random' || s === 'sorpréndeme' || s === 'sorprendeme') {
      return { kind: 'surprise' };
    }
    for (const c of SECTION_ALLOWLIST) {
      if (s === c || s === '/' + c) return { kind: 'build', sections: [c] };
    }
    return null;
  }

  /* ---------- mount sections / templates with scroll fix ---------- */

  /** Queue entry: a section OR a template, ready to mount. */
  private buildSectionEntry(
    k: SectionKey,
    extra?: { roi?: RoiPayload | null; noun?: string | null; hideRoi?: boolean; score?: number },
  ): SectionMount {
    return {
      id: uid(),
      kind: k,
      noun: extra?.noun ?? null,
      roi: extra?.roi ?? null,
      hideRoi: extra?.hideRoi ?? false,
      score: extra?.score,
    };
  }

  private buildTemplateEntry(t: {
    kind: TemplateKind;
    ref?: string;
    data: unknown;
    langFallback?: boolean;
    score?: number;
  }): TemplateMount {
    return {
      id: uid(),
      kind: 'template',
      tplKind: t.kind,
      ref: t.ref,
      data: t.data,
      langFallback: t.langFallback,
      score: t.score,
    };
  }

  /** Mount a heterogeneous queue of items (sections + templates).
   *  Caps at 3 total, deduplicates by mountKey, runs painter animation. */
  private async mountQueue(queue: Mounted[]): Promise<void> {
    // Score-sort: visitor-triggered items (score 2) beat LLM-volunteered (score 1).
    // Stable sort.
    const sorted = [...queue].sort((a, b) => (b.score ?? 1) - (a.score ?? 1));
    // Drop duplicates of items already mounted (custom is special-cased — always mount fresh).
    const seen = new Set(this.mounted().map(mountKey));
    const toMount: Mounted[] = [];
    for (const item of sorted) {
      const key = mountKey(item);
      const isCustom = item.kind === 'custom';
      if (!seen.has(key) || isCustom) {
        toMount.push(item);
        seen.add(key);
      }
    }
    const capped = toMount.slice(0, 3);

    const isFirstSequence = !this.firstMountScrolled;
    for (let i = 0; i < capped.length; i++) {
      const item = capped[i];
      const label = item.kind === 'template'
        ? `${item.tplKind}${item.ref ? ':' + item.ref : ''}`
        : item.kind;
      await this.typeLine({ kind: 'build', prefix: '  $', text: `build.section --kind ${label}` });
      await this.constructionAnimation(i);
      this.mounted.update((prev) => [...prev, item]);
      this.composed.set(true);
      this.observeBar();
      await this.scrollAfterMount(label, isFirstSequence && i === 0);
    }
    this.firstMountScrolled = true;
  }

  /** Legacy callers (heuristic plan, URL replay, surprise) — still want a simple list of section keys. */
  private async renderSections(
    keys: SectionKey[],
    extra?: { roi?: RoiPayload | null; noun?: string | null; hideRoi?: boolean },
  ): Promise<void> {
    const queue: Mounted[] = keys.map((k) =>
      this.buildSectionEntry(k, { ...extra, score: 1 })
    );
    await this.mountQueue(queue);
  }

  /** Painter metaphor for "the agent is building this section right now".
      ES: bosquejando · entintando · pintando · firmado
      EN: sketching · inking · painting · live
      Step 0 (first in a sequence) is full speed (~0.8s).
      Steps >0 are compressed (~0.5s) so 3 sections feel coherent within ~1.8s total. */
  private async constructionAnimation(idxInSequence: number): Promise<void> {
    const es = this.isES();
    const steps = es
      ? ['bosquejando', 'entintando', 'pintando', 'firmado']
      : ['sketching', 'inking', 'painting', 'live'];

    const compress = idxInSequence > 0;
    const stepTick = compress ? 60 : 110;          // dot tick delay
    const paintBar = compress ? 300 : 560;         // total paint bar duration (only step 3 has bar)
    const finalGap = compress ? 80 : 140;

    const id = uid();
    this.lines.update((prev) => [...prev, { id, kind: 'muted', prefix: '   ', text: '· · · ·' }]);

    // step 0–2 fade in as dots → labels
    for (let s = 0; s < 3; s++) {
      if (this.cancelled) return;
      const so_far = steps.slice(0, s + 1).join(' · ');
      this.lines.update((prev) => prev.map((l) => l.id === id ? { ...l, text: '   ' + so_far } : l));
      await this.sleep(stepTick * 2);
    }

    // step 3 has a paint bar inline
    const total = 10;
    for (let i = 1; i <= total; i++) {
      if (this.cancelled) return;
      const filled = '█'.repeat(i) + '·'.repeat(total - i);
      const txt = '   ' + steps.slice(0, 3).join(' · ') + ' · [' + filled + ']';
      this.lines.update((prev) => prev.map((l) => l.id === id ? { ...l, text: txt } : l));
      await this.sleep(paintBar / total);
    }
    // flip to final label
    this.lines.update((prev) => prev.map((l) => l.id === id ? { ...l, text: '   ' + steps.join(' · ') } : l));
    await this.sleep(finalGap);
  }

  private scrollAfterMount(key: string, isFirstSequence: boolean): Promise<void> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const list = this.doc.querySelectorAll<HTMLElement>('.md-mounted-section');
          const target = Array.from(list).find((el) => el.dataset['key'] === key);
          if (!target) { resolve(); return; }
          const wrap = target.querySelector<HTMLElement>('.mount-wrap');
          const finish = (): void => {
            if (isFirstSequence) {
              // Re-read offsetHeight of sticky bar synchronously to set scroll-margin-top.
              const bar = this.stickyBar?.nativeElement;
              if (bar) {
                this.doc.documentElement.style.setProperty('--agent-bar-h', `${bar.offsetHeight || 56}px`);
              }
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              // Subsequent mounts: pulse the tag, do not steal scroll.
              target.classList.add('pulse-tag');
              setTimeout(() => target.classList.remove('pulse-tag'), 1200);
            }
            resolve();
          };
          if (wrap && wrap.getAnimations && wrap.getAnimations().length) {
            Promise.all(wrap.getAnimations().map((a) => a.finished.catch(() => null))).then(finish);
          } else if (wrap) {
            wrap.addEventListener('animationend', finish, { once: true });
            // safety net
            setTimeout(finish, 800);
          } else {
            finish();
          }
        });
      });
    });
  }

  /* ---------- share URL ---------- */

  private updateUrl(): void {
    const all = this.mounted();
    const sections = all
      .filter((m): m is SectionMount => m.kind !== 'template' && m.kind !== 'custom')
      .map((m) => m.kind);
    const templates = all
      .filter((m): m is TemplateMount => m.kind === 'template')
      .map((m) => `${m.tplKind}${m.ref ? ':' + m.ref : ''}`)
      .slice(0, 4);
    const params = new URLSearchParams();
    if (sections.length) params.set('cmd', Array.from(new Set(sections)).join(','));
    if (templates.length) params.set('tpl', Array.from(new Set(templates)).join(','));
    const noun = this.visitorNoun();
    if (noun) params.set('for', noun);
    // Include the original prompt as base64. Cap at 140 chars post-encode to avoid bloated URLs
    // and prompt-spoofing pressure. Strip control chars first.
    const prompt = this.originalPrompt;
    if (prompt && !this.replayedPrompt()) {
      const clean = prompt.replace(/[ -]/g, '').slice(0, 140);
      try {
        const b64 = btoa(unescape(encodeURIComponent(clean)));
        params.set('q', b64);
      } catch (_e) { /* noop */ }
    }
    const q = params.toString();
    const newUrl = q ? `${this.doc.location.pathname}?${q}` : this.doc.location.pathname;
    try {
      window.history.replaceState(null, '', newUrl);
    } catch (_e) { /* noop */ }
  }

  shareUrl(): string {
    return this.doc.location.href;
  }

  async copyShare(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.shareUrl());
      this.pushLine({
        kind: 'muted',
        text: this.isES() ? '▸ link copiado al portapapeles.' : '▸ link copied to clipboard.',
      });
      this.scheduleScrollTerminal();
    } catch (_e) { /* noop */ }
  }

  /* ---------- input width / lang ---------- */

  inputWidthCh(): string {
    const v = this.inputValue();
    const placeholderLen = this.busy() ? 0 : this.placeholder().length;
    const len = Math.max(1, v.length || placeholderLen);
    return `${len + 0.5}ch`;
  }

  toggleLang(): void { this.lang.toggle(); }
  goLinks(): void { this.router.navigateByUrl('/links'); }

  /* ---------- particles ---------- */

  private initParticles(): void {
    if (typeof window === 'undefined') return;
    const canvas = this.particlesCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const brand = '#d3de47';

    const resize = (): void => {
      const w = window.innerWidth; const h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = window.innerWidth < 700 ? 14 : 22;
    const makeParticle = (initial: boolean): typeof this.particles[number] => {
      const w = window.innerWidth; const h = window.innerHeight;
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 8,
        r: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.06,
        vy: -(0.04 + Math.random() * 0.1),
        a: 0.18 + Math.random() * 0.42,
        tp: Math.random() * Math.PI * 2,
        tr: 0.005 + Math.random() * 0.01,
      };
    };
    this.particles = Array.from({ length: count }, () => makeParticle(true));

    const hexAlpha = (hex: string, a: number): string => {
      const h = hex.replace('#', '');
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    const tick = (): void => {
      const w = window.innerWidth; const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.x += p.vx; p.y += p.vy; p.tp += p.tr;
        if (p.y < -8 || p.x < -8 || p.x > w + 8) { this.particles[i] = makeParticle(false); continue; }
        const tw = 0.7 + Math.sin(p.tp) * 0.3;
        const alpha = p.a * tw;
        ctx.beginPath(); ctx.fillStyle = hexAlpha(brand, alpha); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = hexAlpha(brand, alpha * 0.18); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
      }
      this.rafId = requestAnimationFrame(tick);
    };
    tick();

    this.resizeHandler = resize;
    window.addEventListener('resize', resize);
  }
}
