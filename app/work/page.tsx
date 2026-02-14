'use client'

import Link from 'next/link'
import styles from './page.module.css'

export default function WorkPage() {
  return (
    <main className={styles.canvas}>
      <Link href="/" className={styles.back}>
        ← Back
      </Link>
      <div className={styles.leafArrival} aria-hidden>
        <img
          src="/fall-leaf.svg"
          alt=""
          className={styles.leaf}
          draggable={false}
        />
      </div>
    </main>
  )
}
