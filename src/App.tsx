import { lazy, Suspense } from 'react'
import Hero from './sections/Hero'
import Anatomy from './sections/Anatomy'
import Capabilities from './sections/Capabilities'
import Playground from './sections/Playground'
import Process from './sections/Process'
import WordBand from './sections/WordBand'
import FinalCta from './sections/FinalCta'
import { Nav } from './components/Nav'
import { useJourney } from './three/journey'

// Three.js is heavy; defer it so the hero copy paints first.
const SculptureCanvas = lazy(() =>
  import('./three/SculptureCanvas').then((m) => ({ default: m.SculptureCanvas })),
)

/**
 * Open stage between chapters: the sculpture owns the screen here while it
 * transforms into its next state (journey.ts maps scroll across these).
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

export default function App() {
  const { journey, dim } = useJourney()

  return (
    <div className="grain relative bg-ink text-paper">
      {/* Morphing particle sculpture, fixed and centered behind all content. */}
      <Suspense fallback={null}>
        <SculptureCanvas journey={journey} dim={dim} />
      </Suspense>

      {/* Readability scrim: edge vignette + nav strip that keeps the centered
          sculpture visible while pinning contrast where copy lives. */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background: [
            'linear-gradient(180deg, color-mix(in srgb, var(--color-ink) 85%, transparent) 0%, transparent 14%)',
            'radial-gradient(130% 100% at 50% 45%, transparent 52%, color-mix(in srgb, var(--color-ink) 88%, transparent) 100%)',
          ].join(', '),
        }}
      />

      <Nav />
      <main className="relative z-10">
        <Hero />

        {/* Raw block -> carved core */}
        <MorphStage />
        <div data-dim-zone>
          <Anatomy />
        </div>

        {/* Carved core -> agent swarm */}
        <MorphStage />
        <div data-dim-zone>
          <Capabilities />
          <Playground />
        </div>

        {/* Agent swarm -> the stream */}
        <MorphStage />
        <div data-dim-zone>
          <Process />
        </div>

        {/* The stream -> the mark */}
        <MorphStage />
        <WordBand />
        <FinalCta />
      </main>
    </div>
  )
}
