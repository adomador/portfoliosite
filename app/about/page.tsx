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
          Product designer and builder.
        </p>
        <p className={styles.body}>
          This is the About page. You arrived here by zooming into the frame.
        </p>
      </div>
    </main>
  )
}
