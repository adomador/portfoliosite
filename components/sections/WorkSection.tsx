'use client'

import { useCanvasNavigation } from '@/contexts/CanvasNavigationContext'
import styles from './WorkSection.module.css'

export default function WorkSection() {
  const { goTo } = useCanvasNavigation()

  return (
    <section className={styles.section} aria-label="Work">
      <button
        type="button"
        className={styles.back}
        onClick={() => goTo('home')}
      >
        ← Back
      </button>
      <div className={styles.leafArrival} aria-hidden>
        <img
          src="/fall-leaf.svg"
          alt=""
          className={styles.leaf}
          draggable={false}
        />
      </div>
    </section>
  )
}
