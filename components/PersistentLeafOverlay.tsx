'use client'

import { useCanvasNavigation } from '@/contexts/CanvasNavigationContext'
import styles from './PersistentLeafOverlay.module.css'

/**
 * Single leaf that appears during rise/fall transitions so the home leaf
 * appears to blow through the page and land with us on About or Work.
 * Rendered outside the canvas wrapper (fixed to viewport).
 */
export default function PersistentLeafOverlay() {
  const { isTransitioning } = useCanvasNavigation()
  if (!isTransitioning) return null
  return (
    <div className={styles.overlay} aria-hidden>
      <div className={styles.leafWrap}>
        <img
          src="/fall-leaf.svg"
          alt=""
          className={styles.leaf}
          draggable={false}
        />
      </div>
    </div>
  )
}
