'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'

export default function TriumphCaseStudyPage() {
  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <Link href="/?section=work" className={styles.back}>
          ← Back
        </Link>
        <Image
          src="/work/TriumphFAV2.svg"
          alt="Triumph"
          width={180}
          height={48}
          className={styles.logo}
        />
        <div className={styles.copy}>
          <p>
            Case study presentation — view the embedded Figma prototype below to explore the full deck.
          </p>
        </div>
      </aside>

      <div
        className={styles.contentColumn}
        role="region"
        aria-label="Case study presentation"
      >
        <div className={styles.embedWrapper}>
          <iframe
            style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
            src="https://embed.figma.com/proto/RsP4gO086xOThv9KcmwjOO/Triumph-Case-Study?page-id=1%3A2&node-id=1-3&viewport=343%2C481%2C0.22&scaling=contain&content-scaling=fixed&starting-point-node-id=1%3A3&embed-host=share"
            allowFullScreen
            title="Triumph Case Study — Figma presentation"
            className={styles.figmaEmbed}
          />
        </div>
      </div>
    </main>
  )
}
