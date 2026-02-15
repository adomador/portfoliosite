'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useCanvasNavigation } from '@/contexts/CanvasNavigationContext'
import styles from './WorkSection.module.css'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const CASE_STUDIES = [
  { id: 'trochi', title: 'Trochi', logo: '/trochi-logo.svg', lottieUrl: '/lane-results-animation.json' },
  { id: 'fleetworthy', title: 'Fleetworthy', logo: '/work/FW.svg', lottieUrl: '/fw-animation.json' },
  { id: 'triumph', title: 'Triumph', logo: '/work/TriumphFAV.svg', lottieUrl: '/triumph-animation.json' },
] as const

/** Genie origin as % from left for each bar icon (0, 1, 2) */
const GENIE_ORIGIN_X = ['25%', '50%', '75%']

export default function WorkSection() {
  const { goTo } = useCanvasNavigation()
  const [isTheaterOpen, setIsTheaterOpen] = useState(false)
  const [isTheaterClosing, setIsTheaterClosing] = useState(false)
  const [activeCaseIndex, setActiveCaseIndex] = useState(0)
  const [genieOriginX, setGenieOriginX] = useState('50%')
  const theaterRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animationCacheRef = useRef<Record<string, object>>({})
  const [animationData, setAnimationData] = useState<object | null>(null)
  const lottieRef = useRef<{ play: () => void } | null>(null)

  const openTheater = useCallback((index: number) => {
    setGenieOriginX(GENIE_ORIGIN_X[index])
    setActiveCaseIndex(index)
    setIsTheaterClosing(false)
    setIsTheaterOpen(true)
  }, [])

  const closeTheater = useCallback(() => {
    if (closeTimeoutRef.current) return
    setIsTheaterClosing(true)
    closeTimeoutRef.current = setTimeout(() => {
      closeTimeoutRef.current = null
      setIsTheaterOpen(false)
      setIsTheaterClosing(false)
    }, 500)
  }, [])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!isTheaterOpen || isTheaterClosing) return
    const study = CASE_STUDIES[activeCaseIndex]
    const url = study.lottieUrl
    if (animationCacheRef.current[url]) {
      setAnimationData(animationCacheRef.current[url])
      return
    }
    setAnimationData(null)
    let cancelled = false
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        animationCacheRef.current[url] = data
        setAnimationData(data)
      })
      .catch(() => {
        if (!cancelled) setAnimationData(null)
      })
    return () => {
      cancelled = true
    }
  }, [isTheaterOpen, isTheaterClosing, activeCaseIndex])

  const goPrev = useCallback(() => {
    setActiveCaseIndex((i) => (i - 1 + CASE_STUDIES.length) % CASE_STUDIES.length)
  }, [])

  const goNext = useCallback(() => {
    setActiveCaseIndex((i) => (i + 1) % CASE_STUDIES.length)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current
      if (dx > 40) goPrev()
      else if (dx < -40) goNext()
    },
    [goPrev, goNext]
  )

  const activeStudy = CASE_STUDIES[activeCaseIndex]

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
        {!isTheaterOpen && (
          <p className={styles.workPrompt}>Select from below to see work</p>
        )}
        {/* Theater: floats above bar, genie effect when opening */}
        {isTheaterOpen && (
          <div
            ref={theaterRef}
            className={`${styles.theater} ${isTheaterClosing ? styles.theaterClosing : ''}`}
            style={{ ['--genie-x' as string]: genieOriginX }}
            role="dialog"
            aria-modal="true"
            aria-label={`Case study: ${activeStudy.title}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              className={styles.theaterClose}
              onClick={closeTheater}
              aria-label="Close"
            >
              ×
            </button>
            <button
              type="button"
              className={styles.theaterArrow}
              onClick={goPrev}
              aria-label="Previous case study"
            >
              ‹
            </button>
            <div className={styles.theaterContent}>
              <div className={styles.theaterLottieWrap}>
                {animationData ? (
                  <Lottie
                    animationData={animationData}
                    lottieRef={lottieRef}
                    loop
                    onDOMLoaded={() => lottieRef.current?.play()}
                    className={styles.theaterLottie}
                  />
                ) : (
                  <div className={styles.theaterLottiePlaceholder}>
                    <Image
                      src={activeStudy.logo}
                      alt=""
                      width={80}
                      height={80}
                      className={styles.theaterLogo}
                    />
                  </div>
                )}
              </div>
              <div className={styles.theaterCopy}>
                <h2 className={styles.theaterTitle}>{activeStudy.title}</h2>
                <p className={styles.theaterPlaceholder}>
                  Coming soon…
                </p>
              </div>
            </div>
            <button
              type="button"
              className={styles.theaterArrow}
              onClick={goNext}
              aria-label="Next case study"
            >
              ›
            </button>
          </div>
        )}

        {/* Bottom bar: click icon to open that case study in theater */}
        <div className={styles.toolsArc} aria-label="Case studies">
          {CASE_STUDIES.map((study, index) => (
            <button
              key={study.id}
              type="button"
              className={`${styles.toolIcon} ${isTheaterOpen && activeCaseIndex === index ? styles.toolIconActive : ''}`}
              title={`Open ${study.title}`}
              onClick={() => openTheater(index)}
              aria-pressed={isTheaterOpen && activeCaseIndex === index}
            >
              <Image src={study.logo} alt="" width={28} height={28} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
