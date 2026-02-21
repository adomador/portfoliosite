'use client'

import styles from './TransitionSection.module.css'

type Direction = 'fall' | 'rise'

interface TransitionSectionProps {
  direction: Direction
}

/** Empty section for travel; the single persistent leaf is shown as a fixed overlay during transition. */
export default function TransitionSection({ direction }: TransitionSectionProps) {
  return <section className={styles.section} aria-hidden />
}
