import path from 'node:path'
import Image from 'next/image'
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
import { pngSize, toSlides } from '@/lib/caseImages'
import styles from './page.module.css'

const THEME: CaseTheme = {
  bg: '#101114',
  ink: '#f4f1ea',
  ink2: 'rgba(244, 241, 234, 0.72)',
  ink3: 'rgba(244, 241, 234, 0.5)',
  rule: 'rgba(244, 241, 234, 0.1)',
  panel: 'rgba(244, 241, 234, 0.03)',
  accent: '#d4a054',
}

const DIR = '/work/triumph'

const HERO = {
  src: `${DIR}/hero-global-search.png`,
  alt: "TriumphPay Global Search showing a carrier's invoice details, payor and payee relationship, and factoring and wallet status on one screen",
}

const APPROACH_SCREENS = [
  {
    src: `${DIR}/experience-map.png`,
    alt: 'Experience map of a support agent answering a payment status contact, showing each tool and profile switch along the way',
    caption: 'The experience map: every profile switch it took to answer one payment question.',
  },
  {
    src: `${DIR}/persona-monica.png`,
    alt: 'Persona of Monica, a TriumphPay customer service agent, with her goals, daily KPIs and frustrations',
    caption: 'Monica, the agent persona built from six contextual inquiries.',
  },
  {
    src: `${DIR}/research-synthesis.png`,
    alt: 'Thematic analysis of six contextual inquiries, with agent observations grouped into themes',
    caption: 'Thematic analysis pointed to one need: a holistic view of the customer.',
  },
] as const

const SOLUTION_SCREENS = [
  {
    src: `${DIR}/search-entry.png`,
    alt: 'Global Search empty state with Carrier, Invoice or Load, and Broker fields, and a prompt to fill in two fields to search',
    caption: 'Search starts empty. Two fields are enough to look up a record.',
  },
  {
    src: `${DIR}/possible-results.png`,
    alt: 'Invoice results table listing multiple paid invoices for a broker, with carrier, reference, amount and status columns',
    caption: 'When a search matches more than one invoice, agents get a scannable results list.',
  },
  {
    src: `${DIR}/search-results.png`,
    alt: 'Single invoice detail view with Paid status, payor and payee relationship, entity status, and net amount on one screen',
    caption: 'Selecting a row opens the full picture: invoice, relationship and status, no profile hopping.',
  },
] as const

const META = [
  { label: 'Product', lines: ['TriumphPay Global Search (internal support tool)'] },
  { label: 'My role', lines: ['UX designer & researcher'] },
  {
    label: 'Impact',
    lines: [
      'SLA compliance 90% to 97%',
      'Chat handle time 8:52 to 4:32',
      'Phone handle time 4:10 to 2:47',
      '7% operational cost reduction',
    ],
  },
] as const

const STATS = [
  {
    label: 'Tickets resolved within SLA',
    before: { value: '90%', when: "Apr '23" },
    value: '97%',
    when: "Jun '23",
  },
  {
    label: 'Chat handle time',
    before: { value: '8:52', when: "Apr '23" },
    value: '4:32',
    when: "Jun '23",
  },
  {
    label: 'Phone handle time',
    before: { value: '4:10', when: "Apr '23" },
    value: '2:47',
    when: "Jun '23",
  },
  {
    label: 'Operational cost reduction',
    value: '7%',
  },
] as const

const MORE = [
  { eyebrow: 'Trochi · Product design, 0 to 1', title: 'Trochi', href: '/work/trochi' },
  { eyebrow: 'Diezl · Solo design and build', title: 'Diezl', href: '/work/diezl' },
] as const

export default function TriumphCaseStudyPage() {
  const hero = pngSize(HERO.src)
  const approach = toSlides(APPROACH_SCREENS)
  const solution = toSlides(SOLUTION_SCREENS)

  return (
    <CaseStudy theme={THEME} more={MORE}>
      <CaseHero
        eyebrow="Triumph · End-to-end design & research"
        title="A better customer service experience leads to improved business outcomes"
        lead={<>Researched and designed in four weeks for TriumphPay&apos;s support&nbsp;team.</>}
      />

      {hero ? (
        <CaseFigure>
          <Image
            src={HERO.src}
            alt={HERO.alt}
            width={hero.width}
            height={hero.height}
            quality={90}
            sizes="(max-width: 1080px) 100vw, 1016px"
            className={styles.cover}
            priority
          />
        </CaseFigure>
      ) : (
        <CasePlaceholder label={path.basename(HERO.src)} alt={HERO.alt} />
      )}

      <CaseIntro
        text={
          <>
            A Global Search tool that puts a customer&apos;s invoice, payor relationship and
            factoring status on one screen, cutting chat handle time 49% and phone handle
            time&nbsp;33%.
          </>
        }
        meta={META}
      />

      <CaseSection label="Context">
        <p>
          TriumphPay is a payments and audit platform for trucking, used by brokers, factors,
          shippers and carriers. Its customer service agents are the first line of defense when a
          payment goes wrong, and most contacts are about payment status. Agents work one of three
          queues (tickets, phone or chat) with daily KPIs to&nbsp;hit.
        </p>
      </CaseSection>

      <CaseSection label="Problem">
        <p>
          The company was pushing toward profitability, and support efficiency was one lever.
          Agents juggled multiple tools for a single task. To find basic information, they had to
          jump into customer profiles, effectively impersonating the customer, then copy and paste
          details between screens. Every customer held different information, so profile switching
          never stopped, and it ate handle&nbsp;time.
        </p>
      </CaseSection>

      <CaseSection label="Approach">
        <p>
          I had four weeks, a dev team unfamiliar with the codebase, and a problem nobody had
          defined. With our Research Lead, I ran six contextual inquiries of 90 minutes each: 30
          minutes getting to know the agent, the rest shadowing their real work. We turned the notes
          and recordings into a persona, a thematic analysis and an experience map. The pattern was
          consistent: agents needed one holistic view of the customer. Stakeholders&nbsp;agreed.
        </p>
        <p>
          I sketched four approaches in Figma and worked through the tradeoffs with Product and Dev.
          We chose a card layout because it was a familiar pattern, easy to scope, and fit one
          quarter of engineering&nbsp;effort.
        </p>
      </CaseSection>

      <CaseFigure>
        <CaseCarousel
          slides={approach.slides}
          ratio={approach.ratio}
          label="Triumph research artifacts"
          tone="light"
        />
      </CaseFigure>

      <CaseSection label="Solution">
        <p>
          Global Search lets an agent look up a carrier, invoice or load, or broker from one place.
          Two fields are enough to run a search. When more than one record matches, a results table
          lists every invoice with status and amount so the agent can pick the right one. Opening a
          row puts invoice details, the payor and payee relationship, and factoring status on one
          screen, with links out to each related&nbsp;profile.
        </p>
      </CaseSection>

      <CaseFigure>
        <CaseCarousel
          slides={solution.slides}
          ratio={solution.ratio}
          label="Triumph Global Search screens"
          tone="light"
        />
      </CaseFigure>

      <CaseSection label="Impact">
        <CaseStats stats={STATS} stacked />
      </CaseSection>
    </CaseStudy>
  )
}
