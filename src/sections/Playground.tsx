import { useRef, useState } from 'react'
import {
  animate,
  stagger,
  svg,
  utils,
  createDraggable,
  spring,
  createTimer,
} from 'animejs'
import { Hand, ArrowsOutCardinal } from '@phosphor-icons/react'
import { useAnimeScope } from '../hooks/useAnimeScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * Playground - Michelangelo Devs signature interactive.
 * Drag the acid mass inside a bordered tray. Its release rides a real spring,
 * grabbing it nudges every neighbour outward on a radiating spring, and the
 * mass's live displacement is inked as a self-drawing SVG curve in the corner.
 * "Tip the tray" runs a createTimer gravity sweep settling all tokens.
 */

// Stable model for the secondary tokens. Positions are percentages of the tray.
type Token = { id: number; x: number; y: number; r: number; mobile: boolean }
const TOKENS: Token[] = [
  { id: 0, x: 18, y: 26, r: 22, mobile: true },
  { id: 1, x: 72, y: 20, r: 18, mobile: true },
  { id: 2, x: 86, y: 58, r: 24, mobile: false },
  { id: 3, x: 30, y: 70, r: 20, mobile: true },
  { id: 4, x: 60, y: 78, r: 16, mobile: false },
  { id: 5, x: 12, y: 56, r: 17, mobile: true },
  { id: 6, x: 48, y: 16, r: 14, mobile: false },
  { id: 7, x: 80, y: 84, r: 19, mobile: false },
  { id: 8, x: 40, y: 44, r: 15, mobile: true },
  { id: 9, x: 66, y: 50, r: 21, mobile: false },
]

const STIFFNESS = 120
const DAMPING = 12

