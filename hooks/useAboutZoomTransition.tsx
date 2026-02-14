'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import AboutZoomOverlay from '@/components/AboutZoomOverlay'

const FRAME_SELECTOR = '[data-about-transition-frame]'

export function useAboutZoomTransition() {
  const router = useRouter()
  const [overlay, setOverlay] = useState<{
    rect: DOMRect
    scale: number
  } | null>(null)

  const handleAboutClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        router.push('/about')
        return
      }
      const el = document.querySelector(FRAME_SELECTOR)
      if (!el) {
        router.push('/about')
        return
      }
      const rect = el.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const minDim = Math.min(rect.width, rect.height)
      const maxView = Math.max(vw, vh)
      const scale = (maxView / minDim) * 1.4
      setOverlay({ rect, scale })
    },
    [router]
  )

  const onTransitionEnd = useCallback(() => {
    router.push('/about')
  }, [router])

  const overlayNode = overlay ? (
    <AboutZoomOverlay
      rect={overlay.rect}
      scale={overlay.scale}
      onTransitionEnd={onTransitionEnd}
    />
  ) : null

  return { handleAboutClick, overlayNode }
}
