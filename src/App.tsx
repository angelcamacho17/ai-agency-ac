import Hero from './sections/Hero'
import Anatomy from './sections/Anatomy'
import Capabilities from './sections/Capabilities'
import Playground from './sections/Playground'
import Process from './sections/Process'
import WordBand from './sections/WordBand'
import FinalCta from './sections/FinalCta'
import { Nav } from './components/Nav'

export default function App() {
  return (
    <div className="grain relative bg-ink text-paper">
      <Nav />
      <main>
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
