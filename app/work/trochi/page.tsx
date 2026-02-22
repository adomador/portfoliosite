'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import TrochiNavBar from '@/components/trochi/TrochiNavBar'
import styles from './page.module.css'

export default function TrochiCaseStudyPage() {
  const [showOverlay, setShowOverlay] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handleScroll = () => {
      setShowScrollIndicator(el.scrollTop < 50)
    }
    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowOverlay(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (showOverlay) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showOverlay])

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <Link href="/?section=work" className={styles.back}>
          ← Back
        </Link>
        <Image
          src="/work/Trochi_Full_Logo.png"
          alt="Trochi.ai"
          width={180}
          height={48}
          className={styles.logo}
        />
        <div className={styles.copy}>
          <p>
            Trochi is a B2B SaaS startup building a cooperative truckload rate intelligence platform, where the brokers who contribute data also own equity in the company.
          </p>
          <p>
            I led design from zero to one, bringing the MVP concept to life with no prior design foundation. Starting from competitive analysis and deep freight industry knowledge, I defined the product experience before a single screen existed, then designed end-to-end wireframes and a full interactive prototype.
          </p>
          <p>More coming soon...</p>
        </div>
      </aside>

      <div
        ref={scrollRef}
        className={styles.scrollColumn}
        role="region"
        aria-label="Case study content"
      >
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <TrochiNavBar />
          </div>
          {showScrollIndicator && (
            <div className={styles.scrollIndicator} aria-hidden>
              <span className={styles.scrollHint}>Scroll to explore</span>
              <span className={styles.scrollChevron}>↓</span>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <button
            type="button"
            className={styles.imageSection}
            onClick={() => setShowOverlay(true)}
            aria-label="Expand Lane Results full screen"
          >
            <Image
              src="/work/trochi/Lane_Results.svg"
              alt="Lane Results — Dallas, TX to Chicago, IL rate analysis"
              fill
              sizes="(max-width: 860px) 100vw, 75vw"
              className={styles.laneImage}
            />
          </button>
        </section>
      </div>

      {showOverlay &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className={styles.overlay}
            onClick={() => setShowOverlay(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Lane Results full screen"
          >
            <button
              type="button"
              className={styles.overlayClose}
              onClick={(e) => {
                e.stopPropagation()
                setShowOverlay(false)
              }}
              aria-label="Close"
            >
              ×
            </button>
            <div
              className={styles.overlayImageWrap}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src="/work/trochi/Lane_Results.svg"
                alt="Lane Results — Dallas, TX to Chicago, IL rate analysis"
                fill
                sizes="100vw"
                className={styles.overlayImage}
              />
            </div>
          </div>,
          document.body
        )}
    </main>
  )
}
