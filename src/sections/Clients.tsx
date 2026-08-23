import { ArrowUpRight, Globe, InstagramLogo, WhatsappLogo } from '@phosphor-icons/react'
import { CLIENTS, type Client, type ClientLink } from '../content/offer'
import { useReveal } from '../hooks/useReveal'

const ICON: Record<ClientLink['channel'], typeof Globe> = {
  Website: Globe,
  WhatsApp: WhatsappLogo,
  Instagram: InstagramLogo,
}

/**
 * Client logos are shipped as alpha masks and painted in currentColor, so one
 * file reads as paper on the dark tiles and as ink on the lime one.
 */
function Logo({ client, className }: { client: Client; className: string }) {
  if (!client.logo) {
    return <span className={`font-display font-medium leading-none ${className}`}>{client.name}</span>
  }
  return (
    <span
      role="img"
      aria-label={client.name}
      className={`block bg-current ${className}`}
      style={{
        maskImage: `url(${client.logo})`,
        WebkitMaskImage: `url(${client.logo})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'left center',
        WebkitMaskPosition: 'left center',
      }}
    />
  )
}

function Links({ client, dark }: { client: Client; dark?: boolean }) {
  return (
    <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4">
      {client.links.map((l) => {
        const Icon = ICON[l.channel]
        return (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${client.name} on ${l.channel}`}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium ${
              dark ? 'text-ink hover:underline' : 'text-paper hover:text-neo'
            }`}
          >
            <Icon weight={l.channel === 'Website' ? 'regular' : 'fill'} size={15} />
            {l.channel === 'Website' ? 'lidotel.com' : l.channel}
            <ArrowUpRight size={12} />
          </a>
        )
      })}
    </div>
  )
}

function Tile({ client }: { client: Client }) {
  return (
    <li data-reveal className="flex min-h-[11rem] flex-col rounded-2xl bg-ink-2 p-5">
      <Logo client={client} className="h-16 w-full text-xl" />
      <span className="mt-3 text-[13px] text-faint">{client.sector}</span>
      <Links client={client} />
    </li>
  )
}

export default function Clients() {
  const ref = useReveal<HTMLElement>()
  const featured = CLIENTS.find((c) => c.featured)!
  const rest = CLIENTS.filter((c) => !c.featured)
  const beside = rest.slice(0, 4)
  const below = rest.slice(4)

  return (
    <section id="clients" ref={ref} className="chapter">
      <div className="mx-auto grid w-full max-w-[1600px] gap-8 lg:grid-cols-12 lg:gap-6">
        <h2 data-reveal className="display-lg lg:col-span-3 lg:text-[2.4rem] xl:text-[3rem]">
          Already selling for <span className="text-neo">these teams.</span>
        </h2>

        <div className="grid gap-3 lg:col-span-9">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <li
              data-reveal
              className="flex flex-col rounded-2xl bg-neo p-6 text-ink sm:col-span-2 lg:row-span-2"
            >
              <Logo client={featured} className="h-28 w-full lg:h-32" />
              <p className="mt-6 max-w-[34ch] text-base leading-relaxed lg:text-lg">{featured.copy}</p>
              <Links client={featured} dark />
            </li>
            {beside.map((c) => (
              <Tile key={c.key} client={c} />
            ))}
          </ul>
          <ul className="grid gap-3 sm:grid-cols-3">
            {below.map((c) => (
              <Tile key={c.key} client={c} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
