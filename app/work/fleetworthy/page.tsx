import path from 'node:path'
import Image from 'next/image'
import {
  CaseFigure,
  CaseHero,
  CaseIntro,
  CaseStats,
  CaseStudy,
  type CaseTheme,
} from '@/components/case-study/CaseStudy'
import CaseCarousel from '@/components/case-study/CaseCarousel'
import { pngSize, toSlides } from '@/lib/caseImages'
import HierarchyMap from './HierarchyMap'
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

type Screen = { src: string; alt: string; caption: string; label: string; surface?: string }

const HERO: Screen = {
  src: `${DIR}/hero-command-center.png`,
  alt: 'Fleetworthy Command Center with ranked action items, severity, estimated impact, and fleet-at-a-glance metrics',
  caption:
    'Command Center. The accounts in view, the shape of the fleet, and what needs a person today.',
  label: 'Command Center',
}

const VEHICLE_RECORDS: Screen = {
  src: `${DIR}/vehicle-records.png`,
  alt: 'The same truck stored as three records, one each for tolls, bypass, and compliance',
  caption:
    'One truck, three records. Tolls, bypass, and compliance each kept a copy, and the copies often drifted.',
  label: 'Vehicle records',
  surface: '#ffffff',
}

const HIERARCHY_SCREENS = `${DIR}/account-switchers.png`

const VEHICLES: readonly Screen[] = [
  {
    src: `${DIR}/vehicle-list.png`,
    alt: 'Centralized vehicle list showing enrollment across tolls, bypass, and compliance on one row',
    caption:
      'Account view of the fleet. One row per vehicle, with each product’s enrollment on it.',
    label: 'Vehicle list',
  },
  {
    src: `${DIR}/vehicle-conflicts.png`,
    alt: 'Conflict review grouping mismatched vehicle records into two-field pattern buckets',
    caption:
      'Mismatches grouped by pattern, capped at two-field combinations. Ten review buckets instead of a field-by-field list.',
    label: 'Conflict review',
  },
  {
    src: `${DIR}/vehicle-enroll.png`,
    alt: 'Enroll flow adding one vehicle to several Fleetworthy products at once',
    caption:
      'Enroll one vehicle into several products at once. Disconnect and Bulk Enroll are still in progress.',
    label: 'Enroll',
  },
]

const PEOPLE: readonly Screen[] = [
  {
    src: `${DIR}/permissions-user.png`,
    alt: 'Single screen for adding a user and granting roles across Fleetworthy products',
    caption:
      'Add a user and set their access on one screen. CP Suite’s 300+ permission configs stay behind the role grant.',
    label: 'Add a user',
  },
  {
    src: `${DIR}/permissions-review.png`,
    alt: 'Permissions review screen keeping multi-value fields readable across 50 or more accounts',
    caption:
      'The review prototype, tested at one account and at 50+, so multi-value fields stay readable at scale.',
    label: 'Permissions review',
  },
]

const ATTENTION: readonly Screen[] = [
  {
    src: `${DIR}/v2.png`,
    alt: 'Command Center dashboard with ranked action items, fleet at a glance, and a fleet events map',
    caption:
      'Fleet at a Glance, the action list, and a Fleet Events map limited to alert-triggered events.',
    label: 'Dashboard',
  },
  {
    src: `${DIR}/severity-model.png`,
    alt: 'Insight severity model with percent of fleet affected and dollars per vehicle per month as the two inputs',
    caption:
      'Severity from two inputs. How much of the fleet is affected, and dollars per vehicle per month. Either one can escalate it.',
    label: 'Severity model',
  },
]

const PROBLEMS = [
  {
    title: 'A vehicle wasn’t one thing',
    unify: 'One record',
    body: 'Every product kept its own vehicle record. Putting a truck on tolls, bypass, and compliance meant entering it three times, and over time the copies drifted into near-matches nobody could reconcile.',
  },
  {
    title: 'Access wasn’t one thing',
    unify: 'One answer',
    body: 'Three products, three permission systems. CP Suite layers permission strings on a separate data-access tree. Drivewyze uses roles, further gated by subscription and reseller rules. Bestpass uses a flat 1 to 6 scale. A support rep or customer success manager had to know all three just to answer what a person can do.',
  },
  {
    title: 'Attention wasn’t one thing',
    unify: 'One list',
    body: 'Safety events, toll exceptions, and compliance gaps each lived in their own product. There was no single place to answer what needs me today.',
  },
] as const

