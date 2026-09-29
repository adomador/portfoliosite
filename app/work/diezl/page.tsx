'use client'

import Image from 'next/image'
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
  bg: '#101114',
  ink: '#f4f1ea',
  ink2: 'rgba(244, 241, 234, 0.72)',
  ink3: 'rgba(244, 241, 234, 0.5)',
  rule: 'rgba(244, 241, 234, 0.1)',
  panel: 'rgba(244, 241, 234, 0.03)',
  accent: '#f06b06',
}

const SOLUTION_SCREENS = [
  {
    src: '/work/diezl-voice-input.png',
    alt: 'Diezl voice and natural language input; speak or paste load details',
    caption:
      'Paste a load message or speak it. No typing required.',
  },
  {
    src: '/work/diezl-profit-margin.png',
    alt: 'Diezl profit margin result with Destination Outlook for Laredo, TX',
    caption:
      "A clear profit result first, with Destination Outlook so a good rate into a dead market doesn't fool anyone.",
  },
  {
    src: '/work/diezl-cost-breakdown.png',
    alt: 'Diezl cost breakdown showing fuel, weight, weather, and terrain impacts',
    caption:
      'Show Me the Math opens the full cost breakdown from user inputs or research-backed defaults.',
  },
] as const

const META = [
  { label: 'Product', lines: ['Diezl'] },
  { label: 'My role', lines: ['Founder, Designer & Builder'] },
  {
    label: 'Impact',
    lines: ['406 installs', '901 loads evaluated', '61% resolved in under 1 min'],
  },
] as const

const STATS = [
  { value: '406', label: 'installs' },
  { value: '901', label: 'loads evaluated' },
  { value: '61%', label: 'resolved in under 1 minute' },
] as const

const MORE = [
  { eyebrow: 'Triumph · End-to-end design & research', title: 'Triumph', href: '/work/triumph' },
  { eyebrow: 'Trochi · Product design, 0 to 1', title: 'Trochi', href: '/work/trochi' },
] as const

export default function DiezlCaseStudyPage() {
  return (
    <CaseStudy theme={THEME} more={MORE}>
      <CaseHero
        eyebrow="Diezl · Solo design and build"
        title="Take the load or pass"
        lead={<>Designed, built and shipped alone, from the first interview to the App&nbsp;Store.</>}
      />

      <a
        className={styles.cta}
        href="https://www.diezlapp.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more at diezlapp.com
      </a>

      <CaseFigure>
        <Image
          src="/work/diezl-cover.png"
          alt="Diezl load profitability screen"
          width={5712}
          height={3840}
          quality={90}
          sizes="(max-width: 1080px) 100vw, 1016px"
          className={styles.cover}
          priority
        />
      </CaseFigure>

      <CaseIntro
        text={
          <>
            A profitability calculator that gives owner-operators a defensible verdict in under a&nbsp;minute.
          </>
        }
        meta={META}
      />

      <CaseSection label="Context">
        <p>
          Owner-operators pick loads by rate per mile, which ignores deadhead, fuel, terrain and
          where the truck ends up. A load that looks fine on the rate confirmation can quietly
          lose&nbsp;money.
        </p>
      </CaseSection>

      <CaseSection label="Problem">
        <p>
          The decision happens needs to happen very fast, over the phone or email, with a broker waiting at the other end. The existing options were
          spreadsheets or fleet software built for dispatchers, and neither survives
          that&nbsp;moment.
        </p>
      </CaseSection>

      <CaseSection label="Approach">
        <p>
          I scoped this to one user and one decision on purpose. I leveraged real industry data and tested the cost model against
          real lanes with a DAT researcher, then cut anything that didn&apos;t help someone say yes
          or no&nbsp;faster.
        </p>
      </CaseSection>

      <CaseSection label="Solution">
        <p>
          Natural language input turns a load message into a full set of inputs, no typing required.
          The result leads with clear profit result and detailed cost breakdown that leverages user
          inputs or smart defaults based on real trucking research. Destination Outlook rates where
          the truck ends up, so a good rate into a dead market doesn&apos;t fool&nbsp;anyone.
        </p>
      </CaseSection>

      <CaseFigure>
        <CaseCarousel
          slides={SOLUTION_SCREENS}
          ratio="5712 / 3840"
          label="Diezl product screens"
          tone="dark"
        />
      </CaseFigure>

      <CaseSection label="Impact">
        <CaseStats stats={STATS} />
      </CaseSection>
    </CaseStudy>
  )
}
