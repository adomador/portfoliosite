'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  PIXEL_BURST_MS,
  PixelBurstController,
  type DestWarmOpts,
} from './mosaicBurst'
import styles from './PixelBurst.module.css'

type PlayOpts = {
  href: string
  sourceRoot: HTMLElement
  origin: { x: number; y: number }
  accent?: string
  /** Baked first-fold recipe; particles home into a precomposed picture of this. */
  dest?: DestWarmOpts
}

type PixelBurstApi = {
  play: (opts: PlayOpts) => void
}

const PixelBurstContext = createContext<PixelBurstApi | null>(null)

export function usePixelBurst() {
  const ctx = useContext(PixelBurstContext)
  if (!ctx) throw new Error('usePixelBurst must be used within PixelBurstProvider')
  return ctx
}

/** Last frame already looks like the case study — keep the lift short. */
const FADE_MS = 100
/** Never leave the overlay trapping clicks if nav/reform signals miss each other. */
const SAFETY_MS = PIXEL_BURST_MS + 800

function pathOf(href: string) {
  return href.split('?')[0] || '/'
}

export function PixelBurstProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controller = useRef<PixelBurstController | null>(null)
  const playing = useRef(false)
  const pendingHref = useRef<string | null>(null)
  const reformDone = useRef(false)
  const pageReady = useRef(false)
  const lifting = useRef(false)
  const startRaf = useRef(0)
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>()
  const safetyTimer = useRef<ReturnType<typeof setTimeout>>()
  const pollTimer = useRef<ReturnType<typeof setTimeout>>()

  const finish = useCallback(() => {
    const canvas = canvasRef.current
    playing.current = false
    pendingHref.current = null
    reformDone.current = false
    pageReady.current = false
    lifting.current = false
    clearTimeout(fadeTimer.current)
    clearTimeout(safetyTimer.current)
    clearTimeout(pollTimer.current)
    if (canvas) {
      canvas.style.transition = ''
      canvas.style.opacity = '1'
      canvas.classList.remove('pixelBurstOn')
    }
    document.documentElement.removeAttribute('data-pixel-burst')
    document.documentElement.style.overflow = ''
  }, [])

  const tryLift = useCallback(() => {
    if (!playing.current || lifting.current) return
    if (!reformDone.current || !pageReady.current) return
    const canvas = canvasRef.current
    if (!canvas) {
      finish()
      return
    }
    lifting.current = true
    clearTimeout(safetyTimer.current)
    canvas.style.transition = `opacity ${FADE_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`
    canvas.style.opacity = '0'
    clearTimeout(fadeTimer.current)
    fadeTimer.current = setTimeout(finish, FADE_MS + 40)
  }, [finish])

  const markPageReady = useCallback(() => {
    if (!playing.current || pageReady.current) return
    pageReady.current = true
    tryLift()
  }, [tryLift])

  const play = useCallback(
    (opts: PlayOpts) => {
      const canvas = canvasRef.current
      if (!canvas) {
        router.push(opts.href)
        return
      }

      cancelAnimationFrame(startRaf.current)
      clearTimeout(fadeTimer.current)
      clearTimeout(safetyTimer.current)
      clearTimeout(pollTimer.current)
      controller.current?.cancel()

      canvas.style.transition = ''
      canvas.style.opacity = '1'
      canvas.classList.add('pixelBurstOn')
      playing.current = true
      /* Set early so a fast pathname update can't race past an empty pendingHref. */
      pendingHref.current = opts.href
      reformDone.current = false
      pageReady.current = false
      lifting.current = false
      document.documentElement.setAttribute('data-pixel-burst', '')
      document.documentElement.style.overflow = 'hidden'

      safetyTimer.current = setTimeout(() => {
        if (!playing.current || lifting.current) return
        /* Force the lift even if one signal never arrives — better a hard cut
           than a forever-blocking overlay that eats the back button. */
        reformDone.current = true
        pageReady.current = true
        tryLift()
        if (!lifting.current) finish()
      }, SAFETY_MS)

      startRaf.current = requestAnimationFrame(() => {
        const burst = new PixelBurstController(canvas)
        controller.current = burst
        try {
          burst.start({
            sourceRoot: opts.sourceRoot,
            origin: opts.origin,
            accent: opts.accent,
            dest: opts.dest,
            onReadyToNav: () => {
              pendingHref.current = opts.href
              const destPath = pathOf(opts.href)
              if (window.location.pathname === destPath) markPageReady()
              router.push(opts.href)
              /* Poll in case the pathname effect misses a soft-nav edge case. */
              let tries = 0
              const poll = () => {
                if (!playing.current || pageReady.current) return
                if (window.location.pathname === destPath) {
                  markPageReady()
                  return
                }
                if (++tries < 40) pollTimer.current = setTimeout(poll, 50)
              }
              pollTimer.current = setTimeout(poll, 50)
            },
            onComplete: () => {
              reformDone.current = true
              tryLift()
            },
          })
        } catch {
          finish()
          router.push(opts.href)
        }
      })
    },
    [finish, markPageReady, router, tryLift]
  )

  /* Page must have painted under the reformed frame before we lift. */
  useEffect(() => {
    const href = pendingHref.current
    if (!playing.current || !href) return
    if (pathname !== pathOf(href)) return
    markPageReady()
  }, [pathname, markPageReady])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(startRaf.current)
      clearTimeout(fadeTimer.current)
      clearTimeout(safetyTimer.current)
      clearTimeout(pollTimer.current)
      controller.current?.cancel()
      document.documentElement.removeAttribute('data-pixel-burst')
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <PixelBurstContext.Provider value={{ play }}>
      {children}
      <canvas
        ref={canvasRef}
        id="pixel-burst"
        className={styles.overlay}
        aria-hidden
      />
    </PixelBurstContext.Provider>
  )
}
