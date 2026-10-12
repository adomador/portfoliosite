'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './GlitchOverlay.module.css'

const DURATION_MS = 1000

export default function GlitchOverlay() {
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => {
      router.push('/art')
    }, DURATION_MS)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div
      className={styles.overlay}
      aria-hidden
    >
      <div className={styles.rgbRed} />
      <div className={styles.rgbGreen} />
      <div className={styles.rgbBlue} />
      <div className={styles.scanlines} />
      <div className={styles.noise} />
      <div className={styles.flash} />
    </div>
  )
}
