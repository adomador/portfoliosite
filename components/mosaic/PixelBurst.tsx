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
import { PixelBurstController } from './mosaicBurst'
import styles from './PixelBurst.module.css'

type PlayOpts = {
  href: string
  sourceRoot: HTMLElement
  origin: { x: number; y: number }
  accent?: string
  /** Case-study page background; used instead of a mid-flight DOM sample. */
  destBg?: string
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

const FADE_MS = 280

export function PixelBurstProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controller = useRef<PixelBurstController | null>(null)
  const playing = useRef(false)
  const pendingHref = useRef<string | null>(null)
  const startRaf = useRef(0)
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>()

  const finish = useCallback(() => {
    const canvas = canvasRef.current
    playing.current = false
    pendingHref.current = null
    if (canvas) {
      canvas.style.transition = ''
      canvas.style.opacity = '1'
      canvas.classList.remove('pixelBurstOn')
    }
    document.documentElement.removeAttribute('data-pixel-burst')
    document.documentElement.style.overflow = ''
  }, [])

  const play = useCallback(
    (opts: PlayOpts) => {
      const canvas = canvasRef.current
      if (!canvas) {
        router.push(opts.href)
        return
      }

      cancelAnimationFrame(startRaf.current)
      clearTimeout(fadeTimer.current)
      controller.current?.cancel()

      canvas.style.transition = ''
      canvas.style.opacity = '1'
      canvas.classList.add('pixelBurstOn')
      playing.current = true
      pendingHref.current = null
      document.documentElement.setAttribute('data-pixel-burst', '')
      document.documentElement.style.overflow = 'hidden'

      startRaf.current = requestAnimationFrame(() => {
        const burst = new PixelBurstController(canvas)
        controller.current = burst
        try {
          burst.start({
            sourceRoot: opts.sourceRoot,
            origin: opts.origin,
            accent: opts.accent,
            destBg: opts.destBg,
            onReadyToNav: () => {
              pendingHref.current = opts.href
              router.push(opts.href)
            },
            onComplete: finish,
          })
        } catch {
          finish()
          router.push(opts.href)
        }
      })
    },
    [finish, router]
  )

  /* Lift the still frame only after the case study has actually painted. */
  useEffect(() => {
    const href = pendingHref.current
    if (!playing.current || !href) return
    const path = href.split('?')[0] || '/'
    if (pathname !== path) return
    const canvas = canvasRef.current
    if (!canvas) {
      finish()
      return
    }
    const id = requestAnimationFrame(() => {
      canvas.style.transition = `opacity ${FADE_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`
      canvas.style.opacity = '0'
    })
    fadeTimer.current = setTimeout(finish, FADE_MS + 40)
    return () => {
      cancelAnimationFrame(id)
      clearTimeout(fadeTimer.current)
    }
  }, [pathname, finish])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(startRaf.current)
      clearTimeout(fadeTimer.current)
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
