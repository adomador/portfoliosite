'use client'

import {
  CaseFigure,
  CaseHero,
  CaseIntro,
  CasePlaceholder,
  CaseSection,
  CaseStats,
  CaseStudy,
  type CaseTheme,
} from '@/components/case-study/CaseStudy'
import CaseCarousel from '@/components/case-study/CaseCarousel'

const THEME: CaseTheme = {
  bg: '#101114',
  ink: '#f4f1ea',
  ink2: 'rgba(244, 241, 234, 0.72)',
  ink3: 'rgba(244, 241, 234, 0.5)',
  rule: 'rgba(244, 241, 234, 0.1)',
  panel: 'rgba(244, 241, 234, 0.03)',
  accent: '#c9a227',
}

const SOLUTION_SCREENS = [
  {
    alt: 'Natural language input',
    placeholder: 'Input',
    caption: 'Paste a load message. Inputs fill themselves — no typing required.',
  },
  {
    alt: 'Profit result and cost breakdown',
    placeholder: 'Profit result',
    caption:
      'A clear profit result first, with a detailed cost breakdown from user inputs or research-backed defaults.',
  },
  {
    alt: 'Destination Outlook',
    placeholder: 'Destination Outlook',
    caption:
      "Destination Outlook rates where the truck ends up, so a good rate into a dead market doesn't fool anyone.",
  },
] as const

const META = [
  { label: 'Product', lines: ['Diezl'] },
  { label: 'My role', lines: ['Designer & Builder'] },
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
  { eyebrow: 'Trochi · Product design, 0 to 1', title: 'Trochi', href: '/work/trochi' },
  { eyebrow: 'Triumph · End-to-end design & research', title: 'Triumph', href: '/work/triumph' },
] as const

export default function DiezlCaseStudyPage() {
  return (
    <CaseStudy theme={THEME} more={MORE}>
      <CaseHero
        eyebrow="Diezl · Solo design and build"
        title="Take the load or pass"
        lead={<>Designed, built and shipped alone, from the first interview to the App&nbsp;Store.</>}
      />

      <CasePlaceholder label="Cover" />

      <CaseIntro
        text={
          <>
            A profitability calculator that gives owner-operators a defensible verdict, most of the
            time in under a&nbsp;minute.
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
          The decision happens on a phone call, with a broker waiting. The existing options were
          spreadsheets or fleet software built for dispatchers, and neither survives
          that&nbsp;moment.
        </p>
      </CaseSection>

      <CaseSection label="Approach">
        <p>
          I scoped this to one user and one decision on purpose. I tested the cost model against
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
          ratio="3 / 4"
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
