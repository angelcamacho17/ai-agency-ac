# Plan review: landing redesign

## Verdict

The plan is structurally competent — it identifies the right files, sequences the work in a reasonable order, and gets the easy contrast call right (dark text on `#d3de47` is fine). But it is shallow on the load-bearing details: the rebrand is a hex-sweep instead of a token migration, the calculator-without-prices design contradicts its own name, the hands animation has no defined end-state (the brand name is *Michelangelo* — the Sistine Chapel reference is the entire point and the plan misses it), and Loom embeds are mounted eagerly. Biggest risk: shipping a brighter, hazier brand that fails visual hierarchy because every existing glow/shadow was tuned for a 70% darker green.

## Critical issues

1. **Glow/shadow opacities are tuned for the old green and will smear on the new yellow-green.**
   The old `#10b981` has relative luminance ≈ 0.40. `#d3de47` is ≈ 0.67 — about 70% brighter. Every `text-shadow: 0 0 60px rgba(16,185,129,0.5)` and `box-shadow: 0 0 40px rgba(16,185,129,0.4)` (see `tailwind.config.js` lines 43-47, 108-112; `styles.scss` lines 78-104; the 74 `rgba(16,185,129,…)`/`rgba(20,184,166,…)` occurrences across the codebase) will read as a yellow haze rather than a sharp glow on dark backgrounds.
   **Fix:** drop alpha by ~30-40% as part of the sweep. `0.5 → 0.32`, `0.6 → 0.4`, `0.8 → 0.55`. Don't preserve the literal alphas. Add a one-time visual QA pass on hero, ROI cards, and process numbers specifically.

2. **The rebrand is a hex sweep, not a token migration. It will rot the next time the brand changes.**
   The plan says "centralize via `tailwind.config.js`" and then immediately does a 96-reference find/replace. Tailwind classes like `text-neon-green` will switch when the token changes; raw `#10b981` and `rgba(16,185,129,…)` in inline `style="…"` and component `styles: [\`…\`]` blocks will not.
   **Fix:** introduce CSS custom properties on `:root` in `styles.scss`:
   ```scss
   :root {
     --brand: #d3de47;
     --brand-rgb: 211 222 71;
     --accent: #14b8a6; /* see issue #3 */
     --accent-rgb: 20 184 166;
   }
   ```
   Replace inline hexes and rgbas with `rgb(var(--brand-rgb) / 0.5)`. Future rebrands become a one-line change. Tailwind's `colors.neon.green` should reference the var via `colors.neon.green: 'rgb(var(--brand-rgb) / <alpha-value>)'`. Do this BEFORE the sweep — otherwise you do the sweep twice.

3. **`#d3de47` next to `#14b8a6` teal is a warm-cool clash, not a gradient.**
   The current gradients (`linear-gradient(90deg, #10b981, #14b8a6)` in nav, ROI card top-bar, CTA button) work because both stops are cool blue-greens. Yellow-green at 60° hue + teal at 175° hue spans 115° on the wheel — it will look like a stalled rainbow. The plan's "keep teal as-is for richness" is wrong.
   **Fix:** replace teal with a warmer secondary that sits within 30-40° of the brand. Two viable options:
   - `#a8c736` (deeper olive-green) — same family, monochromatic gradient, safest.
   - `#f5d547` (warm gold) — analogous, more energetic, pairs with the brand's slight yellow.
   Recommend **`#a8c736`**. Update `colors.neon.teal` token name to `colors.neon.accent` to avoid the misnomer outliving the change.

4. **"Calculadora de ROI" without prices is no longer an ROI calculator.**
   ROI = (return - investment) / investment. Strip investment, you have a profit projector. Calling it "Calculadora de ROI" is misleading.
   The user said *"calcular usando los precios que el agente ya conoce."* The most useful interpretation is: **use the prices internally, don't expose them, but still surface a payback figure** ("recuperas la inversión en X días"). The plan's interpretation — strip payback entirely — is the less useful read.
   **Fix:** keep prices in code, derive payback from a default agent bundle (e.g., IG-only at $1,997, the cheapest entry point), and show:
   - "Recuperas tu inversión en X días" (no $ shown)
   - "Ganancia extra mensual: $Y"
   - "Ganancia extra anual: $Z"
   Drop the "Inversión total" pill. Drop the agent picker. The investment number stays opaque; the *time-to-recover* is what matters and is genuinely ROI-flavored. If the user really wants prices hidden including payback, rename the section "Proyección de impacto" — but flag it as the weaker option.

