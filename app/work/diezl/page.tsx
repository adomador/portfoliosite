import Link from 'next/link'
import styles from './page.module.css'

export default function DiezlCaseStudyPage() {
  return (
    <main className={styles.page}>
      <Link href="/?section=work" className={styles.back}>
        ← Back
      </Link>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Case study</p>
        <h1 className={styles.title}>Diezl</h1>
        <p className={styles.lead}>
          A load profitability calculator for owner-operators. Designed, built, and shipped
          end to end.
        </p>
        <a
          className={styles.live}
          href="https://www.diezlapp.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit diezlapp.com
        </a>
      </div>
    </main>
  )
}
