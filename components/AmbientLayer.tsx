'use client'

import { useCanvasNavigation } from '@/contexts/CanvasNavigationContext'
import styles from './AmbientLayer.module.css'

/**
 * Full-bleed background layer with slowly drifting shapes.
 * Pure CSS animation — no JS, no re-renders.
 * Inspired by Goya chiaroscuro: warm glows against deep dark.
 */
export default function AmbientLayer() {
  const { homeDarkened } = useCanvasNavigation()
  return (
    <div className={`${styles.layer} ${homeDarkened ? styles.layerDarkened : ''}`} aria-hidden="true">
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />
      <div className={`${styles.line} ${styles.line1}`} />
      <div className={`${styles.line} ${styles.line2}`} />
    </div>
  )
}
