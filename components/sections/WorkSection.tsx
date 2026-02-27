'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCanvasNavigation } from '@/contexts/CanvasNavigationContext'
import styles from './WorkSection.module.css'

type CaseStudy = {
  id: string
  title: string
  logo: string
  cta?: string
  href?: string
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'diezl',
    title: 'Diezl',
    logo: '/work/Diezl.svg',
    cta: 'Designed & Built, Solo Project',
    href: 'https://www.diezlapp.com',
  },
  {
    id: 'triumph',
    title: 'Triumph',
    logo: '/work/TriumphFAV2.svg',
    cta: "'22 - '25",
    href: '/work/triumph',
  },
  {
    id: 'trochi',
    title: 'Trochi',
    logo: '/work/Trochi.svg',
    cta: '0 to 1 MVP',
    href: '/work/trochi',
  },
  { id: 'fleetworthy', title: 'Fleetworthy', logo: '/work/FW.svg' },
]

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
              const isExternal = study.href.startsWith('http')
              const label = 'cta' in study && study.cta
                ? `${study.title} – ${study.cta}`
                : `View ${study.title} case study`
              if (isExternal) {
                return (
                  <a
                    key={study.id}
                    href={study.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.card}
                    data-study={study.id}
                    aria-label={label}
                  >
                    <CardContent />
                  </a>
                )
              }
              return (
                <Link
                  key={study.id}
                  href={study.href}
                  className={styles.card}
                  data-study={study.id}
                  aria-label={label}
                >
                  <CardContent />
                </Link>
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
