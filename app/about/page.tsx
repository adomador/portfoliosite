'use client'

import Link from 'next/link'
import styles from './page.module.css'

export default function AboutPage() {
  return (
    <main className={styles.canvas}>
      <div className={styles.inner}>
        <Link href="/" className={styles.back}>
          ← Back
        </Link>
        <h1 className={styles.title}>About</h1>
        <p className={styles.lead}>
          Through first principles, strategic systems thinking, and a bias toward
          action, I transform ambiguous problems into elegant experiences humans
          enjoy using.
        </p>
        <p className={styles.body}>
          Currently based in Pennsylvania. Enjoy playing chess, reading fiction,
          and hiking.
        </p>
      </div>
    </main>
  )
}
