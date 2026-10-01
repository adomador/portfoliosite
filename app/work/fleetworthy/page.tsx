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
import { toSlides } from '@/lib/caseImages'
import styles from './page.module.css'

const THEME: CaseTheme = {
  bg: '#101114',
  ink: '#f4f1ea',
  ink2: 'rgba(244, 241, 234, 0.72)',
  ink3: 'rgba(244, 241, 234, 0.5)',
  rule: 'rgba(244, 241, 234, 0.1)',
  panel: 'rgba(244, 241, 234, 0.03)',
  accent: '#ef444a',
}

const DIR = '/work/fleetworthy'

const HERO = {
  src: '/work/Fleetworthy.png',
  alt: 'Fleetworthy command center showing fleet health, critical action items with estimated impact, and a map of fleet events',
  width: 3808,
  height: 2560,
}

const APPROACH_SCREENS = [
  {
    src: `${DIR}/approach-1.png`,
    alt: 'Placeholder for the first research or discovery artifact',
    caption: 'Placeholder caption for the first approach image.',
  },
  {
    src: `${DIR}/approach-2.png`,
    alt: 'Placeholder for the second research or discovery artifact',
    caption: 'Placeholder caption for the second approach image.',
  },
  {
    src: `${DIR}/approach-3.png`,
    alt: 'Placeholder for the third research or discovery artifact',
    caption: 'Placeholder caption for the third approach image.',
  },
] as const

const SOLUTION_SCREENS = [
  {
    src: `${DIR}/solution-1.png`,
    alt: 'Placeholder for the first product screen',
    caption: 'Placeholder caption for the first solution image.',
  },
  {
    src: `${DIR}/solution-2.png`,
    alt: 'Placeholder for the second product screen',
    caption: 'Placeholder caption for the second solution image.',
  },
  {
    src: `${DIR}/solution-3.png`,
    alt: 'Placeholder for the third product screen',
    caption: 'Placeholder caption for the third solution image.',
  },
] as const

const META = [
  { label: 'Product', lines: ['Fleetworthy (placeholder)'] },
  { label: 'My role', lines: ['Product designer (placeholder)'] },
  { label: 'Impact', lines: ['Impact metric one', 'Impact metric two', 'Impact metric three'] },
] as const

const STATS = [
  { value: '00%', label: 'Placeholder metric one' },
  { value: '00%', label: 'Placeholder metric two' },
  { value: '00', label: 'Placeholder metric three' },
] as const

const MORE = [
  { eyebrow: 'Triumph · End-to-end design & research', title: 'Triumph', href: '/work/triumph' },
  { eyebrow: 'Diezl · Solo design and build', title: 'Diezl', href: '/work/diezl' },
] as const

export default function FleetworthyCaseStudyPage() {
  const approach = toSlides(APPROACH_SCREENS)
  const solution = toSlides(SOLUTION_SCREENS)

  return (
    <CaseStudy theme={THEME} more={MORE}>
      <CaseHero
        eyebrow="Fleetworthy · Product design"
        title="Placeholder case study title"
        lead={<>Placeholder subtitle: one line on scope, timeline and who it was&nbsp;for.</>}
      />

      <CaseFigure>
        <Image
          src={HERO.src}
          alt={HERO.alt}
          width={HERO.width}
          height={HERO.height}
          quality={90}
          sizes="(max-width: 1080px) 100vw, 1016px"
          className={styles.cover}
          priority
        />
      </CaseFigure>

      <CaseIntro
        text={
          <>
            Placeholder summary: what was built, who it helped, and the headline result in one
            sentence.
          </>
        }
        meta={META}
      />

      <CaseSection label="Context">
        <p>
          Placeholder context. Describe Fleetworthy, the fleets it serves, and the suite of products
          involved. Two or three sentences is&nbsp;enough.
        </p>
      </CaseSection>

      <CaseSection label="Problem">
        <p>
          Placeholder problem. Describe how the siloed products made it hard for fleets to get a
          complete picture, and why that mattered to the&nbsp;business.
        </p>
      </CaseSection>

      <CaseSection label="Approach">
        <p>
          Placeholder approach. Describe the research, constraints, and the key decisions that
          shaped the&nbsp;direction.
        </p>
      </CaseSection>

      <CaseFigure>
        <CaseCarousel
          slides={approach.slides}
          ratio={approach.ratio}
          label="Fleetworthy approach artifacts"
          tone="dark"
        />
      </CaseFigure>

      <CaseSection label="Solution">
        <p>
          Placeholder solution. Walk through the main screens and how they unify the product suite
          into one&nbsp;experience.
        </p>
      </CaseSection>

      <CaseFigure>
        <CaseCarousel
          slides={solution.slides}
          ratio={solution.ratio}
          label="Fleetworthy product screens"
          tone="dark"
        />
      </CaseFigure>

      <CaseSection label="Impact">
        <CaseStats stats={STATS} />
      </CaseSection>
    </CaseStudy>
  )
}
