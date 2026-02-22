'use client'

import Link from 'next/link'
import styles from './page.module.css'

export default function TrochiCaseStudyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.fireGlow} aria-hidden />
      <Link href="/#work" className={styles.back}>
        ← Back
      </Link>
    </main>
  )
}
