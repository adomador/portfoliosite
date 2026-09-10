'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type MutableRefObject,
} from 'react'

type RGB = [number, number, number]
type Stop = [position: number, color: RGB]

/**
 * The page is one continuous nightfall: parchment at the top, black at the
 * bottom. The surface colour below is interpolated every frame from scroll
 * position, so the descent is genuinely smooth.
 *
 * Text is a different story. Any light-to-dark ramp has to cross mid-luminance,
 * and in that band neither dark nor light ink clears 4.5:1. So the ink does NOT
 * follow the surface continuously — it snaps at PHASE_FLIP and cross-fades over
 * a fixed half second (see the `--ink` @property transitions in globals.css).
 * That keeps contrast on the safe side of the crossover at all times and turns
 * an accessibility problem into a deliberate "the lights just changed" beat.
 */
const SURFACE: Stop[] = [
  [0.0, [242, 233, 217]],
  [0.09, [234, 220, 196]],
  [0.13, [217, 188, 146]],
  [0.17, [168, 123, 74]],
  [0.21, [94, 64, 40]],
  [0.26, [51, 36, 27]],
  [0.34, [36, 27, 22]],
  [0.5, [25, 19, 17]],
  [0.72, [16, 13, 11]],
  [1.0, [10, 9, 8]],
]

/**
 * Where day hands off to night, plus hysteresis so a jittery scroll near the
 * boundary can't strobe. The surface plunges hardest right here, so contrast
 * recovers fast in whichever direction you keep scrolling.
 */
const PHASE_FLIP = 0.17
const PHASE_HYSTERESIS = 0.012

function sampleSurface(p: number): string {
  if (p <= SURFACE[0][0]) return toCss(SURFACE[0][1])
  const last = SURFACE[SURFACE.length - 1]
  if (p >= last[0]) return toCss(last[1])

  for (let i = 0; i < SURFACE.length - 1; i++) {
    const [aPos, a] = SURFACE[i]
    const [bPos, b] = SURFACE[i + 1]
    if (p >= aPos && p <= bPos) {
      const t = bPos === aPos ? 0 : (p - aPos) / (bPos - aPos)
      return toCss([
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
      ])
    }
  }
  return toCss(last[1])
}

const toCss = ([r, g, b]: RGB) =>
  `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`

interface NightfallValue {
  /** Raw scroll progress, 0 at the top of the document, 1 at the bottom. */
  progressRef: MutableRefObject<number>
}

const NightfallContext = createContext<NightfallValue | null>(null)

export function useNightfall() {
  const ctx = useContext(NightfallContext)
  if (!ctx) throw new Error('useNightfall must be used within NightfallProvider')
  return ctx
}

export function NightfallProvider({ children }: { children: ReactNode }) {
  const progressRef = useRef(0)

  useEffect(() => {
    const root = document.documentElement
    let rafId = 0
    let queued = false
    let lastWritten = -1
    let night = false

    const paint = () => {
      queued = false
      const scrollable = root.scrollHeight - window.innerHeight
      const p = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
      progressRef.current = p

      const wantNight = night
        ? p > PHASE_FLIP - PHASE_HYSTERESIS
        : p > PHASE_FLIP + PHASE_HYSTERESIS
      if (wantNight !== night) {
        night = wantNight
        root.dataset.phase = night ? 'night' : 'day'
      }

      /* Sub-pixel changes aren't worth the style writes. */
      if (Math.abs(p - lastWritten) < 0.0006) return
      lastWritten = p
      root.style.setProperty('--p', p.toFixed(4))
      root.style.setProperty('--surface', sampleSurface(p))
    }

    const schedule = () => {
      if (queued) return
      queued = true
      rafId = requestAnimationFrame(paint)
    }

    root.dataset.phase = 'day'
    paint()
    /* Let the first frame land before enabling the half-second ink cross-fade,
       otherwise a deep link into the page fades in from the wrong palette. */
    const enable = window.setTimeout(() => root.classList.add('nightfall-ready'), 60)

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    /* The document grows as fonts load and images decode; re-measure. */
    const observer = new ResizeObserver(schedule)
    observer.observe(document.body)

    return () => {
      window.clearTimeout(enable)
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
    }
  }, [])

  return (
    <NightfallContext.Provider value={{ progressRef }}>{children}</NightfallContext.Provider>
  )
}
