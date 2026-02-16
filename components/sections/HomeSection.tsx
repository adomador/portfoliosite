'use client'

import styles from './HomeSection.module.css'
import { LabyrinthProvider } from '@/contexts/LabyrinthContext'
import FleeingButton from '@/components/FleeingButton'
import ResumeBook from '@/components/ResumeBook'
import AmbientLayer from '@/components/AmbientLayer'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useCanvasNavigation } from '@/contexts/CanvasNavigationContext'

/* Nav row: structured bottom strip. Leaf stays haphazard (varied spots in LabyrinthContext). */
const SPOTS_DESKTOP = {
  leaf:  { x: 28, y: 58 },
  work:  { x: 25, y: 78 },
  about: { x: 50, y: 78 },
  resume: { x: 75, y: 78 },
} as const

const SPOTS_MOBILE = {
  leaf:  { x: 22, y: 72 },
  work:  { x: 25, y: 82 },
  about: { x: 50, y: 82 },
  resume: { x: 75, y: 82 },
} as const

export default function HomeSection() {
  const isMobile = useIsMobile()
  const SPOTS = isMobile ? SPOTS_MOBILE : SPOTS_DESKTOP
  const { goTo, leafPositionRef } = useCanvasNavigation()

  const onLeafPositionChange = (x: number, y: number, rotation: number) => {
    leafPositionRef.current = { x, y, rotation }
  }

  return (
    <LabyrinthProvider onLeafPositionChange={onLeafPositionChange}>
      <div className={styles.canvas}>
        <AmbientLayer />
        <div className={styles.homeContent}>
          <header className={styles.homeHeader}>
            <a
              href="https://www.linkedin.com/in/adomador13/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkedInLink}
              aria-label="LinkedIn"
            >
              <img src="/linkedin.svg" alt="" className={styles.linkedInIcon} />
            </a>
            <a href="mailto:alfredo.domador13@gmail.com" className={styles.letsTalk}>
              Let&apos;s talk
            </a>
          </header>
          <main className={styles.homeMain}>
            <div className={styles.identity}>
              <h1 className={styles.name}>Alfredo Domador</h1>
              <p className={styles.role}>Product Designer | Builder </p>
            </div>
          </main>
          <div className={styles.homeNav} aria-hidden />
        </div>
        <FleeingButton
          id="leaf"
          landingSpot={SPOTS.leaf}
          startX={50}
          startY={-18}
          kickOnLandedHover
          className={styles.leafButton}
        >
          <img
            src="/fall-leaf.svg"
            alt="Falling leaf"
            className={styles.leaf}
            draggable={false}
          />
        </FleeingButton>
        <FleeingButton
          id="work"
          landingSpot={SPOTS.work}
          startX={25}
          startY={110}
          label="Work"
          onNavigate={() => goTo('work')}
          className={`${styles.navButton} ${styles.workButton}`}
        >
          <img
            src="/work-icon.svg"
            alt=""
            className={styles.workIcon}
            draggable={false}
          />
        </FleeingButton>
        <FleeingButton
          id="about"
          landingSpot={SPOTS.about}
          startX={50}
          startY={110}
          label="About"
          onNavigate={() => goTo('about')}
          className={`${styles.navButton} ${styles.aboutButton}`}
        >
          <div className={styles.aboutFrameWrap}>
            <img
              src="/about-frame.png"
              alt=""
              className={styles.aboutFrame}
              draggable={false}
            />
            <div className={styles.aboutFrameWindow}>
              <img
                src="/about-hand.png"
                alt=""
                className={styles.aboutHand}
                draggable={false}
              />
            </div>
          </div>
        </FleeingButton>
        <FleeingButton
          id="resume"
          landingSpot={SPOTS.resume}
          startX={75}
          startY={110}
          label="Resume"
          href="https://www.dropbox.com/scl/fi/yonshebxqboon6p12u4ik/Domador_Alfredo_Resume_2026.pdf?rlkey=6mvifz3mmb4ornjde3stjkfsv&st=g1c0hajh&dl=0"
          className={`${styles.navButton} ${styles.resumeButton}`}
        >
          <ResumeBook bookClassName={styles.resumeBook} />
        </FleeingButton>
      </div>
    </LabyrinthProvider>
  )
}
