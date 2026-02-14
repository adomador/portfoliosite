'use client'

import styles from './page.module.css'
import { LabyrinthProvider } from '@/contexts/LabyrinthContext'
import FleeingButton from '@/components/FleeingButton'
import AmbientLayer from '@/components/AmbientLayer'

/* ── Landing spot config (% of viewport) ── */

const SPOTS = {
  leaf:    { x: 50, y: 45 },
  work:    { x: 18, y: 35 },
  about:   { x: 78, y: 30 },
  contact: { x: 50, y: 75 },
  resume:  { x: 82, y: 70 },
} as const

export default function Home() {
  return (
    <LabyrinthProvider>
      <main className={styles.canvas}>
        {/* Background atmosphere */}
        <AmbientLayer />

        {/* ── Center identity ── */}
        <div className={styles.identity}>
          <h1 className={styles.name}>Alfredo Domador</h1>
          <p className={styles.role}>Product Designer</p>
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
          className={styles.navButton}
        >
          <span className={styles.navIcon}>W</span>
        </FleeingButton>

        <FleeingButton
          id="about"
          landingSpot={SPOTS.about}
          startX={25}
          startY={80}
          label="About"
          href="mailto:alfredo.domador13@gmail.com"
          className={styles.navButton}
        >
          <span className={styles.navIcon}>A</span>
        </FleeingButton>

        <FleeingButton
          id="contact"
          landingSpot={SPOTS.contact}
          startX={70}
          startY={90}
          label="Contact"
          href="mailto:alfredo.domador13@gmail.com"
          className={styles.navButton}
        >
          <span className={styles.navIcon}>C</span>
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
