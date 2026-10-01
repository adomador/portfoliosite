import { closeSync, openSync, readSync } from 'node:fs'
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
import CaseCarousel, { type CaseSlide } from '@/components/case-study/CaseCarousel'
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
    src: `${DIR}/global-search-hifi.png`,
    alt: 'High fidelity Global Search results with invoice, payor and payee, and factoring and wallet cards in a 50/50 layout',
    caption: 'High fidelity cards split 50/50 to match the existing grid.',
  },
  {
    src: `${DIR}/tooltip-iteration.png`,
    alt: 'Before and after of the invoice copy icon, with a tooltip added so one-click copy is discoverable',
    caption: 'Tooltips made one-click copy discoverable.',
  },
  {
    src: `${DIR}/link-weight-iteration.png`,
    alt: 'Before and after of the jump links to related profiles, with heavier link text',
    caption: 'Heavier link text made the jump links easier to find.',
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
] as const

const MORE = [
  { eyebrow: 'Trochi · Product design, 0 to 1', title: 'Trochi', href: '/work/trochi' },
  { eyebrow: 'Diezl · Solo design and build', title: 'Diezl', href: '/work/diezl' },
] as const

/** Reads a PNG's size from its header at build time. Null means the file isn't in /public yet. */
function pngSize(src: string): { width: number; height: number } | null {
  let fd: number | undefined
  try {
    fd = openSync(path.join(process.cwd(), 'public', src), 'r')
    const header = Buffer.alloc(24)
    readSync(fd, header, 0, 24, 0)
    if (header.toString('ascii', 1, 4) !== 'PNG') return null
    return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) }
  } catch {
    return null
  } finally {
    if (fd !== undefined) closeSync(fd)
  }
}

function toSlides(screens: readonly { src: string; alt: string; caption: string }[]) {
  const sizes = screens.map((s) => pngSize(s.src))
  const first = sizes.find(Boolean)
  const slides: CaseSlide[] = screens.map((s, i) => ({
    src: sizes[i] ? s.src : undefined,
    alt: s.alt,
    caption: s.caption,
    placeholder: path.basename(s.src),
  }))
  return { slides, ratio: first ? `${first.width} / ${first.height}` : '16 / 10' }
}

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
          tone="dark"
        />
      </CaseFigure>

      <CaseSection label="Solution">
        <p>
          Global Search lets an agent look up a carrier, invoice or load, or broker from one place.
          Results show invoice details, the payor and payee relationship, and factoring and wallet
          status, with links to jump to each related profile and one-click copy for invoice
          details. In high fidelity, I split the cards 50/50 to match the existing grid and give the
          content room to&nbsp;breathe.
        </p>
        <p>
          I tested a prototype in Maze with four agents, two senior and two newer, so tribal
          knowledge would not skew the results. Two problems surfaced: the copy icon was not
          discoverable, and two of four testers took a longer path to the jump links. I added
          tooltips and increased link text&nbsp;weight.
        </p>
      </CaseSection>

      <CaseFigure>
        <CaseCarousel
          slides={solution.slides}
          ratio={solution.ratio}
          label="Triumph Global Search screens"
          tone="dark"
        />
      </CaseFigure>

      <CaseSection label="Impact">
        <CaseStats stats={STATS} stacked />
      </CaseSection>
    </CaseStudy>
  )
}
