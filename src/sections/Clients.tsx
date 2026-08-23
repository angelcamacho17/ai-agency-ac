import { ArrowUpRight, Globe, InstagramLogo, WhatsappLogo } from '@phosphor-icons/react'
import { CLIENTS, type Client } from '../content/offer'
import { useReveal } from '../hooks/useReveal'

const ICON: Record<Client['channel'], typeof Globe> = {
  Website: Globe,
  WhatsApp: WhatsappLogo,
  Instagram: InstagramLogo,
}

function ChannelLink({ client, dark }: { client: Client; dark?: boolean }) {
  const Icon = ICON[client.channel]
  const label = client.channel === 'Website' ? 'lidotel.com' : client.channel
  return (
    <a
      href={client.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-auto inline-flex items-center gap-1.5 whitespace-nowrap pt-3 text-[13px] font-medium ${
        dark ? 'text-ink hover:underline' : 'text-paper hover:text-neo'
      }`}
    >
      <Icon weight={client.channel === 'Website' ? 'regular' : 'fill'} size={16} />
      {label}
      <ArrowUpRight size={13} />
    </a>
  )
}

/**
 * The clients, as a bento: the hotel chain gets the wide lime tile, the rest
 * sit in dark tiles around it. Every tile links to the live agent, so the
 * proof is one click away rather than a logo.
 */
export default function Clients() {
  const ref = useReveal<HTMLElement>()
  const featured = CLIENTS.find((c) => c.featured)!
  const rest = CLIENTS.filter((c) => !c.featured)

  return (
    <section id="clients" ref={ref} className="chapter">
      <div className="mx-auto grid w-full max-w-[1600px] gap-8 lg:grid-cols-12 lg:gap-6">
        <h2 data-reveal className="display-lg lg:col-span-3 lg:text-[2.4rem] xl:text-[3rem]">
          Already selling for <span className="text-neo">these teams.</span>
        </h2>

        <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4 lg:grid-rows-3">
          <li
            data-reveal
            className="flex flex-col rounded-2xl bg-neo p-6 text-ink sm:col-span-2 lg:row-span-2"
          >
            <span className="font-display text-xs">{featured.sector}</span>
            <h3 className="display-lg mt-3">{featured.name}</h3>
            <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed lg:text-base">{featured.copy}</p>
            <ChannelLink client={featured} dark />
          </li>

          {rest.map((c) => (
            <li key={c.key} data-reveal className="flex flex-col rounded-2xl bg-ink-2 p-4">
              <span className="font-display text-[10px] text-neo">{c.sector}</span>
              <h3 className="mt-1.5 font-display text-[15px] font-medium leading-tight">{c.name}</h3>
              <p className="mt-1.5 text-[13px] leading-snug text-mist">{c.copy}</p>
              <ChannelLink client={c} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
