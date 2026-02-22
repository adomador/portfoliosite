'use client'

import Link from 'next/link'
import Image from 'next/image'
import TrochiNavBar from '@/components/trochi/TrochiNavBar'
import styles from './page.module.css'

export default function TrochiCaseStudyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link href="/#work" className={styles.back}>
          ← Back
        </Link>
        <Image
          src="/work/Trochi_Full_Logo.png"
          alt="Trochi.ai"
          width={180}
          height={48}
          className={styles.logo}
        />
      </div>
      <div className={styles.navCenter}>
        <div className={styles.navCenterContent}>
          <TrochiNavBar />
          <p className={styles.comingSoon}>More coming soon…</p>
        </div>
      </div>
    </main>
  )
}