const DECISIONS = [
  {
    kept: 'Rows a user can’t fully access stay clickable and show a message',
    rejected: 'Disabling them, which looks cleaner',
    why: 'Disabling would block access they legitimately have in other products. Checking every row up front would also mean a toll API call per row on load.',
  },
  {
    kept: 'Vehicle details and product settings save to separate places',
    rejected: 'One combined edit drawer',
    why: 'Each product owns its own write path, and a combined save could half-fail.',
  },
  {
    kept: 'Mismatched records grouped by pattern, capped at two-field combinations',
    rejected: 'Reviewing field by field',
    why: 'Ten review buckets instead of an endless list.',
  },
  {
    kept: 'Cross-product insights shown as simple tags on the same vehicle',
    rejected: 'Cause-and-effect treatments. I explored five.',
    why: 'We hadn’t confirmed we could join events at the vehicle level.',
  },
  {
    kept: 'Confirmation only on Ignore',
    rejected: 'Confirmation on Dismiss too',
    why: 'Dismiss is fully reversible. The friction belongs on the bigger commitment.',
  },
] as const

const META = [
  { label: 'Product', lines: ['Fleetworthy Command Center'] },
  { label: 'My role', lines: ['Senior Product Designer'] },
  {
    label: 'Scope',
    lines: ['Vehicles, permissions, the insights dashboard, and the account model under them'],
  },
  {
    label: 'Impact',
    lines: [
      'Vehicle connection rate 40%',
      '700+ qualified upsell leads',
    ],
  },
] as const

const MORE = [
  { eyebrow: 'Triumph · End-to-end design & research', title: 'Triumph', href: '/work/triumph' },
  { eyebrow: 'Trochi · Product design, 0 to 1', title: 'Trochi', href: '/work/trochi' },
  { eyebrow: 'Diezl · Solo design and build', title: 'Diezl', href: '/work/diezl' },
] as const

function slidesFor(screens: readonly Screen[]) {
  const built = toSlides(screens)
  return {
    ratio: built.ratio,
    slides: built.slides.map((slide, i) => ({
      ...slide,
      placeholder: screens[i].label,
    })),
  }
}

function Marks() {
  return (
    <>
      <span className={`${styles.mark} ${styles.markTl}`} aria-hidden="true" />
      <span className={`${styles.mark} ${styles.markTr}`} aria-hidden="true" />
      <span className={`${styles.mark} ${styles.markBl}`} aria-hidden="true" />
      <span className={`${styles.mark} ${styles.markBr}`} aria-hidden="true" />
    </>
  )
}

function Shot({
  src,
  alt,
  caption,
  label,
  surface,
  priority,
}: Screen & { priority?: boolean }) {
  const size = pngSize(src)
  return (
    <CaseFigure caption={caption}>
      <div className={styles.reticle} style={surface ? { background: surface } : undefined}>
        {size ? (
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
        ) : (
          <div className={styles.plate} role="img" aria-label={alt}>
            <span className={styles.plateLabel}>{label}</span>
            <span className={styles.plateFile}>{path.basename(src)}</span>
          </div>
        )}
        <Marks />
      </div>
    </CaseFigure>
  )
}

