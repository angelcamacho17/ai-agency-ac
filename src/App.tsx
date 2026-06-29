import { lazy, Suspense } from 'react'
import Hero from './sections/Hero'
import Anatomy from './sections/Anatomy'
import Capabilities from './sections/Capabilities'
import Playground from './sections/Playground'
import Process from './sections/Process'
import WordBand from './sections/WordBand'
import FinalCta from './sections/FinalCta'
import { Nav } from './components/Nav'
import { useScrollProgressRef } from './three/scroll-progress'

// Three.js is heavy; defer it so the hero copy paints first.
const SculptureCanvas = lazy(() =>
  import('./three/SculptureCanvas').then((m) => ({ default: m.SculptureCanvas })),
)

export default function App() {
  const progress = useScrollProgressRef()

  return (
    <div className="grain relative bg-ink text-paper">
      {/* Morphing 3D sculpture, fixed behind all content. */}
      <Suspense fallback={null}>
        <SculptureCanvas progress={progress} />
      </Suspense>

      {/* Readability scrim: darkens the left text column while letting the
          sculpture (offset right) stay visible. Non-interactive, above canvas. */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(100deg, var(--color-ink) 0%, color-mix(in srgb, var(--color-ink) 78%, transparent) 32%, transparent 62%)',
        }}
      />

      <Nav />
      <main className="relative z-10">
        <Hero />
        <Anatomy />
        <Capabilities />
        <Playground />
        <Process />
        <WordBand />
        <FinalCta />
      </main>
    </div>
  )
}
