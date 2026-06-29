import { useRef } from 'react'
import { animate, stagger, onScroll, svg, spring } from 'animejs'
import { useAnimeScope } from '../hooks/useAnimeScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Cell = {
  part: string
  title: string
  copy: string
  span: string
  icon: React.ReactNode
}

/** Hand-plotted phosphor-style line icons (stroke-only, drawable). */
const iconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 48 48',
}

const cells: Cell[] = [
  {
    part: 'AN-01',
    title: 'Transitions',
    copy: 'Routes and views that move with intent, never a hard cut.',
    span: 'sm:col-span-2 sm:row-span-1',
    icon: (
      <svg {...iconProps} className="cap-icon h-10 w-10 text-acid">
        <path d="M6 30c8-18 28-18 36 0" />
        <path d="M6 30h36" />
        <circle cx="6" cy="30" r="2.5" />
        <circle cx="42" cy="30" r="2.5" />
      </svg>
    ),
  },
  {
    part: 'AN-02',
    title: 'Physics',
    copy: 'Springs and momentum tuned to feel like real mass.',
    span: 'sm:col-span-1 sm:row-span-2',
    icon: (
      <svg {...iconProps} className="cap-icon h-10 w-10 text-acid">
        <path d="M24 6v8" />
        <path d="M24 14c-4 2-4 6 0 8s4 6 0 8" />
        <circle cx="24" cy="38" r="5" />
      </svg>
    ),
  },
  {
    part: 'AN-03',
    title: 'Gesture',
    copy: 'Drag, throw and snap interactions that answer the hand.',
    span: 'sm:col-span-1 sm:row-span-2',
    icon: (
      <svg {...iconProps} className="cap-icon h-10 w-10 text-acid">
        <path d="M18 24V12a3 3 0 0 1 6 0v10" />
        <path d="M24 18a3 3 0 0 1 6 0v4" />
        <path d="M30 20a3 3 0 0 1 6 0v8c0 7-5 12-12 12s-12-5-12-12v-4a3 3 0 0 1 6 0" />
      </svg>
    ),
  },
  {
    part: 'AN-04',
    title: 'State choreography',
    copy: 'Every state change reads as one motivated move.',
    span: 'sm:col-span-1 sm:row-span-1',
    icon: (
      <svg {...iconProps} className="cap-icon h-10 w-10 text-acid">
        <circle cx="12" cy="24" r="5" />
        <circle cx="36" cy="24" r="5" />
        <path d="M17 24h14" />
      </svg>
    ),
  },
  {
    part: 'AN-05',
    title: 'Performance budget',
    copy: 'Transform and opacity only, locked to a frame budget.',
    span: 'sm:col-span-1 sm:row-span-1',
    icon: (
      <svg {...iconProps} className="cap-icon h-10 w-10 text-acid">
        <path d="M8 36V20" />
        <path d="M18 36V12" />
        <path d="M28 36V24" />
        <path d="M38 36V16" />
      </svg>
    ),
  },
]

export default function Capabilities() {
  const reduce = usePrefersReducedMotion()
  const staticRef = useRef<HTMLElement | null>(null)

  const animatedRef = useAnimeScope<HTMLElement>((_scope, root) => {
    const cellEls = Array.from(root.querySelectorAll<HTMLElement>('.cap-cell'))
    const drawables = cellEls
      .map((cell) => cell.querySelector<SVGPathElement>('.cap-icon path'))
      .filter((p): p is SVGPathElement => p !== null)

    // Hidden until the section enters.
    animate(cellEls, { opacity: 0, y: 24, scale: 0.96, duration: 0 })
    drawables.forEach((path) => {
      const [draw] = svg.createDrawable(path)
      animate(draw, { draw: '0 0', duration: 0 })
    })

    let played = false
    onScroll({
      target: root,
      enter: 'bottom-=80 top',
      onEnter: () => {
        if (played) return
        played = true
        animate(cellEls, {
          opacity: [0, 1],
          y: [24, 0],
          scale: [0.96, 1],
          delay: stagger(70, { grid: [3, 2], from: 'center' }),
          ease: 'outExpo',
          duration: 620,
        })
        drawables.forEach((path, i) => {
          const [draw] = svg.createDrawable(path)
          animate(draw, {
            draw: ['0 0', '0 1'],
            duration: 700,
            delay: 200 + i * 60,
            ease: 'inOutQuad',
          })
        })
      },
    })
  }, !reduce)

  const sectionRef = reduce ? staticRef : animatedRef

  const handleEnter = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce) return
    const icon = e.currentTarget.querySelector<SVGSVGElement>('.cap-icon')
    if (!icon) return
    animate(icon, {
      scale: [1, 1.08, 1],
      ease: spring({ stiffness: 130, damping: 10 }),
    })
  }

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36"
    >
      <h2 className="mb-12 max-w-xl text-balance text-4xl text-paper sm:text-5xl">
        What we engineer.
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-2">
        {cells.map((cell) => (
          <article
            key={cell.part}
            onPointerEnter={handleEnter}
            className={`cap-cell group relative flex flex-col justify-between gap-8 rounded-3xl border border-ink-3 bg-ink-2 p-6 transition-colors duration-300 hover:border-acid/40 ${cell.span}`}
          >
            <div className="flex items-start">{cell.icon}</div>
            <div>
              <h3 className="mb-2 text-xl text-paper">{cell.title}</h3>
              <p className="text-sm leading-relaxed text-mist">{cell.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
