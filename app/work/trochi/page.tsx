'use client'

import { useState, useRef, useEffect } from 'react'
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

const PERSONA_LABELS = [
  'Name',
  'Role',
  'Company size',
  'Quote',
  'Goals',
  'Pain Points',
  'KPIs',
  'Motivations',
  'Jobs to be Done',
] as const

export default function TrochiCaseStudyPage() {
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
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.personaCard}>
                {PERSONA_LABELS.map((label) => (
                  <div key={label} className={styles.personaField}>
                    <span className={styles.personaLabel}>{label}</span>
                    <span className={styles.personaPlaceholder}>
                      [Placeholder]
                    </span>
                  </div>
                ))}
              </div>
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
    </main>
  )
}
