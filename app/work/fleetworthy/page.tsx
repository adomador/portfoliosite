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
  accent: '#ef444a',
}

const DIR = '/work/fleetworthy'

const HERO = {
  src: `${DIR}/hero-command-center.png`,
  alt: 'Fleetworthy Command Center showing a ranked list of action items with severity, estimated impact, and fleet-at-a-glance metrics',
}

const BEFORE_AFTER = [
  {
    src: `${DIR}/v1.png`,
    alt: 'V1 Command Center: a merged dashboard of product metrics and charts with no clear next steps',
    label: 'V1',
  },
  {
    src: `${DIR}/v2.png`,
    alt: 'V2 Command Center: a ranked list of Critical, Action Needed and Monitor items with estimated impact',
    label: 'V2',
  },
] as const

const APPROACH_IMAGE = {
  src: `${DIR}/severity-model.png`,
  alt: 'Insight severity model showing two inputs, percent of fleet affected and financial impact per vehicle per month, with Critical and Action Needed thresholds',
  caption:
    'Severity from two inputs: how much of the fleet is affected, and dollars lost per vehicle per month. Either one crossing its threshold is enough to escalate.',
}

const SOLUTION_SCREENS = [
  {
    src: `${DIR}/v2.png`,
    alt: 'Full V2 Command Center with ranked action items above and a fleet events map with toll spend, bypass visits and safety alerts below',
    caption:
      'The full V2 dashboard: ranked actions up top, fleet events map and spend below so managers see what to do and where it is happening.',
  },
  {
    src: `${DIR}/ai-chat.png`,
    alt: 'Vantage AI chat open on a high plate tolls insight, with key findings, top vehicles and why it matters',
    caption:
      'Vantage opens on an insight: AI pulls the report, shows the reasoning, and leaves the decision with the manager.',
  },
] as const

const META = [
  { label: 'Product', lines: ['Fleetworthy Command Center (V2 dashboard)'] },
  { label: 'My role', lines: ['Senior Product Designer'] },
  {
    label: 'Impact',
    lines: [
      '700+ sales-qualified upsell leads',
      "Severity model adopted as the insight platform's foundation",
      'Design language for how AI works in the product',
    ],
  },
] as const

const MORE = [
  { eyebrow: 'Triumph · End-to-end design & research', title: 'Triumph', href: '/work/triumph' },
  { eyebrow: 'Trochi · Product design, 0 to 1', title: 'Trochi', href: '/work/trochi' },
  { eyebrow: 'Diezl · Solo design and build', title: 'Diezl', href: '/work/diezl' },
] as const

function CaseImage({
  src,
  alt,
  caption,
  priority,
}: {
  src: string
  alt: string
  caption?: string
  priority?: boolean
}) {
  const size = pngSize(src)
  if (!size) {
    return <CasePlaceholder label={path.basename(src)} alt={alt} caption={caption} />
  }
  return (
    <CaseFigure caption={caption}>
      <Image
        src={src}
        alt={alt}
        width={size.width}
        height={size.height}
        quality={90}
        sizes="(max-width: 1080px) 100vw, 1016px"
        className={styles.cover}
        priority={priority}
      />
    </CaseFigure>
  )
}