5. **The hands animation has no defined end-state. The brand reference is the whole point.**
   "Michelangelo" + two hands reaching toward each other = *The Creation of Adam*. Every visitor who knows the brand name will expect the iconic almost-touching fingers. The plan describes mechanics ("`-30%/+30%` inward to 0") but never specifies what 0 looks like. If the hands meet flat, overlap, or stack centered, the reference is squandered.
   **Fix:** end-state must be: left hand index finger and right hand index finger ~8-12px apart at the horizontal center of the hero, vertically aligned to the headline's baseline. Map scroll progress 0→1 such that at 0.85 the gap is its minimum (pinch the moment) and at 1.0 it stays there (don't let them keep moving past). Also: the existing PNGs in `src/assets/` need to be checked — if they aren't framed/cropped to make this composition possible, they need re-cropping. Planner should open both PNGs and confirm.

6. **`HostListener('window:scroll')` will trigger Angular change detection on every scroll event.**
   Even with `requestAnimationFrame` throttling inside the handler, the listener itself runs inside the Angular zone and triggers a CD cycle for the entire component tree. On a long page with nebula, particles, scroll-reveal directives, and a calculator with signals, this is measurable jank.
   **Fix:** inject `NgZone` and register the listener via `ngZone.runOutsideAngular(() => window.addEventListener('scroll', handler, { passive: true }))` in `ngAfterViewInit`. Update the DOM directly (`element.style.transform = …`), not through bindings. `passive: true` is mandatory.

