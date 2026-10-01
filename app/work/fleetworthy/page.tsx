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
  alt: 'Fleetworthy Command Center showing fleet health, a ranked list of critical action items with estimated impact, and a map of fleet events',
}

const PROBLEM_IMAGE = {
  src: `${DIR}/v1-vs-v2.png`,
  alt: 'Side by side of the V1 merged-data dashboard and the V2 ranked action list Command Center',
  caption: 'V1 put every product on one screen. V2 leads with what to do next.',
}

const APPROACH_IMAGE = {
  src: `${DIR}/causal-chain-concept.png`,
  alt: 'Concept diagram of a causal chain showing cause, effect, cost and action for a fleet insight',
  caption: 'The causal chain: what happened, what it causes, what it costs, and what to do.',
}

const SOLUTION_SCREENS = [
  {
    src: `${DIR}/severity-tiers.png`,
    alt: 'Severity tiers for fleet insights: Critical, Action Needed and Monitor, based on fleet impact and dollars lost',
    caption: 'Severity escalates from how much of the fleet is affected and dollars lost per vehicle.',
  },
  {
    src: `${DIR}/action-item-reasoning.png`,
    alt: 'An action item that explains itself with what happened, what it causes, what it costs and what to do',
    caption: 'Every item follows the causal chain so managers can judge the reasoning, not just a score.',
  },
  {
    src: `${DIR}/action-state-modals.png`,
    alt: 'Dismiss, ignore and snooze states for action items so the list stays useful',
    caption: 'Dismiss, ignore and snooze keep the action list useful instead of noisy.',
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

      <CaseImage
        src={PROBLEM_IMAGE.src}
        alt={PROBLEM_IMAGE.alt}
        caption={PROBLEM_IMAGE.caption}
      />

      <CaseSection label="Approach">
        <p>
          I started researching before the project formally existed. Interviews with four enterprise
          fleets, internal experts, and 16 survey responses showed the value was not &quot;one place
          to manage vehicles.&quot; It was less work caused by mismatched data. That validated the
          shared vehicle record as the foundation, and it set up the next question: once vehicles
          are connected, what does that&nbsp;unlock?
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
          Two carried the most weight. The first was a causal chain (cause, effect, cost, action),
          which became how every item explains itself. The second was putting the action list first,
          so the dashboard leads with what to do instead of what&nbsp;happened.
        </p>
      </CaseSection>

      <CaseImage
        src={APPROACH_IMAGE.src}
        alt={APPROACH_IMAGE.alt}
        caption={APPROACH_IMAGE.caption}
      />

      <CaseSection label="Solution">
        <p>
          <strong>One vehicle record connecting every service.</strong> Customers map their vehicles
          once, and every product&apos;s data attaches to the same truck. That makes cross-service
          insights possible, and it gives customers a reason to finish mapping: partial mapping
          shows them what they are&nbsp;missing.
        </p>
        <p>
          <strong>A ranked list of actions, not a wall of metrics.</strong> Each insight gets a
          severity based on two inputs: how much of the fleet is affected, and dollars lost per
          vehicle per month. If either crosses its threshold, it escalates into Critical, Action
          Needed or Monitor. Each insight has its own thresholds and time window, plus a freshness
          indicator so customers know how current the data is. A fleet manager opens the dashboard
          and sees what to do&nbsp;first.
        </p>
        <p>
          <strong>Every action explains itself.</strong> Each item follows the causal chain: what
          happened, what it is causing, what it costs, and what to do. A manager does not have to
          trust a score. They can read the reasoning and judge&nbsp;it.
        </p>
        <p>
          <strong>AI starts the work, the user finishes it.</strong> Simple actions happen inline in
          the assistant. Complex ones open a guided flow where AI sets up the task and the user
          completes it. AI does not sit in a separate chat window waiting to be remembered. It is
          how the action list gets built, explained and acted&nbsp;on.
        </p>
        <p>
          <strong>The details that build trust.</strong> Dismiss, ignore and snooze states for every
          insight, so the list stays useful instead of becoming noise. A state model for every
          module and row. A rule that the map only shows alert-triggered events. And I caught a
          summary stat that was mixing tracked data with alert-triggered data before it&nbsp;shipped.
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
          Once data from every service sat on one vehicle record, the dashboard exposed customers on
          one service with clear signals they needed another, like plate-toll vehicles running
          bypass routes without a subscription. Before, those signals lived in portals nobody
          compared. Sales reviewed and qualified every&nbsp;lead.
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
