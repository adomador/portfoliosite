'use client'

import { useRef, useEffect, type ReactNode } from 'react'
import { useLabyrinth, type LandingSpot } from '@/contexts/LabyrinthContext'
import styles from './FleeingButton.module.css'

interface FleeingButtonProps {
  id: string
  landingSpot: LandingSpot
  /** Starting position in viewport % */
  startX?: number
  startY?: number
  /** Optional label shown once landed */
  label?: string
  /** Optional href to navigate when landed and clicked */
  href?: string
  children: ReactNode
  className?: string
}

export default function FleeingButton({
  id,
  landingSpot,
  startX = 50,
  startY = 50,
  label,
  href,
  children,
  className,
}: FleeingButtonProps) {
  const elRef = useRef<HTMLDivElement>(null)
  const { register, landedMap } = useLabyrinth()
  const landed = landedMap[id] ?? false

  useEffect(() => {
    if (!elRef.current) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const sx = (startX / 100) * vw
    const sy = (startY / 100) * vh

    const unregister = register(id, elRef.current, landingSpot, sx, sy)
    return unregister
  }, [id, register, landingSpot.x, landingSpot.y, startX, startY])

  const inner = (
    <>
      <div className={styles.visual}>{children}</div>
      {label && landed && <span className={styles.label}>{label}</span>}
    </>
  )

  return (
    <div
      ref={elRef}
      className={`${styles.fleeing} ${landed ? styles.landed : ''} ${className ?? ''}`}
      data-fleeing-id={id}
    >
      {landed && href ? (
        <a href={href} className={styles.link} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  )
}
