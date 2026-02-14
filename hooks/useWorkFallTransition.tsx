'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import FreeFallOverlay from '@/components/FreeFallOverlay'

const LEAF_SELECTOR = '[data-fleeing-id="leaf"]'

export function useWorkFallTransition() {
  const router = useRouter()
  const [overlay, setOverlay] = useState<{ leafRect: DOMRect } | null>(null)

  const handleWorkClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        router.push('/work')
        return
      }
      const el = document.querySelector(LEAF_SELECTOR)
      if (!el) {
        router.push('/work')
        return
      }
      const leafRect = el.getBoundingClientRect()
      document.body.classList.add('freefall-lift')
      setOverlay({ leafRect })
    },
    [router]
  )

  const onTransitionEnd = useCallback(() => {
    document.body.classList.remove('freefall-lift')
    router.push('/work')
  }, [router])

  const workOverlayNode = overlay ? (
    <FreeFallOverlay
      leafRect={overlay.leafRect}
      onTransitionEnd={onTransitionEnd}
    />
  ) : null

  return { handleWorkClick, workOverlayNode }
}
