'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './AboutZoomOverlay.module.css'

const ZOOM_DURATION_MS = 600
const DISSOLVE_START_BEFORE_END_MS = 220

interface AboutZoomOverlayProps {
  rect: DOMRect
  scale: number
  onTransitionEnd: () => void
}

export default function AboutZoomOverlay({
  rect,
  scale,
  onTransitionEnd,
}: AboutZoomOverlayProps) {
  const innerRef = useRef<HTMLDivElement>(null)
  const dissolveRef = useRef<HTMLDivElement>(null)
  const [zooming, setZooming] = useState(false)
  const onTransitionEndRef = useRef(onTransitionEnd)
  onTransitionEndRef.current = onTransitionEnd

  useEffect(() => {
    const raf = requestAnimationFrame(() => setZooming(true))
    const dissolveStart = setTimeout(() => {
      dissolveRef.current?.setAttribute('data-active', 'true')
    }, ZOOM_DURATION_MS - DISSOLVE_START_BEFORE_END_MS)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(dissolveStart)
    }
  }, [])

  const handleDissolveEnd = (e: React.TransitionEvent) => {
    if (e.target !== dissolveRef.current || e.propertyName !== 'opacity') return
    onTransitionEndRef.current()
  }

  return (
    <div className={styles.overlay} aria-hidden>
      <div
        ref={innerRef}
        className={styles.frame}
        style={{
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          transform: zooming ? `scale(${scale})` : 'scale(1)',
        }}
      >
        <img
          src="/about-frame.png"
          alt=""
          className={styles.frameImage}
          draggable={false}
        />
        <div className={styles.frameWindow}>
          <img
            src="/about-hand.png"
            alt=""
            className={styles.hand}
            draggable={false}
          />
        </div>
      </div>
      <div
        ref={dissolveRef}
        className={styles.dissolve}
        onTransitionEnd={handleDissolveEnd}
      />
    </div>
  )
}
