'use client'

import Image from 'next/image'
import { useCanvasNavigation } from '@/contexts/CanvasNavigationContext'
import styles from './WorkSection.module.css'

const CASE_STUDIES = [
  {
    id: 'diezl',
    title: 'Diezl',
    logo: '/work/Diezl.svg',
    cta: 'Designed & built, end to end',
    href: 'https://www.diezlapp.com',
  },
  { id: 'trochi', title: 'Trochi', logo: '/work/Trochi.svg' },
  { id: 'fleetworthy', title: 'Fleetworthy', logo: '/work/FW.svg' },
  { id: 'triumph', title: 'Triumph', logo: '/work/TriumphFAV2.svg' },
] as const

export default function WorkSection() {
  const { goTo } = useCanvasNavigation()

  const onSelectCaseStudy = (id: string) => {
    console.log('Selected case study:', id)
  }

  return (
    <section className={styles.section} aria-label="Work">
      <div className={styles.fireGlow} aria-hidden />

      <div className={styles.content}>
        <div className={styles.contentInner}>
          <button
            type="button"
            className={styles.back}
            onClick={() => goTo('home')}
          >
            ← Back
          </button>
          <div className={styles.grid} aria-label="Case studies">
          {CASE_STUDIES.map((study) => {
            const CardContent = () => (
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
                <span className={styles.cardCta}>
                  {'cta' in study && study.cta
                    ? study.cta
                    : 'Coming soon…'}
                </span>
              </div>
            )

            if ('href' in study && study.href) {
              return (
                <a
                  key={study.id}
                  href={study.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                  data-study={study.id}
                  aria-label={`${study.title} – ${study.cta}`}
                >
                  <CardContent />
                </a>
              )
            }

            return (
              <button
                key={study.id}
                type="button"
                className={styles.card}
                data-study={study.id}
                onClick={() => onSelectCaseStudy(study.id)}
                aria-label={`View ${study.title} case study`}
              >
                <CardContent />
              </button>
            )
          })}
        </div>
        </div>
      </div>
    </section>
  )
}
