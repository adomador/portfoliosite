'use client'

import Link from 'next/link'
import Image from 'next/image'
import TrochiNavBar from '@/components/trochi/TrochiNavBar'
import styles from './page.module.css'

export default function TrochiCaseStudyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.sidebar}>
        <Link href="/?section=work" className={styles.back}>
          ← Back
        </Link>
        <Image
          src="/work/Trochi_Full_Logo.png"
          alt="Trochi.ai"
          width={180}
          height={48}
          className={styles.logo}
        />
        <div className={styles.copy}>
          <p>
            Trochi Data Corp is a B2B SaaS startup building a cooperative truckload rate intelligence platform, where the brokers who contribute data also own equity in the company.
          </p>
          <p>
            I led design from zero to one, bringing the MVP concept to life with no prior design foundation. Starting from competitive analysis and deep freight industry knowledge, I defined the product experience before a single screen existed, then designed end-to-end wireframes and a full interactive prototype.
          </p>
          <p>More coming soon...</p>
        </div>
      </div>
      <div className={styles.workColumn}>
        <div className={styles.navCenterContent}>
          <TrochiNavBar />
        </div>
      </div>
    </main>
  )
}
