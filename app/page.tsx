'use client'

import styles from './page.module.css'
import { LabyrinthProvider } from '@/contexts/LabyrinthContext'
import FleeingButton from '@/components/FleeingButton'
import VertigoSpiral from '@/components/VertigoSpiral'
import AmbientLayer from '@/components/AmbientLayer'
import { useIsMobile } from '@/hooks/useIsMobile'

/* ── Landing spot config (% of viewport) ── */

const SPOTS_DESKTOP = {
  leaf:  { x: 28, y: 58 },
  work:  { x: 18, y: 35 },
  about: { x: 78, y: 30 },
  resume: { x: 82, y: 70 },
} as const

/** Mobile: corners with safe spacing for touch (44px+ targets) */
const SPOTS_MOBILE = {
  leaf:  { x: 22, y: 72 },
  work:  { x: 22, y: 18 },
  about: { x: 78, y: 18 },
  resume: { x: 78, y: 82 },
} as const

export default function Home() {
  const isMobile = useIsMobile()
  const SPOTS = isMobile ? SPOTS_MOBILE : SPOTS_DESKTOP

  return (
    <LabyrinthProvider>
      <main className={styles.canvas}>
        {/* Background atmosphere */}
        <AmbientLayer />

        <a href="mailto:alfredo.domador13@gmail.com" className={styles.letsTalk}>
          Let&apos;s talk
        </a>

        {/* ── Center identity ── */}
        <div className={styles.identity}>
          <h1 className={styles.name}>Alfredo Domador</h1>
          <p className={styles.role}>Product Designer | Builder </p>
        </div>

        {/* ── Fleeing leaf ── */}
        <FleeingButton
          id="leaf"
          landingSpot={SPOTS.leaf}
          startX={15}
          startY={20}
          className={styles.leafButton}
        >
          <img
            src="/fall-leaf.svg"
            alt="Falling leaf"
            className={styles.leaf}
            draggable={false}
          />
        </FleeingButton>

        {/* ── Fleeing navigation buttons ── */}
        <FleeingButton
          id="work"
          landingSpot={SPOTS.work}
          startX={80}
          startY={15}
          label="Work"
          className={`${styles.navButton} ${styles.workButton}`}
        >
          <VertigoSpiral />
        </FleeingButton>

        <FleeingButton
          id="about"
          landingSpot={SPOTS.about}
          startX={25}
          startY={80}
          label="About"
          href="mailto:alfredo.domador13@gmail.com"
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
          startX={10}
          startY={55}
          label="Resume"
          href="https://www.dropbox.com/scl/fi/yonshebxqboon6p12u4ik/Domador_Alfredo_Resume_2026.pdf?rlkey=6mvifz3mmb4ornjde3stjkfsv&st=g1c0hajh&dl=0"
          className={styles.navButton}
        >
          <span className={styles.navIcon}>R</span>
        </FleeingButton>
      </main>
    </LabyrinthProvider>
  )
}