export default function FleetworthyCaseStudyPage() {
  const vehicles = slidesFor(VEHICLES)
  const people = slidesFor(PEOPLE)
  const attention = slidesFor(ATTENTION)
  const hierarchyScreens = pngSize(HIERARCHY_SCREENS)
  const hierarchySlides = [
    {
      alt: 'Account hierarchy from the global switcher down to product sub-filters',
      caption:
        'Three levels, used on every screen. Pick a set of accounts, filter the screen, then filter inside the product.',
      content: <HierarchyMap />,
    },
    {
      src: hierarchyScreens ? HIERARCHY_SCREENS : undefined,
      alt: 'Connected Accounts, the account filter, and sub-filters for cost centers, groups, and entities',
      caption: 'The same three levels, as they appear on the screens.',
      placeholder: 'Level screens',
      surface: '#f2f0e2',
      ratio: hierarchyScreens
        ? `${hierarchyScreens.width} / ${hierarchyScreens.height}`
        : '16 / 10',
    },
  ]

  return (
    <CaseStudy theme={THEME} more={MORE}>
      <CaseHero
        eyebrow="Fleetworthy · Product design"
        title="Making four products behave like one"
        lead={
          <>
            Command Center is one login, one account, and one place to manage a fleet’s vehicles,
            its people, and what needs attention.
          </>
        }
      />

      <Shot {...HERO} priority />

      <CaseIntro
        text={
          <>
            I own the parts of Command Center that cut across every product. The infrastructure stay
            separate. The experience should still read as one.
          </>
        }
        meta={META}
      />

      <section className={styles.chapter}>
        <div className={styles.prose}>
          <h2 className={styles.chapterTitle}>Context</h2>
          <p>
            Fleetworthy is made of products that started as separate businesses. Bestpass covers
            tolls. Drivewyze covers weigh-station bypass and safety. CP Suite covers compliance.
            Sold separately, that is four products, and a customer might pay for any combination.
            They range from an owner-operator with one truck to carriers like JB Hunt and Forward
            Air running thousands.
          </p>
          <p>
            Command Center is the bet that ties them all together. Same login, same account context,
            whether the fleet bought one product or all of them.
          </p>
        </div>
      </section>

      <section className={styles.chapter}>
        <div className={styles.prose}>
          <h2 className={styles.chapterTitle}>Problem</h2>
          <p>
            To a fleet admin, Fleetworthy didn’t feel like one product. The gap wasn’t only visual.
            Each product was built on its own model, and that showed up in three places.
          </p>
        </div>
        <div className={styles.lanes}>
          {PROBLEMS.map((problem) => (
            <article key={problem.title} className={styles.lane} tabIndex={0}>
              <span className={styles.ticks} aria-hidden="true">
                <span className={styles.ticksSolid} />
              </span>
              <div>
                <div className={styles.laneHead}>
                  <p className={styles.unify}>{problem.unify}</p>
                  <h3 className={styles.laneTitle}>{problem.title}</h3>
                </div>
                <p className={styles.laneBody}>{problem.body}</p>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.prose}>
          <p>
            Under all of that was a structural issue. Not only did we have to connect multiple accounts together into singular object,
            we had to also allow for customers to be able to filter through their data on a per-account & product basis.
          </p>
          <p>
            Merging the backends would have been the clean fix. It was never on the table.
            Engineering had ruled it out, and each product team owns how its own data gets written.
            Anything I designed also had to hold up when a product wasn’t there, because plenty of
            customers don’t buy the full set.
          </p>
          <p>
            The problem I worked from: how do we give a fleet admin one coherent picture of their
            vehicles, their people, and what needs attention, while the backends stay separate?
          </p>
        </div>
      </section>

      <Shot {...VEHICLE_RECORDS} />

      <section className={styles.chapter}>
        <div className={styles.prose}>
          <h2 className={styles.chapterTitle}>Approach</h2>
          <h3 className={styles.subhead}>Unify the experience</h3>
          <p>And be plain about where that holds and where it doesn’t.</p>
          <h3 className={styles.subhead}>I started from evidence</h3>
          <p>
            Before designing anything, I interviewed enterprise carriers: JB Hunt, Forward Air,
            Challenger, and White Cap. The same three asks kept coming up. They wanted data sync
            they could control, a way to enroll one vehicle into several products at once, and a
            way to know which product a given piece of data came from. Most of the vehicle work
            traces back to those conversations.
          </p>
          <h3 className={styles.subhead}>I built the structure before the screens</h3>
          <p>
            Every screen in Command Center has to answer the same question first: whose data am I
            looking at? I wrote the account hierarchy so that question would be answered once, for
            everything.
          </p>
          <ol>
            <li>A switcher for picking a set of connected accounts</li>
            <li>An account filter on each screen</li>
            <li>Sub-filters inside each product’s own view</li>
          </ol>
        </div>
        <CaseFigure>
          <CaseCarousel
            slides={hierarchySlides}
            ratio="16 / 10"
            label="Account hierarchy"
            tone="dark"
            brackets
          />
        </CaseFigure>
        <div className={styles.prose}>
          <p>
            It was approved, and it handled both the large-customer and single-account problems before they could show up as bugs.
          </p>
          <h3 className={styles.subhead}>The dashboard is for wayfinding</h3>
          <p>
            With our engineering lead, I also set the framing the dashboard is still built on.
            Customers fall into two tiers: single-product and multi-product. It points you to where
            the work is. It isn’t another place to do the work or consume tons of data.
          </p>
        </div>
      </section>

      <section className={styles.chapter}>
        <div className={styles.prose}>
          <h2 className={styles.chapterTitle}>Managing Tradeoffs</h2>
          <h3 className={styles.subhead}>I shelved the cleaner model when the cost was too high</h3>
          <p>
            User management is where my framework got tested. The ideal experience required one source of truth, so I designed four plain-language
            roles, Read only, Worker, Manager, and Admin, that would live in the UI and translate
            into each product’s native permissions on save.
          </p>
          <p>
            It held up on paper. In practice, the Compliance product would have had to rename and tag every role to
            fit those four buckets, since they had already built their own roles and permissions infrastructure. That’s a real operational lift for a team that hadn’t bought into
            the idea and needed more time to get invested. I made the case to Product that we should park it until those stakeholders
            were invested, instead of forcing it through in order to not block development.
          </p>
          <p>
            What shipped still does most of the job. You can add a user and set all their permissions
            on one screen. 300+ permission configs for Compliance stay out of the flow, so admins grant only
            roles. The complexity remains hidden. The admin never has to see it.
          </p>
          <h3 className={styles.subhead}>I picked correct over tidy</h3>
          <p>
            A lot of calls came down to the version that wouldn’t break, rather than the one that
            looked cleaner.
          </p>
        </div>
        <div className={styles.tableBlock}>
          <p className={styles.tableCaption}>
            Choices where the cleaner option would have failed in use
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.decisions}>
              <thead>
                <tr>
                  <th scope="col">Decision</th>
                  <th scope="col">What I rejected</th>
                  <th scope="col">Why</th>
                </tr>
              </thead>
              <tbody>
                {DECISIONS.map((row) => (
                  <tr key={row.kept} tabIndex={0}>
                    <th scope="row" data-label="Decision">
                      {row.kept}
                    </th>
                    <td className={styles.rejected} data-label="What I rejected">
                      {row.rejected}
                    </td>
                    <td data-label="Why">{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      
      </section>

      <section className={styles.chapter}>
        <div className={styles.prose}>
          <h2 className={styles.chapterTitle}>Solution</h2>
          <p>
            What came out of this is a shared foundation, with three layers on top. One layer for
            each problem.
          </p>
          <h3 className={styles.subhead}>
            <span className={styles.kicker}>Foundation</span>
            Account architecture
          </h3>
          <p>
            The three-level hierarchy gives every screen the same answer to whose data this is,
            whether you’re an owner-operator with one account or an internal admin looking at all of
            them.
          </p>
          <h3 className={styles.subhead}>
            <span className={styles.kicker}>Vehicles</span>
            Centralized vehicle management
          </h3>
          <p>
            The full vehicle lifecycle across three products with three write paths: adding,
            enrolling, connecting, unenrolling, disconnecting, and resolving conflicts. Account
            views, device management, conflict resolution, unenroll, and the filter improvements have
            shipped. Disconnect and Bulk Enroll are in progress.
          </p>
        </div>
        <CaseFigure>
          <CaseCarousel
            slides={vehicles.slides}
            ratio={vehicles.ratio}
            label="Centralized vehicle management screens"
            tone="dark"
            brackets
          />
        </CaseFigure>
        <div className={styles.prose}>
          <h3 className={styles.subhead}>
            <span className={styles.kicker}>People</span>
            User permissions
          </h3>
          <p>
            One screen to add a user and set their access, with CP Suite’s 300+ configs hidden behind
            role grants. I prototyped it in HTML twice: an account picker with a dataset switcher, so
            I could test it at one account and at 50+, and a review screen that keeps multi-value
            fields readable at that scale. The four-role framework is designed and parked until CP
            Suite is ready to map to it.
          </p>
        </div>
        <CaseFigure>
          <CaseCarousel
            slides={people.slides}
            ratio={people.ratio}
            label="User permissions screens"
            tone="dark"
            brackets
          />
        </CaseFigure>
        <div className={styles.prose}>
          <h3 className={styles.subhead}>
            <span className={styles.kicker}>Attention</span>
            Dashboard
          </h3>
          <p>
            I wrote the severity model underneath it. Severity comes from two things, how much of the
            fleet is affected and how many dollars per vehicle per month are at stake, and either one
            can escalate an insight on its own. That gives three tiers, Critical, Action Needed, and
            Monitor, plus time windows and freshness indicators so you know how current a signal is.
            The model is also explicit about what is defensible today and what still needs discovery.
          </p>
          <p>
            On top of that model: Fleet at a Glance, a Fleet Events map scoped to alert-triggered
            events, and Dismiss, Ignore, and Snooze, with clear rules for when an insight comes back.
          </p>
        </div>
        <CaseFigure>
          <CaseCarousel
            slides={attention.slides}
            ratio={attention.ratio}
            label="Command Center dashboard and severity model"
            tone="light"
            brackets
          />
        </CaseFigure>
      </section>

      <section className={styles.chapter}>
        <div className={styles.prose}>
          <h2 className={styles.chapterTitle}>Impact</h2>
          <div className={styles.statBlock}>
            <CaseStats
              stacked
              stats={[
                { value: '40%', label: 'Vehicle connection rate' },
                { value: '700+', label: 'Qualified upsell leads' },
              ]}
            />
          </div>
          <p>
            Vehicle connection is at a flat 40%. We are continuously doing outreach and improving
            onboarding so more people connect their accounts and their vehicles.  Until the rest of
            the products are actually embedded in Command Center, that number will likely not go
            much higher because customers are still accustomed to managing their fleet in each product separately.
          </p>
          <p>
            The 700+ qualified upsell leads come from customers noticing the consolidation. Once the
            products started behaving like one place, they were interested in the ones they didn’t
            already have.
          </p>
        </div>
      </section>


    </CaseStudy>
  )
}