function BeforeAfter({
  images,
  caption,
}: {
  images: readonly { src: string; alt: string; label: string }[]
  caption: string
}) {
  return (
    <CaseFigure caption={caption}>
      <div className={styles.compare}>
        {images.map((image) => {
          const size = pngSize(image.src)
          return (
            <div key={image.src} className={styles.compareItem}>
              <span className={styles.compareLabel}>{image.label}</span>
              {size ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={size.width}
                  height={size.height}
                  quality={90}
                  sizes="(max-width: 760px) 100vw, 500px"
                  className={styles.cover}
                />
              ) : (
                <div className={styles.comparePlaceholder} role="img" aria-label={image.alt}>
                  {path.basename(image.src)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </CaseFigure>
  )
}

export default function FleetworthyCaseStudyPage() {
  const solution = toSlides(SOLUTION_SCREENS)

  return (
    <CaseStudy theme={THEME} more={MORE}>
      <CaseHero
        eyebrow="Fleetworthy · Research & product design"
        title="Tell fleets what to do next"
        lead={<>Translating siloed data into a dashboard that actually knows what to surface and cuts the noise. </>}
      />

      <CaseImage src={HERO.src} alt={HERO.alt} priority />

      <CaseIntro
        text={
          <>
            One command center connects tolling, bypass, safety and compliance around each vehicle,
            then tells fleet managers what needs attention and what to do about it. Along the way it
            surfaced 700+ sales-qualified upsell&nbsp;leads.
          </>
        }
        meta={META}
      />

      <CaseSection label="Context">
        <p>
          Fleetworthy is built from acquired products that each kept their own portal: Bestpass for
          tolls, Drivewyze for bypass and safety, and CP Suite for compliance. Customers repeated
          the same tasks, like adding vehicles and managing users, in every portal. Large fleets had
          no shared source of truth, and each product team rebuilt the same features. My team was
          formed to fix that with one platform shell, starting with a shared vehicle record
          everything else could depend&nbsp;on.
        </p>
      </CaseSection>

      <CaseSection label="Problem">
        <p>
          There were two problems, and the second one only showed up after we solved the&nbsp;first.
        </p>
        <p>
          <strong>The data was split.</strong> A fleet&apos;s tolls, bypass, safety and compliance
          data lived in separate portals. At most large fleets, the compliance team and the bypass
          team never talk, so nobody could see how one truck&apos;s issues connected across
          services. An expired registration on a truck that keeps getting pulled into weigh
          stations. A truck paying tolls by plate while running bypass routes without a
          subscription. Each product saw half the&nbsp;story.
        </p>
        <p>
          <strong>Even merged, the data did not help.</strong> The first version of the dashboard
          pulled every product&apos;s data onto one screen, and customers still told us the same
          thing: they did not know what they needed to do on the platform. They could see numbers
          but not next steps. Every customer got the same layout regardless of which services they
          used, so a compliance-only fleet saw a tolling-heavy view. Consolidation alone just moved
          the tab-switching onto one&nbsp;page.
        </p>
        <p>
          The bet for V2 was that unified data only matters if it tells you what to do with&nbsp;it.
        </p>
      </CaseSection>

      <BeforeAfter
        images={BEFORE_AFTER}
        caption="V1 put every product on one screen. V2 leads with what to do next."
      />

      <CaseSection label="Approach">
        <p>
          I started researching before the project formally existed. Interviews with four enterprise
          fleets, internal experts, and 16 survey responses showed the value was not in only providing a single source of truth for fleet data, but in reducing the noise and providing a clear next step for fleet managers.
        </p>
        <p>
          Because the answer involved AI, I ran a separate survey of 60 customers on it. Three
          findings shaped everything&nbsp;after:
        </p>
        <ul>
          <li>
            Customers were open to AI, but preferred suggestions they could review over actions
            taken for&nbsp;them.
          </li>
          <li>Data trust was the main&nbsp;concern.</li>
          <li>
            Toll users were the most enthusiastic and compliance users the most cautious, so one
            default behavior would not fit&nbsp;everyone.
          </li>
        </ul>
        <p>From that I wrote three rules for how AI would work in the&nbsp;product:</p>
        <ol>
          <li>
            AI suggests, the user decides. Nothing happens without a person confirming&nbsp;it.
          </li>
          <li>
            Every suggestion shows its reasoning. If a customer cannot see why something was
            flagged, they will not trust&nbsp;it.
          </li>
          <li>
            Match the effort to the task. Small actions happen in place. Larger ones get a guided
            flow.
          </li>
        </ol>
        <p>
          I then explored ten concepts in Figma and converged on the simplest defensible version.
          Two carried the most weight. The first making sure every insight had a clear cause, effect, cost, and recommended action.
          The second was putting the action list first,
          so the dashboard leads with what to do instead of relying on the user to interpret the data. In order to keep the action list focused and useful, we needed to be intentional about the insights that were surfaced. 
          I created a severity model that would help us decide which insights to surface based on the impact they had on the fleet.
        </p>
      </CaseSection>

      <CaseImage
        src={APPROACH_IMAGE.src}
        alt={APPROACH_IMAGE.alt}
        caption={APPROACH_IMAGE.caption}
      />

      <CaseSection label="Solution">
        <p>
          <strong>A ranked list of actions, not a wall of metrics.</strong> Each insight gets a
          severity based on two inputs: how much of the fleet is affected, and dollars lost per
          vehicle per month. If either crosses its threshold, it escalates into Critical, Action
          Needed or Monitor. Each insight has its own thresholds and time window, plus a freshness
          indicator so customers know how current the data is. Below the list, a fleet events map
          and spend summary show where alert-triggered activity is happening. A fleet manager opens
          the dashboard and sees what to do first, and where to look&nbsp;next.
        </p>
        <p>
          <strong>Every action explains itself.</strong> Each item follows the causal chain: what
          happened, what it is causing, what it costs, and what to do. A manager does not have to
          trust a score. They can read the reasoning and judge&nbsp;it.
        </p>
        <p>
          <strong>The details that build trust.</strong> Dismiss, ignore and snooze states for every
          insight, so the list stays useful instead of becoming noise. A state model for every
          module and row. A rule that the map only shows alert-triggered&nbsp;events.
        </p>
      </CaseSection>

      <CaseFigure>
        <CaseCarousel
          slides={solution.slides}
          ratio={solution.ratio}
          label="Fleetworthy Command Center screens"
          tone="light"
        />
      </CaseFigure>

      <CaseSection label="Impact">
        <CaseStats
          stats={[{ value: '700+', label: 'sales-qualified upsell leads to date' }]}
          stacked
        />
        <p>
          Unifying every product into one Command Center let us surface the full suite in context,
          with smartly placed upsells where a fleet was already feeling the gap. That exposure
          turned into 700+ sales-qualified leads. 
        </p>
        <p>
          <strong>A severity model the platform was built on.</strong> Every insight now escalates
          through the same logic. It became the first layer of the insight platform that powers the
          dashboard.
        </p>
        <p>
          <strong>The design language for AI.</strong> The three rules from my research set the
          boundary between inline actions and guided flows, and shaped how the product&apos;s
          architecture treats&nbsp;AI.
        </p>
      </CaseSection>
    </CaseStudy>
  )
}
