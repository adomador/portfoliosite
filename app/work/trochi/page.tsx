'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import TrochiNavBar from '@/components/trochi/TrochiNavBar'
import styles from './page.module.css'

const OVERLAY_IMAGES = {
  laneResults: { src: '/work/trochi/Lane_Results.svg', alt: 'Lane Results — Dallas, TX to Chicago, IL rate analysis' },
  lanesSearch: { src: '/work/trochi/Lanes_Search_Active.svg', alt: 'Lanes Search Active' },
} as const

export default function TrochiCaseStudyPage() {
  const [overlayImage, setOverlayImage] = useState<keyof typeof OVERLAY_IMAGES | null>(null)
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
      if (e.key === 'Escape') setOverlayImage(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (overlayImage) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [overlayImage])

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
            I led design from zero to one, bringing the MVP concept to life with no prior foundation. Using competitive analysis and deep freight industry knowledge, I defined the product experience before a single screen existed, then designed end-to-end wireframes and a full interactive prototype.
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
            <p className={styles.navBarLabel}> Floating Nav Bar</p>
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
            onClick={() => setOverlayImage('laneResults')}
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

        <section className={styles.section}>
          <button
            type="button"
            className={styles.imageSection}
            onClick={() => setOverlayImage('lanesSearch')}
            aria-label="Expand Lanes Search full screen"
          >
            <Image
              src="/work/trochi/Lanes_Search_Active.svg"
              alt="Lanes Search Active"
              fill
              sizes="(max-width: 860px) 100vw, 75vw"
              className={styles.laneImage}
            />
          </button>
        </section>
      </div>

      {overlayImage &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className={styles.overlay}
            onClick={() => setOverlayImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${OVERLAY_IMAGES[overlayImage].alt} full screen`}
          >
            <button
              type="button"
              className={styles.overlayClose}
              onClick={(e) => {
                e.stopPropagation()
                setOverlayImage(null)
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
                src={OVERLAY_IMAGES[overlayImage].src}
                alt={OVERLAY_IMAGES[overlayImage].alt}
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
