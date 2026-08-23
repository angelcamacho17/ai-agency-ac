import {
  ArrowsClockwise,
  BookOpenText,
  CalendarCheck,
  ChatsCircle,
  CreditCard,
  Kanban,
  ShieldCheck,
  Translate,
  UserSwitch,
  type Icon,
} from '@phosphor-icons/react'
import { useReveal } from '../hooks/useReveal'
import { useLang } from '../lib/lang'

const ICON: Record<string, Icon> = {
  channels: ChatsCircle,
  knowledge: BookOpenText,
  booking: CalendarCheck,
  payments: CreditCard,
  crm: Kanban,
  handoff: UserSwitch,
  languages: Translate,
  followup: ArrowsClockwise,
  review: ShieldCheck,
}

/** Nine things the agent does, as icon + title. The copy lives in the FAQ. */
export default function Capabilities() {
  const ref = useReveal<HTMLElement>()
  const { t, ui } = useLang()
  const [a, b, c] = ui.capabilitiesH

  return (
    <section id="capabilities" ref={ref} className="chapter">
      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-10 lg:grid-cols-12">
        <h2 data-reveal className="display-lg lg:col-span-4">
          {a} {b}<span className="text-neo">{c}</span>
        </h2>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-8">
          {t.CAPABILITIES.map((cap) => {
            const I = ICON[cap.key]
            return (
              <li
                key={cap.key}
                data-reveal
                className="group flex min-h-[8.5rem] flex-col justify-between rounded-2xl bg-ink-2 p-5 transition-colors duration-300 hover:bg-neo hover:text-ink lg:min-h-[9.5rem]"
              >
                <I size={30} className="text-neo transition-colors group-hover:text-ink" />
                <h3 className="display-sm mt-5">{cap.title}</h3>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
