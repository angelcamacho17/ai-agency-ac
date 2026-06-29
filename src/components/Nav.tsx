const LINKS = [
  { label: 'Anatomy', href: '#anatomy' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Playground', href: '#playground' },
  { label: 'Process', href: '#process' },
]

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-[64px] max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-acid" />
          <span className="font-mono text-[13px] font-medium tracking-tight">
            studio<span className="text-acid">animae</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[13px] text-mist transition-colors hover:text-paper"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="rounded-full bg-acid px-4 py-2 text-[13px] font-semibold text-ink transition-transform active:scale-[0.97]"
        >
          Start a build
        </a>
      </div>
    </header>
  )
}
