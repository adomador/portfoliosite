'use client'

import { useEffect, useRef } from 'react'
import styles from './FreeFallOverlay.module.css'

const FALL_DURATION_MS = 2500
const DISSOLVE_START_BEFORE_END_MS = 500

interface FreeFallOverlayProps {
  leafRect: DOMRect
  onTransitionEnd: () => void
}

export default function FreeFallOverlay({
  leafRect,
  onTransitionEnd,
}: FreeFallOverlayProps) {
  const dissolveRef = useRef<HTMLDivElement>(null)
  const onTransitionEndRef = useRef(onTransitionEnd)
  onTransitionEndRef.current = onTransitionEnd

  useEffect(() => {
    const dissolveStart = setTimeout(() => {
      dissolveRef.current?.setAttribute('data-active', 'true')
    }, FALL_DURATION_MS - DISSOLVE_START_BEFORE_END_MS)
    return () => clearTimeout(dissolveStart)
  }, [])

  const handleDissolveEnd = (e: React.TransitionEvent) => {
    if (e.target !== dissolveRef.current || e.propertyName !== 'opacity') return
    onTransitionEndRef.current()
  }

  const speedLineCount = 20
  const windParticleCount = 10

  return (
    <div className={styles.overlay} aria-hidden>
      <div className={styles.speedLines}>
        {Array.from({ length: speedLineCount }, (_, i) => (
          <div
            key={i}
            className={styles.speedLine}
            style={{ left: `${(i / (speedLineCount - 1)) * 100}%` }}
          />
        ))}
      </div>
      <div className={styles.windParticles}>
        {Array.from({ length: windParticleCount }, (_, i) => (
          <div key={i} className={styles.windParticle} />
        ))}
      </div>
      <div
        className={styles.leafWrap}
        style={{
          left: leafRect.left,
          top: leafRect.top,
          width: leafRect.width,
          height: leafRect.height,
        }}
      >
        <img
          src="/fall-leaf.svg"
          alt=""
          className={styles.leafImg}
          draggable={false}
        />
      </div>
      <div
        ref={dissolveRef}
        className={styles.dissolve}
        onTransitionEnd={handleDissolveEnd}
      />
    </div>
  )
}
