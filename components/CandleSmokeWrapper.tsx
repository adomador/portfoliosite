'use client'

import { useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useCanvasNavigation } from '@/contexts/CanvasNavigationContext'
import styles from './CandleSmokeWrapper.module.css'

const Player = dynamic(
  () => import('@remotion/player').then((mod) => ({ default: mod.Player })),
  { ssr: false }
)

export default function CandleSmokeWrapper() {
  const { candleSmokeVisible } = useCanvasNavigation()

  const lazyCandleSmoke = useCallback(
    () => import('@/src/remotion/CandleSmoke').then((mod) => ({ default: mod.default })),
    []
  )

  if (!candleSmokeVisible) return null

  return (
    <div className={styles.wrap} aria-hidden>
      <Player
        lazyComponent={lazyCandleSmoke}
        durationInFrames={90}
        compositionWidth={120}
        compositionHeight={120}
        fps={30}
        controls={false}
        loop={false}
        autoPlay
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
