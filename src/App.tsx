import Hero from './sections/Hero'
import Capabilities from './sections/Capabilities'
import Agents from './sections/Agents'
import Process from './sections/Process'
import Clients from './sections/Clients'
import Proof from './sections/Proof'
import Questions from './sections/Questions'
import FinalCta from './sections/FinalCta'
import { Nav } from './components/Nav'
import { MobileWhatsappBar } from './components/MobileWhatsappBar'
import { HorizontalTrack } from './components/HorizontalTrack'

/**
 * The page in two movements. First a horizontal journey through who we are,
 * what we build, how and for whom (one chapter per viewport, panned by the
 * scrollbar on wide screens, stacked everywhere else). Then the page resumes
 * vertically for the questions and the Instagram close.
 */
export default function App() {
  return (
    <div className="relative bg-ink text-paper">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Nav />
      <main id="main" className="relative">
        <HorizontalTrack>
          <Hero />
          <Capabilities />
          <Agents />
          <Process />
          <Clients />
          <Proof />
        </HorizontalTrack>
        <Questions />
        <FinalCta />
      </main>
      <MobileWhatsappBar />
    </div>
  )
}
