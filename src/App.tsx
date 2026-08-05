import { lazy, Suspense } from 'react'
import Hero from './sections/Hero'
import Anatomy from './sections/Anatomy'
import Agents from './sections/Agents'
import Playground from './sections/Playground'
import Process from './sections/Process'
import Questions from './sections/Questions'
import WordBand from './sections/WordBand'
import FinalCta from './sections/FinalCta'
import { Nav } from './components/Nav'
import { MobileWhatsappBar } from './components/MobileWhatsappBar'
import { useJourney } from './three/journey'
import { useStageMode } from './hooks/useStageMode'
import { SceneStage } from './stage/SceneStage'
import { isStaticRender } from './lib/staticMode'

// Three.js is heavy; defer it so the hero copy paints first.
const SculptureCanvas = lazy(() =>
  import('./three/SculptureCanvas').then((m) => ({ default: m.SculptureCanvas })),
)

/** The stream ticker, clipped to the copy column, dissolving toward the
    sculpture's lane so the words read as flowing out of the stream. */
function StreamTicker() {
  return (
    <div className="lg:pl-[46%] lg:[mask-image:linear-gradient(to_right,transparent_42%,black_56%)]">
      <WordBand />
    </div>
  )
}

/**
 * Desktop: the transformation stage. The viewport never travels; chapters
 * dissolve in place on a pinned screen while the sculpture morphs and glides
 * between its lanes. Scroll is only a timeline.
 */
function StagedJourney() {
  return (
    <SceneStage
      scenes={[
        { key: 'top', anchor: 'top', dwell: 50, morphAfter: true, content: <Hero /> },
        { key: 'anatomy', anchor: 'anatomy', dwell: 160, morphAfter: true, content: <Anatomy /> },
        { key: 'agents', anchor: 'agents', dwell: 190, content: <Agents /> },
        { key: 'playground', anchor: 'playground', dwell: 150, morphAfter: true, content: <Playground /> },
        { key: 'process', anchor: 'process', dwell: 140, content: <Process /> },
        { key: 'questions', anchor: 'questions', dwell: 170, content: <Questions /> },
        { key: 'stream', dwell: 70, morphAfter: true, content: <StreamTicker /> },
        { key: 'contact', anchor: 'contact', dwell: 110, content: <FinalCta /> },
      ]}
    />
  )
}

/**
 * Open stage between chapters in document flow: the sculpture owns the screen
 * here while it transforms into its next state (journey.ts maps scroll across
 * these).
 */
function MorphStage() {
  return (
    <div
      data-morph-gap
      aria-hidden="true"
      className="pointer-events-none h-[70vh] sm:h-[85vh]"
    />
  )
}

/**
 * Stacked layouts and reduced motion: the classic scrolling document. The
 * sculpture stays centered behind the copy and dims while text is on screen.
 */
function FlowJourney() {
  return (
    <>
      <div id="top">
        <Hero />
      </div>

      {/* The sculptor -> the mind */}
      <MorphStage />
      <div data-dim-zone id="anatomy">
        <Anatomy />
      </div>

      {/* The mind -> the network */}
      <MorphStage />
      <div data-dim-zone>
        {/* Anchor ids live on these wrappers, never on the sections
            themselves: in staged mode SceneStage puts the same ids on its
            driver rail, and a duplicate on a pinned layer would shadow it and
            break the nav links. */}
        <div id="agents">
          <Agents />
        </div>
        <div id="playground">
          <Playground />
        </div>
      </div>

      {/* The network -> the ascent */}
      <MorphStage />
      <div data-dim-zone id="process">
        <Process />
        <StreamTicker />
      </div>

      {/* The proof room: deliberately calm, objection handling at rest. */}
      <MorphStage />
      <div data-dim-zone id="questions">
        <Questions />
      </div>

      {/* The ascent -> the mark: the brand "m." forms top-center, lifted
          clear of the closing copy, so the finale is never covered. */}
      <MorphStage />
      <div id="contact">
        <FinalCta />
      </div>
    </>
  )
}

export default function App() {
  const { journey, dim } = useJourney()
  const staged = useStageMode()
  // The prerender pass must capture the document, not a WebGL frame. Mounting
  // three.js there would cost seconds and contribute nothing to the snapshot.
  const isStatic = isStaticRender()

  return (
    <div className="grain relative bg-ink text-paper">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* Morphing particle sculpture, fixed behind all content. */}
      {!isStatic && (
        <Suspense fallback={null}>
          <SculptureCanvas journey={journey} dim={dim} />
        </Suspense>
      )}

      {/* Readability scrim: nav strip + a corner-only vignette. The sculpture
          rides the side lanes, so the vignette stays out of them entirely and
          the object is never dimmed by overlays. */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background: [
            'linear-gradient(180deg, color-mix(in srgb, var(--color-ink) 85%, transparent) 0%, transparent 14%)',
            'radial-gradient(140% 105% at 50% 50%, transparent 64%, color-mix(in srgb, var(--color-ink) 55%, transparent) 100%)',
          ].join(', '),
        }}
      />

      <Nav />
      <main id="main" className="relative z-10">
        {staged ? <StagedJourney /> : <FlowJourney />}
      </main>
      <MobileWhatsappBar />
    </div>
  )
}
