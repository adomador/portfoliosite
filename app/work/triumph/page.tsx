'use client'

import Link from 'next/link'
import styles from './page.module.css'

export default function TriumphCaseStudyPage() {
  return (
    <main className={styles.page}>
      <Link href="/?section=work" className={styles.back}>
        ← Back
      </Link>
      <iframe
        src="https://embed.figma.com/proto/RsP4gO086xOThv9KcmwjOO/Triumph-Case-Study?page-id=1%3A2&node-id=1-3&viewport=343%2C481%2C0.22&scaling=contain&content-scaling=fixed&starting-point-node-id=1%3A3&embed-host=share"
        allowFullScreen
        title="Triumph Case Study — Figma presentation"
        className={styles.figmaEmbed}
      />
    </main>
  )
}
