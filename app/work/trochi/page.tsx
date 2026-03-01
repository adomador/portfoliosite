'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import TrochiNavBar from '@/components/trochi/TrochiNavBar'
import styles from './page.module.css'

const PRODUCT_SCREENS = [
  { src: '/work/trochi/screen-1.svg', alt: 'Dashboard — personalized market briefing' },
  { src: '/work/trochi/screen-2.svg', alt: 'Lanes Search — find lanes by intent' },
  { src: '/work/trochi/screen-3.svg', alt: 'Lane Results — spot market intelligence' },
  { src: '/work/trochi/screen-4.svg', alt: 'Market Result — city-level capacity and volatility' },
  { src: '/work/trochi/screen-5.svg', alt: 'Quote — from market insight to quoted rate' },
] as const

const PRODUCT_SUBTITLES = [
  'A personalized market briefing to start the day.',
  'Search as the filter. Find lanes by intent.',
  'Spot market intelligence for a single lane.',
  'Market-level capacity and volatility at a glance.',
  'From insight to quoted rate in one flow.',
] as const

const PERSONAS = [
  {
    id: 'tyler',
    name: 'Tyler',
    role: 'Carrier Sales Rep',
    src: '/work/trochi/persona-tyler.svg',
    alt: 'Tyler — Carrier Sales Rep, Mid-size 3PL',
  },
  {
    id: 'sarah',
    name: 'Sarah',
    role: 'Pricing Analyst',
    src: '/work/trochi/persona-sarah.svg',
    alt: 'Sarah — Pricing Analyst, Large 3PL',
  },
  {
    id: 'james',
    name: 'James',
    role: 'Account Manager',
    src: '/work/trochi/persona-james.svg',
    alt: 'James — Account Manager, Large 3PL',
  },
] as const

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.25

type ExpandedImage = { src: string; alt: string }