export default function Playground() {
  const reduce = usePrefersReducedMotion()

  const boundsRef = useRef<HTMLDivElement | null>(null)
  const massRef = useRef<HTMLButtonElement | null>(null)
  const graphRef = useRef<SVGPathElement | null>(null)
  const tokenRefs = useRef<(HTMLDivElement | null)[]>([])

  const [readout, setReadout] = useState({ dx: 0, dy: 0 })

  const rootRef = useAnimeScope<HTMLElement>(() => {
    const mass = massRef.current
    const bounds = boundsRef.current
    const graph = graphRef.current
    if (!mass || !bounds || !graph) return

    const neighbors = tokenRefs.current.filter(
      (el): el is HTMLDivElement => el != null,
    )

    // Live displacement trajectory inked as the mass moves.
    const [graphDraw] = svg.createDrawable(graph)
    const samples: { t: number; v: number }[] = []
    let t0 = 0
    let rafActive = false

    const plot = () => {
      if (samples.length < 2) {
        utils.set(graphDraw, { draw: '0 0' })
        return
      }
      // Map samples (time, displacement) into the 120x60 graph viewBox.
      const first = samples[0]
      const last = samples[samples.length - 1]
      const span = last.t - first.t || 1
      const maxV = Math.max(...samples.map((s) => s.v), 1)
      const pts = samples.map((s) => {
        const px = ((s.t - first.t) / span) * 116 + 2
        const py = 56 - (s.v / maxV) * 52
        return `${px.toFixed(1)} ${py.toFixed(1)}`
      })
      graph.setAttribute('d', `M ${pts.join(' L ')}`)
      utils.set(graphDraw, { draw: '0 1' })
    }

    const tick = () => {
      if (!rafActive) return
      const dx = utils.get(mass, 'translateX', false) as number
      const dy = utils.get(mass, 'translateY', false) as number
      const v = Math.hypot(dx, dy)
      samples.push({ t: performance.now() - t0, v })
      if (samples.length > 120) samples.shift()
      plot()
      setReadout({ dx: Math.round(dx), dy: Math.round(dy) })
      requestAnimationFrame(tick)
    }

    createDraggable(mass, {
      container: bounds,
      releaseEase: spring({ stiffness: STIFFNESS, damping: DAMPING }),
      onGrab: () => {
        samples.length = 0
        t0 = performance.now()
        rafActive = true
        requestAnimationFrame(tick)
        // Neighbour-nudge: radiate a spring outward from the grab.
        animate(neighbors, {
          x: stagger(['-0.6rem', '0.6rem']),
          y: stagger(['-0.4rem', '0.4rem']),
          ease: spring({ stiffness: 90, damping: 8 }),
        })
      },
      onRelease: () => {
        // Neighbours settle back home on a softer spring.
        animate(neighbors, {
          x: 0,
          y: 0,
          ease: spring({ stiffness: 70, damping: 10 }),
        })
        // Keep plotting briefly so the release spring's curve gets inked.
        window.setTimeout(() => {
          rafActive = false
        }, 900)
      },
    })

    return () => {
      rafActive = false
    }
  }, !reduce)

  // Reduced motion: pre-drawn example curve, tokens static, no drag.
  const staticRef = useAnimeScope<HTMLElement>(() => {
    const graph = graphRef.current
    if (!graph) return
    graph.setAttribute(
      'd',
      'M 2 56 L 26 8 L 44 40 L 60 20 L 78 34 L 96 26 L 118 30',
    )
    const [d] = svg.createDrawable(graph)
    utils.set(d, { draw: '0 1' })
  }, reduce)

  const setRoot = (el: HTMLElement | null) => {
    rootRef.current = el
    staticRef.current = el
  }

  const tipTray = () => {
    if (reduce) return
    const all: HTMLElement[] = [massRef.current, ...tokenRefs.current].filter(
      (el): el is HTMLButtonElement | HTMLDivElement => el != null,
    )
    // createTimer-driven gravity sweep: slide all down, settle with stagger.
    createTimer({
      duration: 60,
      onComplete: () => {
        animate(all, {
          y: '8rem',
          rotate: () => utils.random(-12, 12),
          delay: stagger(40, { from: 'first' }),
          ease: spring({ stiffness: 60, damping: 9 }),
          onComplete: () => {
            animate(all, {
              y: 0,
              rotate: 0,
              delay: stagger(35, { from: 'last' }),
              ease: spring({ stiffness: 110, damping: 11 }),
            })
          },
        })
      },
    })
  }

  return (
    <section
      ref={setRoot}
      id="playground"
      className="relative px-6 py-24 sm:px-10 lg:px-16"
    >
      <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="max-w-xl text-balance font-display text-[clamp(2rem,6vw,4rem)] leading-[0.98] text-paper">
            Drag a lead. Watch it route.
          </h2>
          <p className="mt-5 max-w-md font-display text-base text-mist sm:text-lg">
            Every lead that lands gets caught, qualified and routed in real
            time. Grab the node and feel the response.
          </p>
        </div>
        {!reduce && (
          <button
            type="button"
            onClick={tipTray}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-2xl border border-ink-3 bg-ink-2 px-5 py-3 font-mono text-sm uppercase tracking-wide text-paper transition-colors hover:border-acid hover:text-acid sm:self-end"
          >
            <ArrowsOutCardinal weight="bold" size={18} />
            Tip the tray
          </button>
        )}
      </div>

      {/* The bounds tray. */}
      <div
        ref={boundsRef}
        className="relative h-[26rem] w-full overflow-hidden rounded-3xl border border-ink-3 bg-ink-2 sm:h-[32rem]"
      >
        {/* Faint plotting grid inside the tray. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ opacity: 0.1 }}
        >
          <defs>
            <pattern
              id="tray-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="var(--color-faint)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tray-grid)" />
        </svg>

        {/* Secondary tokens. */}
        {TOKENS.map((tk, i) => (
          <div
            key={tk.id}
            ref={(el) => {
              tokenRefs.current[i] = el
            }}
            aria-hidden
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink-3 bg-ink-3 ${
              tk.mobile ? '' : 'hidden sm:block'
            }`}
            style={{
              left: `${tk.x}%`,
              top: `${tk.y}%`,
              width: `${tk.r * 2}px`,
              height: `${tk.r * 2}px`,
            }}
          />
        ))}

        {/* The prominent acid mass node. */}
        <button
          ref={massRef}
          type="button"
          aria-label="Draggable mass"
          className="acid-glow absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none select-none items-center justify-center rounded-full bg-acid text-ink active:cursor-grabbing"
        >
          <Hand weight="fill" size={30} />
        </button>

        {/* Live displacement graph + label, pinned bottom-left. */}
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-2xl border border-ink-3 bg-ink/80 p-3 backdrop-blur-sm">
          <svg
            viewBox="0 0 120 60"
            className="h-14 w-32"
            fill="none"
            preserveAspectRatio="none"
          >
            <line
              x1="2"
              y1="56"
              x2="118"
              y2="56"
              stroke="var(--color-ink-3)"
              strokeWidth="1"
            />
            <path
              ref={graphRef}
              d="M 2 56 L 118 56"
              stroke="var(--color-acid)"
              strokeWidth="2"
            />
          </svg>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-faint">
            displacement / t
          </p>
        </div>

        {/* Mono readouts, pinned bottom-right. */}
        <div className="pointer-events-none absolute bottom-4 right-4 rounded-2xl border border-ink-3 bg-ink/80 p-3 text-right font-mono text-[11px] leading-relaxed text-mist backdrop-blur-sm">
          <p>
            stiffness <span className="text-acid">{STIFFNESS}</span>
          </p>
          <p>
            damping <span className="text-acid">{DAMPING}</span>
          </p>
          <p className="text-faint">
            dx {readout.dx} / dy {readout.dy}
          </p>
        </div>
      </div>

      <p className="mt-5 font-mono text-xs text-faint">
        {reduce
          ? 'fig.04 / release spring, plotted (motion reduced)'
          : 'fig.04 / releaseEase: spring(stiffness 120, damping 12)'}
      </p>
    </section>
  )
}
