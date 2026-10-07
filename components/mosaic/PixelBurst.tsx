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

export function PixelBurstProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controller = useRef<PixelBurstController | null>(null)
  const targetHref = useRef<string | null>(null)
  const playing = useRef(false)

  const finish = useCallback(() => {
    playing.current = false
    targetHref.current = null
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
      controller.current?.cancel()
      const burst = new PixelBurstController(canvas)
      controller.current = burst
      playing.current = true
      targetHref.current = opts.href
      document.documentElement.setAttribute('data-pixel-burst', '')
      document.documentElement.style.overflow = 'hidden'
      try {
        burst.start({
          sourceRoot: opts.sourceRoot,
          origin: opts.origin,
          accent: opts.accent,
          onReadyToNav: () => router.push(opts.href),
          onComplete: finish,
        })
      } catch {
        finish()
        router.push(opts.href)
      }
    },
    [finish, router]
  )

  useEffect(() => {
    if (!playing.current || !targetHref.current) return
    if (pathname === '/') return
    const burst = controller.current
    if (!burst) return
    let cancelled = false
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (cancelled) return
        const root = document.querySelector('main') ?? document.body
        burst.setDestination(root)
      })
    })
    return () => {
      cancelled = true
      window.cancelAnimationFrame(id)
    }
  }, [pathname])

  useEffect(() => {
    return () => {
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
