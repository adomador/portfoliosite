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
    // Stub: will be wired to navigate to case study section later
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

      {/* Case studies above labyrinth – golden-ratio layout */}
      <div className={styles.aboveLabyrinth} aria-label="Case studies">
        <div className={styles.goldenGrid}>
          {CASE_STUDIES.map((study) => (
            <button
              key={study.id}
              type="button"
              className={styles.caseStudyCard}
              onClick={() => onSelectCaseStudy(study.id)}
              aria-label={`View ${study.title} case study`}
            >
              <div className={styles.orb}>
                <Image
                  src={study.logo}
                  alt=""
                  width={32}
                  height={32}
                  className={styles.orbLogo}
                />
              </div>
              <span className={styles.orbLabel}>{study.title}</span>
            </button>
          ))}
        </div>
      </div>

    </section>
  )
}
