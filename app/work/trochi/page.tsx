'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import TrochiNavBar from '@/components/trochi/TrochiNavBar'
import styles from './page.module.css'

const PRODUCT_SUBTITLES = [
  'A personalized market briefing to start the day.',
  'Search as the filter. Find lanes by intent.',
  'Spot market intelligence for a single lane.',
  'City-level capacity and volatility at a glance.',
  'From market insight to quoted rate in one flow.',
] as const

const PERSONAS = [
  {
    id: 'james',
    name: 'James',
    role: 'Account Manager',
    src: '/work/trochi/persona-james.png',
    alt: 'James — Account Manager, Large 3PL',
  },
  {
    id: 'tyler',
    name: 'Tyler',
    role: 'Carrier Sales Rep',
    src: '/work/trochi/persona-tyler.png',
    alt: 'Tyler — Carrier Sales Rep, Mid-size 3PL',
  },
  {
    id: 'sarah',
    name: 'Sarah',
    role: 'Pricing Analyst',
    src: '/work/trochi/persona-sarah.png',
    alt: 'Sarah — Pricing Analyst, Large 3PL',
  },
] as const

export default function TrochiCaseStudyPage() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const [expandedPersona, setExpandedPersona] = useState<(typeof PERSONAS)[number] | null>(null)
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
      if (e.key === 'Escape') setExpandedPersona(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (expandedPersona) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [expandedPersona])

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
                onClick={() => setExpandedPersona(persona)}
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

        {/* Section 4: Key Decisions — Full width */}
        <section className={styles.section} data-layout="full">
          <h2 className={styles.sectionHeader}>How the design evolved</h2>
          <div className={styles.decisionsList}>
            <div className={styles.decisionRow}>
              <div className={styles.decisionPair}>
                <div className={styles.designPlaceholder}>[Old Design]</div>
                <div className={styles.designPlaceholder}>[New Design]</div>
              </div>
              <p className={styles.rationale}>
                Removed structural chrome to keep focus on the data.
              </p>
            </div>
            <div className={styles.decisionRow}>
              <div className={styles.decisionPair}>
                <div className={styles.designPlaceholder}>[Old Design]</div>
                <div className={styles.designPlaceholder}>[New Design]</div>
              </div>
              <p className={styles.rationale}>
                Brokers think in intent, not parameters.
              </p>
            </div>
            <div className={styles.decisionRow}>
              <div className={styles.decisionPair}>
                <div className={styles.designPlaceholder}>[Old Design]</div>
                <div className={styles.designPlaceholder}>[New Design]</div>
              </div>
              <p className={styles.rationale}>
                Shifted from showing everything to surfacing what matters now.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: The Product — Five two-column snap sections */}
        {PRODUCT_SUBTITLES.map((subtitle, i) => (
          <section
            key={i}
            className={styles.section}
            data-layout="two-col"
          >
            <div className={styles.productGrid}>
              <div className={styles.screenPlaceholder}>
                Screen {i + 1} Placeholder
              </div>
              <p className={styles.productSubtitle}>{subtitle}</p>
            </div>
          </section>
        ))}

        {/* Section 6: Outcome — Full width */}
        <section className={styles.section} data-layout="full">
          <p className={styles.outcomeStatement}>
            The prototype was presented at [conference] and used as a reference
            tool in early broker recruitment conversations. It became the visual
            foundation for Trochi&apos;s pitch to prospective cooperative members.
          </p>
        </section>
      </div>

      {expandedPersona &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className={styles.overlay}
            onClick={() => setExpandedPersona(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${expandedPersona.alt} — full persona view`}
          >
            <button
              type="button"
              className={styles.overlayClose}
              onClick={(e) => {
                e.stopPropagation()
                setExpandedPersona(null)
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
                src={expandedPersona.src}
                alt={expandedPersona.alt}
                fill
                sizes="95vw"
                className={styles.overlayImage}
              />
            </div>
          </div>,
          document.body
        )}
    </main>
  )
}
