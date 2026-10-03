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
 * Day doesn't fade into night — it falls. While you're in the hero the sky
 * ripens toward golden hour (`--dusk`, 0 → 1), then the moment the Work section
 * crosses DROP_LINE the phase flips and CSS takes over: the sun plummets, the
 * sky slams to black via the transitioned `--night` property, a flare blooms on
 * the horizon and the page takes a small hit. See Atmosphere.module.css.
 *
 * Ink swaps with the sky (the `--ink` @property transitions in globals.css),
 * timed so dark text never sits on a dark sky or light text on a light one.
 */
const DAY: Stop[] = [
  [0.0, [242, 233, 217]],
  [0.55, [238, 223, 198]],
  [1.0, [232, 208, 168]],
]

/** Night keeps deepening with overall page progress after the drop. */
const NIGHT: Stop[] = [
  [0.0, [30, 22, 18]],
  [0.45, [20, 16, 14]],
  [1.0, [10, 9, 8]],
]

/** Fraction of the viewport the top of #work must rise past to trigger the drop. */
const DROP_LINE = 0.5
/** Pixels of slack either side of the line so a jittery scroll can't strobe. */
const DROP_HYSTERESIS = 28
/** Long enough to cover the flare and impact animations. */
const DROP_DURATION_MS = 2600

function sample(stops: Stop[], p: number): string {
  if (p <= stops[0][0]) return toCss(stops[0][1])
  const last = stops[stops.length - 1]
  if (p >= last[0]) return toCss(last[1])

  for (let i = 0; i < stops.length - 1; i++) {
    const [aPos, a] = stops[i]
    const [bPos, b] = stops[i + 1]
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
    let lastP = -1
    let lastDusk = -1
    let night = false
    let dropTimer = 0
    /* Document scroll offset at which #work meets the drop line. */
    let dropAt = Infinity

    const measure = () => {
      const work = document.getElementById('work')
      dropAt = work
        ? work.getBoundingClientRect().top + window.scrollY - window.innerHeight * DROP_LINE
        : Infinity
    }

    const drop = () => {
      window.clearTimeout(dropTimer)
      root.classList.remove('nightfall-drop')
      /* Force a style flush so the animations restart on a quick re-drop. */
      void root.offsetWidth
      root.classList.add('nightfall-drop')
      dropTimer = window.setTimeout(() => root.classList.remove('nightfall-drop'), DROP_DURATION_MS)
    }

    const paint = () => {
      queued = false
      const y = window.scrollY
      const scrollable = root.scrollHeight - window.innerHeight
      const p = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0
      progressRef.current = p

      const wantNight = night ? y > dropAt - DROP_HYSTERESIS : y > dropAt + DROP_HYSTERESIS
      if (wantNight !== night) {
        night = wantNight
        root.dataset.phase = night ? 'night' : 'day'
        if (night && root.classList.contains('nightfall-ready')) drop()
        if (!night) {
          window.clearTimeout(dropTimer)
          root.classList.remove('nightfall-drop')
        }
      }

      const dusk = dropAt > 0 && Number.isFinite(dropAt) ? Math.min(1, Math.max(0, y / dropAt)) : 0
      if (Math.abs(dusk - lastDusk) >= 0.002) {
        lastDusk = dusk
        root.style.setProperty('--dusk', dusk.toFixed(3))
        root.style.setProperty('--surface', sample(DAY, dusk))
      }

      /* Sub-pixel changes aren't worth the style writes. */
      if (Math.abs(p - lastP) < 0.0006) return
      lastP = p
      root.style.setProperty('--p', p.toFixed(4))
      root.style.setProperty('--surface-night', sample(NIGHT, p))
    }

    const schedule = () => {
      if (queued) return
      queued = true
      rafId = requestAnimationFrame(paint)
    }

    const remeasure = () => {
      measure()
      schedule()
    }

    root.dataset.phase = 'day'
    measure()
    paint()
    /* Let the first frame land before enabling transitions, otherwise a deep
       link into the page would replay the whole sunset on load. */
    const enable = window.setTimeout(() => root.classList.add('nightfall-ready'), 60)

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', remeasure)

    /* The document grows as fonts load and images decode; re-measure. */
    const observer = new ResizeObserver(remeasure)
    observer.observe(document.body)

    return () => {
      window.clearTimeout(enable)
      window.clearTimeout(dropTimer)
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', remeasure)
      observer.disconnect()
      root.classList.remove('nightfall-drop')
    }
  }, [])

  return (
    <NightfallContext.Provider value={{ progressRef }}>{children}</NightfallContext.Provider>
  )
}
