'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import TrochiNavBar from '@/components/trochi/TrochiNavBar'
import {
  CaseFigure,
  CaseHero,
  CaseIntro,
  CaseSection,
  CaseStats,
  CaseStudy,
  type CaseTheme,
} from '@/components/case-study/CaseStudy'
import CaseCarousel from '@/components/case-study/CaseCarousel'
import styles from './page.module.css'

const THEME: CaseTheme = {
  bg: '#16181d',
  ink: '#f8fafc',
  ink2: 'rgba(212, 217, 227, 0.8)',
  ink3: 'rgba(175, 183, 202, 0.66)',
  rule: 'rgba(175, 183, 202, 0.14)',
  panel: 'rgba(175, 183, 202, 0.04)',
  accent: '#5abf91',
}

const PRODUCT_SCREENS = [
  {
    src: '/work/trochi/screen-1.svg',
    alt: 'Dashboard — personalized market briefing',
    caption: 'A personalized market briefing to start the day.',
  },
  {
    src: '/work/trochi/screen-2.svg',
    alt: 'Lanes Search — find lanes by intent',
    caption: 'Search as the filter. Find lanes by intent.',
  },
  {
    src: '/work/trochi/screen-3.svg',
    alt: 'Lane Results — spot market intelligence',
    caption: 'Spot market intelligence for a single lane.',
  },
  {
    src: '/work/trochi/screen-4.svg',
    alt: 'Market Result — city-level capacity and volatility',
    caption: 'Market-level capacity and volatility at a glance.',
  },
  {
    src: '/work/trochi/screen-5.svg',
    alt: 'Quote — from market insight to quoted rate',
    caption: 'From insight to quoted rate in one flow.',
  },
] as const

const PERSONAS = [
  {
    src: '/work/trochi/persona-tyler.svg',
    alt: 'Tyler — Carrier Sales Rep, Mid-size 3PL',
    caption: 'Tyler · Carrier Sales Rep',
  },
  {
    src: '/work/trochi/persona-sarah.svg',
    alt: 'Sarah — Pricing Analyst, Large 3PL',
    caption: 'Sarah · Pricing Analyst',
  },
  {
    src: '/work/trochi/persona-james.svg',
    alt: 'James — Account Manager, Large 3PL',
    caption: 'James · Account Manager',
  },
] as const

const META = [
  { label: 'Product', lines: ['Trochi'] },
  { label: 'My role', lines: ['Product Designer, 0 to 1'] },
  {
    label: 'Impact',
    lines: [
      '5 signed broker contracts, $100M+ volume',
      '2 high-profile board members joined',
    ],
  },
] as const

const STATS = [
  { value: '5', label: 'signed broker contracts, $100M+ volume' },
  { value: '2', label: 'high-profile board members joined' },
] as const

const MORE = [
  { eyebrow: 'Triumph · End-to-end design & research', title: 'Triumph', href: '/work/triumph' },
  { eyebrow: 'Diezl · Solo design and build', title: 'Diezl', href: '/work/diezl' },
] as const

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.25

type ExpandedImage = { src: string; alt: string }

export default function TrochiCaseStudyPage() {
  const [expandedImage, setExpandedImage] = useState<ExpandedImage | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef({ x: 0, y: 0 })
  const overlayWrapRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (!isPanning) return
    const handlePanMove = (e: MouseEvent) => {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      })
    }
    const handlePanEnd = () => setIsPanning(false)
    window.addEventListener('mousemove', handlePanMove)
    window.addEventListener('mouseup', handlePanEnd)
    return () => {
      window.removeEventListener('mousemove', handlePanMove)
      window.removeEventListener('mouseup', handlePanEnd)
    }
  }, [isPanning])

  return (
    <>
      <CaseStudy theme={THEME} more={MORE}>
        <CaseHero
          logo={
            <Image
              src="/work/Trochi_Full_Logo.png"
              alt="Trochi.ai"
              width={569}
              height={161}
              className={styles.logo}
              priority
            />
          }
          eyebrow="Trochi · Product design, 0 to 1"
          title="A rate market brokers actually own"
          lead={
            <>
              Designed a cooperative freight rate platform from zero to one, with no prior product
              foundation.
            </>
          }
        />

        <CaseFigure>
          <Image
            src="/work/Trochi.png"
            alt="Trochi lane results for Dallas to Chicago with spot rate, confidence score, rate trends, and market conditions"
            width={3808}
            height={2560}
            quality={90}
            sizes="(max-width: 1080px) 100vw, 1016px"
            className={styles.cover}
            priority
          />
        </CaseFigure>

        <CaseIntro
          text={
            <>The prototype is now Trochi&apos;s primary tool for broker&nbsp;recruitment.</>
          }
          meta={META}
        />

        <CaseSection label="Context">
          <p>
            Brokers generate the pricing data that drives the freight market, then pay incumbents
            to buy it back, stripped of quality and timeliness. Trochi&apos;s model flips that: a
            cooperative where contributing data earns brokers equity instead of a
            subscription&nbsp;bill.
          </p>
        </CaseSection>

        <CaseSection label="Problem">
          <p>
            There was no existing product to design from and no internal team to validate against.
            Three different roles, carrier sales reps, pricing analysts, account managers, all
            needed to trust the same rate data for different reasons, and the product had to earn
            that trust before a single broker had signed&nbsp;on.
          </p>
        </CaseSection>

        <CaseFigure>
          <CaseCarousel
            slides={PERSONAS}
            ratio="6280 / 2636"
            label="Personas"
            onExpand={setExpandedImage}
          />
        </CaseFigure>

        <CaseSection label="Approach">
          <p>
            I used competitive analysis and my deep freight domain knowledge to define the full
            experience before any screen existed, then built it out as end-to-end wireframes and a
            working interactive&nbsp;prototype.
          </p>
        </CaseSection>

        <CaseSection label="Solution">
          <p>
            A dashboard opens on a personalized market briefing instead of a data dump. Lane search
            works by leveraging natural language instead of standard filtering, and results surface
            a confidence score alongside the rate, so a broker can tell a solid number from a thin
            one at a glance. A market view rolls the same intelligence up to city level, and
            quoting happens in the same flow as the search, so insight turns into a quote without a
            screen&nbsp;change.
          </p>
        </CaseSection>

        <CaseFigure>
          <CaseCarousel
            slides={PRODUCT_SCREENS}
            ratio="1720 / 1024"
            label="Product screens"
            onExpand={setExpandedImage}
          />
        </CaseFigure>

        <CaseFigure
          caption={
            <span className={styles.reasoning}>
              Rate data needs every pixel, so navigation floats instead of taking a sidebar. Search,
              the most common starting point, sits one tap away with recent lanes ready, and keyboard
              shortcuts let reps jump between views mid-call. Open search to try&nbsp;it.
            </span>
          }
        >
          <div className={styles.navDemo}>
            <TrochiNavBar />
          </div>
        </CaseFigure>

        <CaseSection label="Impact">
          <CaseStats stats={STATS} />
          <p>Used as the primary sales asset for broker recruitment, pre-launch.</p>
        </CaseSection>
      </CaseStudy>

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
                cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in',
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
    </>
  )
}