export default function TrochiCaseStudyPage() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const [expandedImage, setExpandedImage] = useState<ExpandedImage | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef<HTMLDivElement>(null)
  const overlayWrapRef = useRef<HTMLDivElement>(null)

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
      if (e.key === 'Escape') setExpandedImage(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (expandedImage) {
      document.body.style.overflow = 'hidden'
      setZoom(1)
      setPan({ x: 0, y: 0 })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [expandedImage])

  useEffect(() => {
    const el = overlayWrapRef.current
    if (!expandedImage || !el) return
    const preventScroll = (e: WheelEvent) => e.preventDefault()
    el.addEventListener('wheel', preventScroll, { passive: false })
    return () => el.removeEventListener('wheel', preventScroll)
  }, [expandedImage])

  const handleOverlayWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setZoom((z) => {
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
      return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta))
    })
  }

  const handlePanStart = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    e.preventDefault()
    setIsPanning(true)
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
  }

  const handlePanMove = (e: MouseEvent) => {
    if (!isPanning) return
    setPan({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y,
    })
  }

  const handlePanEnd = () => {
    setIsPanning(false)
  }

  useEffect(() => {
    if (!isPanning) return
    window.addEventListener('mousemove', handlePanMove)
    window.addEventListener('mouseup', handlePanEnd)
    return () => {
      window.removeEventListener('mousemove', handlePanMove)
      window.removeEventListener('mouseup', handlePanEnd)
    }
  }, [isPanning])

  return (
    <main className={styles.page}>
      <Link href="/?section=work" className={styles.back}>
        ← Back
      </Link>

      <div
        ref={scrollRef}
        className={styles.scrollContainer}
        role="region"
        aria-label="Case study content"
      >
        {/* Section 1: Opening — Two column */}
        <section className={styles.section} data-layout="two-col">
          <div className={styles.openingGrid}>
            <div className={styles.sidebarContent}>
              <Image
                src="/work/Trochi_Full_Logo.png"
                alt="Trochi.ai"
                width={180}
                height={48}
                className={styles.logo}
              />
              <div className={styles.copy}>
                <p>
                  Trochi is a B2B SaaS startup building a cooperative truckload
                  rate intelligence platform, where the brokers who contribute
                  data also own equity in the company.
                </p>
                <p>
                  I designed the product from zero to one, bringing the MVP
                  concept to life with no prior foundation. Using competitive
                  analysis and deep freight industry knowledge, I defined the
                  entire experience before a single screen existed, and produced
                  end-to-end wireframes and a full interactive prototype.
                </p>
              </div>
            </div>
            <div className={styles.navDemo}>
              <TrochiNavBar />
              <p className={styles.navBarLabel}>Floating Nav Bar</p>
            </div>
          </div>
          {showScrollIndicator && (
            <div className={styles.scrollIndicator} aria-hidden>
              <span className={styles.scrollHint}>Scroll to explore</span>
              <span className={styles.scrollChevron}>↓</span>
            </div>
          )}
        </section>

        {/* Section 2: Problem Statement — Full width */}
        <section className={styles.section} data-layout="full">
          <p className={styles.problemStatement}>
            Brokers create all the data that powers the freight market. Then they
            pay incumbents to have it resold back to them, stripped of quality
            and timeliness. Trochi flips the model; a broker-owned cooperative
            where contributing data earns you equity, not a subscription bill.
          </p>
        </section>

        {/* Section 3: Users — Full width */}
        <section className={styles.section} data-layout="full">
          <h2 className={styles.sectionHeader}>Who I designed for</h2>
          <p className={styles.sectionSubtext}>
            Three roles, all paying to access data they created.
          </p>
          <div className={styles.personaGrid}>
            {PERSONAS.map((persona) => (
              <button
                key={persona.id}
                type="button"
                className={styles.personaCard}
                onClick={() => setExpandedImage({ src: persona.src, alt: persona.alt })}
                aria-label={`View ${persona.name} persona — ${persona.role}`}
              >
                <div className={styles.personaThumbnail}>
                  <Image
                    src={persona.src}
                    alt=""
                    fill
                    sizes="(max-width: 860px) 100vw, 33vw"
                    className={styles.personaImage}
                  />
                </div>
                <div className={styles.personaMeta}>
                  <span className={styles.personaName}>{persona.name}</span>
                  <span className={styles.personaRole}>{persona.role}</span>
                  <span className={styles.personaExpandHint}>Click to expand</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Section 5: The Product — Five centered snap sections */}
        {PRODUCT_SUBTITLES.map((subtitle, i) => {
          const screen = PRODUCT_SCREENS[i]
          return (
            <section
              key={i}
              className={styles.section}
              data-layout="full"
            >
              <div className={styles.productStack}>
                <p className={styles.productSubtitle}>{subtitle}</p>
                {screen ? (
                  <button
                    type="button"
                    className={styles.productScreen}
                    onClick={() => setExpandedImage({ src: screen.src, alt: screen.alt })}
                    aria-label={`View ${screen.alt} — click to expand`}
                  >
                    <Image
                      src={screen.src}
                      alt={screen.alt}
                      fill
                      sizes="(max-width: 860px) 100vw, 85vw"
                      className={styles.productScreenImg}
                    />
                  </button>
                ) : (
                  <div className={styles.screenPlaceholder}>
                    Screen {i + 1} Placeholder
                  </div>
                )}
              </div>
            </section>
          )
        })}

        {/* Section 6: Outcome — Full width */}
        <section className={styles.section} data-layout="full">
          <p className={styles.outcomeStatement}>
          The prototype was presented at Trochi's invite-only industry conferences and used as a reference tool in early broker recruitment conversations. It became the visual foundation for their pitch to prospective cooperative members.
          </p>
        </section>
      </div>

      {expandedImage &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className={styles.overlay}
            onClick={() => setExpandedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${expandedImage.alt} — expanded view`}
          >
            <button
              type="button"
              className={styles.overlayClose}
              onClick={(e) => {
                e.stopPropagation()
                setExpandedImage(null)
              }}
              aria-label="Close"
            >
              ×
            </button>
            <div className={styles.overlayZoomControls}>
              <button
                type="button"
                className={styles.zoomBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))
                }}
                disabled={zoom <= MIN_ZOOM}
                aria-label="Zoom out"
              >
                −
              </button>
              <span className={styles.zoomLabel} aria-hidden>
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                className={styles.zoomBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))
                }}
                disabled={zoom >= MAX_ZOOM}
                aria-label="Zoom in"
              >
                +
              </button>
            </div>
            <div
              ref={overlayWrapRef}
              className={styles.overlayImageWrap}
              onClick={(e) => e.stopPropagation()}
              onWheel={handleOverlayWheel}
              onMouseDown={handlePanStart}
              style={{
                cursor:
                  zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in',
              }}
              role="img"
              aria-label={`${expandedImage.alt}. Scroll to zoom, drag to pan when zoomed.`}
            >
              <div
                className={styles.overlayZoomContent}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                }}
              >
                <Image
                  src={expandedImage.src}
                  alt={expandedImage.alt}
                  fill
                  sizes="95vw"
                  className={styles.overlayImage}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </main>
  )
}