7. **Loom iframe will be mounted eagerly and ship Loom's full JS on first paint.**
   The plan says "lazy-loaded" but only mentions `loading="lazy"` on the iframe. That defers network, not iframe creation — the embed JS still parses, sets cookies, and contributes to LCP if it's near the top.
   **Fix:** click-to-play poster pattern. Render a static `<button>` with a thumbnail (Loom's API gives a thumbnail URL: `https://cdn.loom.com/sessions/thumbnails/<id>-with-play.gif` or use `og:image`). On click, swap to the iframe. This also sidesteps the cookie/consent issue. Iframe must have `title="Demo de agente AI Michelangelo"` and `allow="fullscreen"`.

## Improvements

1. **Section order: lead with social proof, then demo.**
   The proposed order (Demo → Impacto real → Calculadora → Marcas → Qué construimos → Cómo trabajamos → Escríbenos) puts a 2-minute video before any positioning. Visitors don't know who you are yet. Better: **Hero → Marcas (5s social proof) → Demo (now contextualized) → Impacto real → Qué construimos → Cómo trabajamos → Calculadora → Escríbenos**. Calculator near the bottom converts intent into commitment right before the CTA. The plan also doesn't explicitly list Hero — confirm in writing that it stays as section 0.

2. **Nav needs Demo and Calculadora.**
   `navigation.component.ts` lines 123-128 declare `Inicio, Trabajo, Proceso, Contacto`. The plan ignores nav. After reorder, add `{ label: 'Demo', href: '#demo' }` and `{ label: 'Calculadora', href: '#calculadora' }`. Confirm `#process`, `#work`, `#contact` anchors still resolve (they do — sections keep their IDs in the current code).

3. **Process headline should bake in the 5-day claim, not orbit it.**
   "Cómo trabajamos" + a separate "En menos de 5 días" line splits the message. Use `Cómo trabajamos en <em>menos de 5 días</em>` as the H2, with the italic on the time claim using `font-serif italic text-glow-green` (same treatment as `art` in the hero). Add per-step duration as a small caption: `Día 1`, `Día 2`, `Día 3`, `Día 4-5`. This is credibility — vague "5 days" reads like marketing, dated steps read like a plan.

4. **Process step copy.**
   The user's wording is `Onboarding, Configuración y desarrollo, Fase de prueba, Despliegue`. Pre-write descriptions so the planner doesn't ask the user:
   - *Onboarding (Día 1):* Entendemos tu negocio, definimos objetivos y conectamos tus canales.
   - *Configuración y desarrollo (Día 2-3):* Construimos tu agente con tu tono, tus datos y tu lógica de venta.
   - *Fase de prueba (Día 4):* Tú lo pruebas en escenarios reales. Nosotros ajustamos hasta que cierre como tú.
   - *Despliegue (Día 5):* Lo conectamos a producción. Empieza a trabajar 24/7.

5. **Refactor the calculator math into a shared service — don't duplicate.**
   The page calculator at `src/app/pages/roi/roi.component.ts` has all the math as `computed()` signals. Extract into `src/app/services/roi-calculator.service.ts` with the agent definitions, pricing rules, and pure derivation functions. Both the `/roi` page and the new landing section consume it. One source of truth, no drift when prices change. The plan's "build a new component" is the wrong instinct.

6. **Calculator defaults need a sanity check for first impression.**
   Current defaults: `lostConversations=150, closeRate=25%, avgProfit=$200, recoveryRate=70%`. Math: 150 × 0.7 × 0.25 × $200 = $5,250/mo extra → $63K/yr. Against the IG agent at $1,997, payback ≈ 11 days. That's a defensible first-impression number, but `closeRate=25%` is aggressive for a cold-DM context (industry is more like 5-15%). On the **landing**, drop to `closeRate=15%`. That gives ~$3,150/mo, payback ~19 days — still impressive, less likely to read as fantasy and trigger skepticism. Keep page-page defaults as-is.

7. **IG CTA: use the safe URL, scope the gradient to the button only.**
   - `https://ig.me/m/michelangelo.devs` requires the account to have DM-from-link enabled. Verify before shipping. Safer fallback: open with `https://instagram.com/michelangelo.devs` and let the user start the DM themselves.
   - Recommend: primary CTA button → `https://ig.me/m/michelangelo.devs`, with a small secondary link "o visita @michelangelo.devs" → profile URL. Covers both paths.
   - Section background stays on-brand (`bg-dark-900` + brand glow). Only the button uses the IG gradient. Do NOT bleed `#833ab4 → #fd1d1d → #fcb045` into the section background — it will visually fight the yellow-green H2 above it.
   - White text on the IG gradient: midpoint `#fd1d1d` has L ≈ 0.21, contrast vs white ≈ 4.5:1 — passes AA at body sizes, barely. Add `font-weight: 700` and `font-size: ≥ 16px` and you're safe. `#fcb045` end has L ≈ 0.59, white-on-it is ~2.5:1 and **fails**. Either: (a) place the white text on the dark side of the gradient, (b) use dark text (`#0a0a0a`, contrast ~9:1 against the orange end, ~3.7:1 against red — borderline), or (c) add a `text-shadow: 0 1px 2px rgba(0,0,0,0.5)` to anchor the label. Recommend (a): gradient direction `135deg` from purple to orange, label left-aligned with icon on the right so the text sits on the dark half.

8. **Hands: preload, fetchpriority, and asset path.**
   Hands are above-the-fold. Add to `src/index.html` `<head>`:
   ```html
   <link rel="preload" as="image" href="/michelangelo_hand_left.png" fetchpriority="high">
   <link rel="preload" as="image" href="/michelangelo_hand_right.png" fetchpriority="high">
   ```
   `angular.json` line 26-31 confirms `public/` is the assets root, so paths resolve at `/`. Move both PNGs from `src/assets/` to `public/`. Also: check file sizes — if either is over ~150KB, run through a compressor (these are decorative, target ~80KB each, with WebP + PNG fallback via `<picture>`).

9. **Reduced-motion for hands AND existing animations.**
   `styles.scss` already has a global `@media (prefers-reduced-motion: reduce)` block that kills animations (lines 53-63). It uses `animation-duration: 0.01ms` — that handles CSS animations but **not JS-driven transforms**. The hands handler must check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and either skip the listener entirely (hands fixed at end-state) or skip mounting the component. Same applies to the calculator slider transitions (currently fine — CSS-driven).

10. **Mobile hands: disable below 768px.**
    Touch scroll momentum + fixed-position images + low-end mobile = poor experience. Hide the component below `md:` breakpoint with a class on the host. The hero text already works without them.

11. **Z-index for hands.**
    Hero uses `app-nebula-background` and `app-particles` (see `hero.html` lines 7-8). Particles are presumably absolutely positioned at z-index 0/1; content is `z-10`. Hands should sit between particles and content: `z-index: 5`, `pointer-events: none`. Verify by reading `particles.component.ts` if needed — but `z-5` between known layers is the safe call.

12. **Order of work: structure first, color last.**
    The plan does color first. Wrong. If you change color first, every subsequent structural change (new demo, new calculator, hands, IG button) gets built against an unfamiliar palette and you re-tune glows twice. Better order:
    1. Remove philosophy import + section reorder (5 min, mechanical).
    2. Add demo section component with placeholder background.
    3. Update process step content + headline.
    4. Refactor calculator math into shared service; build trimmed landing variant.
    5. Replace CTA section content with IG button.
    6. Build hands animation component.
    7. Token migration + color sweep + glow opacity tuning. **Single polish pass** with all sections visible — eyes can compare consistency across the whole page in one pass.
    8. Nav update (anchors).
    9. Build, dev-server walk-through on desktop + 375px mobile.

13. **Philosophy removal: leave the file, drop the import.**
    Plan is right that standalone Angular components are tree-shaken when unimported. Confirmed — remove the `import { PhilosophyComponent }` line and the `<app-philosophy>` tag in `home.component.ts`, leave the file. Bundle stays clean. If kept after a sprint, delete the file.

14. **`aspect-ratio: 16 / 9` over padding-bottom hack.**
    Plan's `padding-bottom: 56.25%` works but is a 2015 trick. Modern browsers all support `aspect-ratio` (`caniuse` ~96% global). Use it.

## Decisions the reviewer is making for the user

The plan asked 6 open questions. Five have clear defaults; one needs the user.

1. **Keep teal `#14b8a6`?** No. Replace with `#a8c736` (deeper olive-green) — see critical issue #3. Yellow-green + teal is a warm-cool clash.
2. **Adjust `/roi` page prices?** No. Out of scope. The user only asked for landing changes; touching pricing is a separate decision.
3. **Keep Calendly alongside IG?** No. The user explicitly redirected the contact flow to IG. Adding Calendly back hedges and dilutes the message. If they need a meeting they can ask in the DM.
4. **Hands scope: hero-only vs whole-page?** Hero-only. Whole-page would mean the hands stay fixed and continue to obstruct content during all scroll, which is visual noise. Hero-only ties the gesture to brand introduction. Animation completes within first viewport.
5. **Demo section copy preference?** Default: H2 = `Ve cómo trabaja` / subhead = `Un agente cerrando ventas en tiempo real.` (Spanish-first, matches the rest of the site.)
6. **Process step descriptions?** Pre-written above (improvement #4). Don't ask.

**Genuinely needs the user (1 question):**
- **Confirm `https://ig.me/m/michelangelo.devs` is enabled on their IG account.** If they haven't enabled DM-from-link, the link 404s. Test in incognito before shipping. If unconfirmed, fall back to `https://instagram.com/michelangelo.devs` for the primary action.

## Recommended order of work (revised)

1. **Refactor calculator math into `RoiCalculatorService`.** Pure functions + agent constants. No UI changes yet. (`src/app/services/roi-calculator.service.ts`)
2. **Update `home.component.ts`:** drop philosophy import + `<app-philosophy>`, set new section order (Hero → TrustedBrands → Demo → ROI cards → Work → Process → LandingCalculator → CTA → Footer).
3. **Build `DemoSectionComponent`** (`src/app/components/sections/demo/demo.component.ts`) with click-to-play Loom poster pattern. iframe `title` attribute. `aspect-ratio: 16/9`.
4. **Update `ProcessComponent`:** new step data, headline `Cómo trabajamos en <em>menos de 5 días</em>`, per-step day captions.
5. **Build `LandingCalculatorComponent`** (`src/app/components/sections/calculator/calculator.component.ts`) consuming `RoiCalculatorService`. Show: "Recuperas tu inversión en X días", monthly profit, yearly profit. Hide all $ for the investment itself. Defaults `closeRate=15`.
6. **Replace `CtaComponent` content:** IG button with scoped Instagram gradient + secondary profile link. Section background stays on-brand.
7. **Build `HandsScrollComponent`** (`src/app/components/effects/hands-scroll/hands-scroll.component.ts`). `runOutsideAngular` + passive scroll listener + `requestAnimationFrame`. End-state: fingers ~10px apart, vertically centered to headline. Hidden below 768px. Reduced-motion: short-circuit. Mount inside hero, after `<app-particles>`, with `z-5 pointer-events-none`. Move PNGs to `public/`. Add preload to `index.html`.
8. **Update `NavigationComponent`:** add Demo + Calculadora menu items. Replace the Calendly button with the IG link, or leave the "Iniciar Proyecto" label and point it to IG (recommended — keeps nav consistent).
9. **Token migration + color sweep:** introduce CSS custom properties on `:root` in `styles.scss`. Replace `colors.neon.green/teal` token references in `tailwind.config.js` to use the vars. Sweep 96 hexes/rgbas. Drop glow alphas by ~35%. Single visual pass on every section.
10. **Build + dev-server walkthrough at 1440px and 375px.** Tests must pass with no `--no-verify`.

Justification for reorder vs original plan: original plan does color first (item 1) and structure later. That forces you to revisit every glow on every section twice — once when added, once when re-tuned at the end. Doing structure first means color is one focused pass with all UI present.

## Asks for the planner

- **`tailwind.config.js`:** rename `neon.teal` to `neon.accent`, change value to `#a8c736`. Update `colors.neon.green` to reference a CSS var. Drop alphas in `boxShadow.glow-green`, `glow-green-lg`, `glow-teal`, `glow-teal-lg`, `inner-glow`, and the `pulseGlow` keyframe by ~35% (e.g., `0.5 → 0.32`, `0.8 → 0.55`).
- **`styles.scss`:** add `:root { --brand: #d3de47; --brand-rgb: 211 222 71; --accent: #a8c736; --accent-rgb: 168 199 54; }`. Update `.text-glow-green*` and `.text-glow-teal*` to use `rgb(var(--brand-rgb) / …)`. Update scrollbar gradient.
- **`src/app/services/roi-calculator.service.ts`:** create with agent constants (lifted from `pages/roi/roi.component.ts` lines 347-351 and totalInvestment computed at lines 394-413), and pure functions `recoveredConversations(inputs)`, `extraSales(inputs)`, `monthlyProfit(inputs)`, `paybackDays(inputs, agentBundle)`. Both pages consume it.
- **`src/app/pages/home/home.component.ts`:** remove `PhilosophyComponent` import; reorder template (see step 2 above).
- **`src/app/components/sections/demo/demo.component.ts`:** new file. Click-to-play poster → iframe swap. `aspect-ratio: 16/9` wrapper. Iframe `src` only set on click. Iframe `title` attribute. `id="demo"`.
- **`src/app/components/sections/calculator/calculator.component.ts`:** new file. Consumes `RoiCalculatorService`. Defaults `closeRate=15, lostConversations=150, avgProfit=200, recoveryRate=70`. Outputs payback in days, monthly profit, yearly profit. No agent picker. No investment $. `id="calculadora"`.
- **`src/app/components/sections/process/process.component.ts`:** replace `processSteps` array with the 4 new steps + `day` field. Headline becomes `Cómo trabajamos en <span class="font-serif italic text-glow-green">menos de 5 días</span>`. Render `step.day` as a small caption above each step number.
- **`src/app/components/sections/cta/cta.component.ts`:** replace Calendly anchor with IG anchor (`https://ig.me/m/michelangelo.devs`). Style: gradient `linear-gradient(135deg, #833ab4 0%, #fd1d1d 60%, #fcb045 100%)`, white bold text on left half. Below button: `o visita @michelangelo.devs` linking to `https://instagram.com/michelangelo.devs`. Remove email line (or keep as tertiary). Section background unchanged.
- **`src/app/components/effects/hands-scroll/hands-scroll.component.ts`:** new file. Two `<img>` fixed-position, `pointer-events-none`, `z-index: 5`. Constructor injects `NgZone`. Scroll handler registered with `runOutsideAngular` + `passive: true`. Map `scrollY / window.innerHeight` to `progress = clamp(0, 1)`. Left transform: `translateX(calc(-30vw + progress * 30vw))`. Right: mirror. End-state at `progress=1`: index fingers within 8-12px of each other at horizontal center. Skip if `matchMedia('(prefers-reduced-motion: reduce)').matches`. Hide on `<768px` via `hidden md:block` on host.
- **Move `src/assets/michelangelo_hand_left.png` and `…_right.png` to `public/`.** Verify both files compose into the Sistine touch when mirrored — if not, request re-cropped versions.
- **`src/index.html`:** add `<link rel="preload" as="image" href="/michelangelo_hand_left.png" fetchpriority="high">` and right counterpart.
- **`src/app/components/shared/navigation/navigation.component.ts`:** add `{ label: 'Demo', href: '#demo' }` and `{ label: 'Calculadora', href: '#calculadora' }` to `menuItems`. Update the "Iniciar Proyecto" CTA to point to `https://ig.me/m/michelangelo.devs` (or change label to "Habla con nosotros").
- **Pricing in `src/app/pages/roi/roi.component.ts` is unchanged.** Out of scope.
- **Final verification:** `ng build` AND manual walkthrough on `ng serve` at 1440px and 375px viewports. Test scroll animation, demo click-to-play, calculator math, IG link in incognito. No `--no-verify` on commits — fix tests if they fail.
