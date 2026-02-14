'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import styles from './EphemeralButton.module.css'

interface EphemeralButtonProps {
  /** Time visible (ms) */
  showDuration?: number
  /** Time hidden (ms) */
  hideDuration?: number
  /** Optional initial delay before first appearance (ms) */
  initialDelay?: number
  /** Fixed position on screen (%) */
  x: number
  y: number
  children: ReactNode
  className?: string
}

export default function EphemeralButton({
  showDuration = 4000,
  hideDuration = 3000,
  initialDelay = 0,
  x,
  y,
  children,
  className,
}: EphemeralButtonProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setVisible(true)
      return
    }

    const cycle = () => {
      setVisible(true)
      timerRef.current = setTimeout(() => {
        setVisible(false)
        timerRef.current = setTimeout(cycle, hideDuration)
      }, showDuration)
    }

    timerRef.current = setTimeout(cycle, initialDelay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [showDuration, hideDuration, initialDelay])

  return (
    <div
      className={`${styles.ephemeral} ${visible ? styles.visible : ''} ${className ?? ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-hidden={!visible}
    >
      {children}
    </div>
  )
}
