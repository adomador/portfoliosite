'use client'

import dynamic from 'next/dynamic'
import { useLabyrinth } from '@/contexts/LabyrinthContext'
import { CandleGlow } from '@/src/remotion/CandleGlow'
import styles from './sections/HomeSection.module.css'

const Player = dynamic(
  () => import('@remotion/player').then((mod) => ({ default: mod.Player })),
  { ssr: false }
)

export default function CandleGlowWrapper() {
  const { landedMap } = useLabyrinth()
  const workLanded = landedMap['work'] ?? false

  return (
    <div
      className={`${styles.candleGlowWrap} ${workLanded ? styles.candleGlowVisible : ''}`}
      aria-hidden
    >
      <Player
        component={CandleGlow}
        durationInFrames={300}
        compositionWidth={400}
        compositionHeight={400}
        fps={30}
        controls={false}
        loop
        autoPlay
        className={styles.candleGlowVideo}
      />
    </div>
  )
}
