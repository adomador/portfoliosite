'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import RiseOverlay from '@/components/RiseOverlay'

const LEAF_SELECTOR = '[data-fleeing-id="leaf"]'

export function useAboutRiseTransition() {
  const router = useRouter()
  const [overlay, setOverlay] = useState<{ leafRect: DOMRect } | null>(null)

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
      const el = document.querySelector(LEAF_SELECTOR)
      if (!el) {
        router.push('/about')
        return
      }
      const leafRect = el.getBoundingClientRect()
      document.body.classList.add('about-rise-sink')
      setOverlay({ leafRect })
    },
    [router]
  )

  const onTransitionEnd = useCallback(() => {
    document.body.classList.remove('about-rise-sink')
    router.push('/about')
  }, [router])

  const aboutOverlayNode = overlay ? (
    <RiseOverlay
      leafRect={overlay.leafRect}
      onTransitionEnd={onTransitionEnd}
    />
  ) : null

  return { handleAboutClick, aboutOverlayNode }
}
