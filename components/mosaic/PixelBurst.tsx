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
/** Hold the reconstituted still while the real page decodes underneath. */
const FOLD_WAIT_MS = 700
/** Never leave the overlay up if nav/reform signals miss each other. */
const SAFETY_MS = PIXEL_BURST_MS + 2200

function pathOf(href: string) {
  return href.split('?')[0] || '/'
}

/** Wait until first-fold images have decoded, or time out. Two rAFs after. */
function waitForFirstFold(timeoutMs: number): Promise<void> {
  return new Promise((resolve) => {
    const t0 = performance.now()
    const finish = () => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    }
    const tick = () => {
      if (performance.now() - t0 >= timeoutMs) {
        finish()
        return
      }
      const imgs = document.querySelectorAll('main img')
      let pending = 0
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i] as HTMLImageElement
        const r = img.getBoundingClientRect()
        if (r.height < 48 || r.top > window.innerHeight) continue
        if (!img.complete || img.naturalWidth === 0) pending++
      }
      if (pending === 0) {
        finish()
        return
      }
      window.setTimeout(tick, 40)
    }
    tick()
  })
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
  const foldWait = useRef(false)
  const lifting = useRef(false)
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>()
  const safetyTimer = useRef<ReturnType<typeof setTimeout>>()
  const pollTimer = useRef<ReturnType<typeof setTimeout>>()

  const finish = useCallback(() => {
    const canvas = canvasRef.current
    playing.current = false
    pendingHref.current = null
    reformDone.current = false
    pageReady.current = false
    foldWait.current = false
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

  const armPageReady = useCallback(() => {
    if (!playing.current || pageReady.current || foldWait.current) return
    foldWait.current = true
    void waitForFirstFold(FOLD_WAIT_MS).then(() => {
      foldWait.current = false
      if (!playing.current) return
      pageReady.current = true
      tryLift()
    })
  }, [tryLift])

  const play = useCallback(
    (opts: PlayOpts) => {
      const canvas = canvasRef.current
      if (!canvas) {
        router.push(opts.href)
        return
      }

      clearTimeout(fadeTimer.current)
      clearTimeout(safetyTimer.current)
      clearTimeout(pollTimer.current)
      controller.current?.cancel()

      canvas.style.transition = ''
      canvas.style.opacity = '1'
      canvas.classList.add('pixelBurstOn')
      playing.current = true
      pendingHref.current = opts.href
      reformDone.current = false
      pageReady.current = false
      foldWait.current = false
      lifting.current = false
      document.documentElement.setAttribute('data-pixel-burst', '')
      document.documentElement.style.overflow = 'hidden'

      safetyTimer.current = setTimeout(() => {
        if (!playing.current || lifting.current) return
        reformDone.current = true
        pageReady.current = true
        tryLift()
        if (!lifting.current) finish()
      }, SAFETY_MS)

      /* Start on this turn so the overlay covers the mosaic before we stop it.
         No extra rAF of a dead mosaic. */
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
            router.push(opts.href)
            const destPath = pathOf(opts.href)
            let tries = 0
            const poll = () => {
              if (!playing.current || pageReady.current) return
              if (window.location.pathname === destPath) {
                armPageReady()
                return
              }
              if (++tries < 50) pollTimer.current = setTimeout(poll, 40)
            }
            pollTimer.current = setTimeout(poll, 40)
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
    },
    [armPageReady, finish, router, tryLift]
  )

  useEffect(() => {
    const href = pendingHref.current
    if (!playing.current || !href) return
    if (pathname !== pathOf(href)) return
    armPageReady()
  }, [pathname, armPageReady])

  useEffect(() => {
    return () => {
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
