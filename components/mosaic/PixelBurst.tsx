'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
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

export function PixelBurstProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controller = useRef<PixelBurstController | null>(null)
  const playing = useRef(false)
  const startRaf = useRef(0)

  const finish = useCallback(() => {
    playing.current = false
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
      controller.current?.cancel()

      /* Cover the screen this frame so the click feels instant, then sample. */
      canvas.style.opacity = '1'
      canvas.classList.add('pixelBurstOn')
      playing.current = true
      document.documentElement.setAttribute('data-pixel-burst', '')
      document.documentElement.style.overflow = 'hidden'
      router.prefetch(opts.href)

      startRaf.current = requestAnimationFrame(() => {
        const burst = new PixelBurstController(canvas)
        controller.current = burst
        try {
          burst.start({
            sourceRoot: opts.sourceRoot,
            origin: opts.origin,
            accent: opts.accent,
            destBg: opts.destBg,
            onReadyToNav: () => router.push(opts.href),
            onComplete: finish,
          })
        } catch {
          finish()
          canvas.classList.remove('pixelBurstOn')
          router.push(opts.href)
        }
      })
    },
    [finish, router]
  )

  useEffect(() => {
    return () => {
      cancelAnimationFrame(startRaf.current)
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
