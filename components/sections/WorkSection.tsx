'use client'

import Image from 'next/image'
import { useCanvasNavigation } from '@/contexts/CanvasNavigationContext'
import styles from './WorkSection.module.css'

const CASE_STUDIES = [
  { id: 'trochi', title: 'Trochi', logo: '/work/Trochi.svg' },
  { id: 'fleetworthy', title: 'Fleetworthy', logo: '/work/FW.svg' },
  { id: 'triumph', title: 'Triumph', logo: '/work/TriumphFAV2.svg' },
  { id: 'diezl', title: 'Diezl', logo: '/work/Diezl.svg' },
] as const

export default function WorkSection() {
  const { goTo } = useCanvasNavigation()

  const onSelectCaseStudy = (id: string) => {
    console.log('Selected case study:', id)
  }

  return (
    <section className={styles.section} aria-label="Work">
      <div className={styles.fireGlow} aria-hidden />
      <button
        type="button"
        className={styles.back}
        onClick={() => goTo('home')}
      >
        ← Back
      </button>

      <div className={styles.content}>
        <div className={styles.grid} aria-label="Case studies">
          {CASE_STUDIES.map((study) => (
            <button
              key={study.id}
              type="button"
              className={styles.card}
              data-study={study.id}
              onClick={() => onSelectCaseStudy(study.id)}
              aria-label={`View ${study.title} case study`}
            >
              <div className={styles.cardFrame}>
                <div className={styles.cardGlow} aria-hidden />
                <div className={styles.logoWrapper}>
                  <Image
                    src={study.logo}
                    alt=""
                    width={56}
                    height={56}
                    className={styles.logo}
                  />
                </div>
                <span className={styles.cardTitle}>{study.title}</span>
                <span className={styles.cardCta}>Coming soon…</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
