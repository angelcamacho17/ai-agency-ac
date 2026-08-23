import Hero from './sections/Hero'
import Capabilities from './sections/Capabilities'
import Agent from './sections/Agent'
import Process from './sections/Process'
import Demo from './sections/Demo'
import Clients from './sections/Clients'
import Proof from './sections/Proof'
import Questions from './sections/Questions'
import FinalCta from './sections/FinalCta'
import { Nav } from './components/Nav'
import { MobileWhatsappBar } from './components/MobileWhatsappBar'
import { HorizontalTrack } from './components/HorizontalTrack'
import { LangProvider, useLang } from './lib/lang'

/**
 * Two movements. First a horizontal journey through who we are, what the
 * agent does, how we ship it, the demo and for whom (one chapter per
 * viewport, panned by the scrollbar on wide screens, stacked elsewhere).
 * Then the page resumes vertically for the questions and the Instagram close.
 */
function Page() {
  const { ui } = useLang()
  return (
    <div className="relative bg-ink text-paper">
      <a href="#main" className="skip-link">{ui.skip}</a>
      <Nav />
      <main id="main" className="relative">
        <HorizontalTrack>
          <Hero />
          <Capabilities />
          <Agent />
          <Process />
          <Demo />
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

export default function App() {
  return (
    <LangProvider>
      <Page />
    </LangProvider>
  )
}
