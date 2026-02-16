'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useCanvasNavigation } from '@/contexts/CanvasNavigationContext'
import { BlackholeGalaxy } from '@/src/remotion/BlackholeGalaxy'
import styles from './WorkSection.module.css'

const Player = dynamic(() => import('@remotion/player').then((mod) => ({ default: mod.Player })), {
  ssr: false,
})

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
      <div className={styles.orbit} aria-label="Case studies">
        {/* Blackhole/Galaxy video at center */}
        <div className={styles.storm} aria-hidden>
          <Player
            component={BlackholeGalaxy}
            durationInFrames={300}
            compositionWidth={260}
            compositionHeight={260}
            fps={30}
            controls={false}
            loop
            autoPlay
            className={styles.stormVideo}
          />
        </div>

        {/* Orbiting orbs */}
        <div className={styles.orbitContainer}>
          {CASE_STUDIES.map((study, index) => (
            <button
              key={study.id}
              type="button"
              className={styles.orbPath}
              style={{ ['--orbit-delay' as string]: `${-index * 15}s` }}
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
