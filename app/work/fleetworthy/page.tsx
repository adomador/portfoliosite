import path from 'node:path'
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

type Screen = { src: string; alt: string; caption: string; label: string }

const HERO: Screen = {
  src: `${DIR}/hero-command-center.png`,
  alt: 'Fleetworthy Command Center with ranked action items, severity, estimated impact, and fleet-at-a-glance metrics',
  caption:
    'Command Center. The accounts in view, the shape of the fleet, and what needs a person today.',
  label: 'Command Center',
}

const VEHICLE_RECORDS: Screen = {
  src: `${DIR}/vehicle-records.png`,
  alt: 'The same truck stored as three drifted records, one each in tolls, bypass, and compliance',
  caption:
    'One truck, three records. Tolls, bypass, and compliance each kept a copy, and the copies drifted.',
  label: 'Vehicle records',
}

const HIERARCHY: Screen = {
  src: `${DIR}/account-hierarchy.png`,
  alt: 'Account hierarchy diagram with a set switcher, a screen-level account filter, and product sub-filters',
  caption:
    'Three levels, used on every screen. Pick a set of accounts, filter the screen, then filter inside the product.',
  label: 'Account hierarchy',
}

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
    lines: ['Vehicle views settled at 80–100%', 'Connect Vehicles conversion 23–40%'],
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
  priority,
}: Screen & { priority?: boolean }) {
  const size = pngSize(src)
  return (
    <CaseFigure caption={caption}>
      <div className={styles.reticle}>
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
            I own the parts of Command Center that cut across every product. The backends stay
            separate. The experience should still read as one.
          </>
        }
        meta={META}
      />

      <CaseSection label="Context">
        <p>
          Fleetworthy is made of products that started as separate businesses. Bestpass covers
          tolls. Drivewyze covers weigh-station bypass and safety. CP Suite covers compliance.
          Sold separately, that is four products, and a customer might pay for any combination.
          They range from an owner-operator with one truck to carriers like JB Hunt and Forward
          Air running thousands.
        </p>
        <p>
          Command Center is the bet that ties that mix together. Same login, same account context,
          whether the fleet bought one product or all of them.
        </p>
      </CaseSection>

      <CaseSection label="Problem">
        <p>
          To a fleet admin, Fleetworthy didn’t feel like one product. The gap wasn’t only visual.
          Each product was built on its own model, and that showed up in three places.
        </p>
        <div className={styles.lanes}>
          {PROBLEMS.map((problem) => (
            <article key={problem.title} className={styles.lane} tabIndex={0}>
              <span className={styles.ticks} aria-hidden="true">
                <span className={styles.ticksSolid} />
              </span>
              <div>
                <div className={styles.laneHead}>
                  <h3 className={styles.laneTitle}>{problem.title}</h3>
                  <p className={styles.unify}>{problem.unify}</p>
                </div>
                <p className={styles.laneBody}>{problem.body}</p>
              </div>
            </article>
          ))}
        </div>
        <p>
          Under all of that was a structural break. The account switcher fell apart for the largest
          customers, and the product screens embedded in Command Center could only handle one
          account at a time.
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
      </CaseSection>

      <Shot {...VEHICLE_RECORDS} />

      <CaseSection label="Approach">
        <p>
          <strong>Unify the experience. Leave the backends alone.</strong> And be plain about where
          that holds and where it doesn’t.
        </p>
        <p>
          <strong>I started from evidence.</strong> Before designing anything, I interviewed
          enterprise carriers: JB Hunt, Forward Air, Challenger, and White Cap. The same three asks
          kept coming up. They wanted data sync they could control, a way to enroll one vehicle
          into several products at once, and a way to know which product a given piece of data came
          from. Most of the vehicle work traces back to those conversations.
        </p>
        <p>
          <strong>I built the structure before the screens.</strong> Every screen in Command Center
          has to answer the same question first: whose data am I looking at? I wrote the account
          hierarchy so that question would be answered once, for everything.
        </p>
        <ol>
          <li>A switcher for picking a set of accounts</li>
          <li>An account filter on each screen</li>
          <li>Sub-filters inside each product’s own view</li>
        </ol>
        <div className={styles.bleed}>
          <Shot {...HIERARCHY} />
        </div>
        <p>
          It was approved, and it handled the large-customer and single-account problems before
          they could show up as bugs when we embedded CP Suite.
        </p>
        <p>
          With our engineering lead, I also set the framing the dashboard is still built on.
          Customers fall into three tiers: single-product, cross-connected, and multi-product. The
          dashboard is for wayfinding. It points you to where the work is. It isn’t another place
          to do the work.
        </p>
        <p>
          <strong>I shelved the cleaner model when the cost was too high.</strong> Permissions is
          where this got tested. Engineering had ruled out a central permissions backend, and
          governance wanted one source of truth. I designed four plain-language roles, Read only,
          Worker, Manager, and Admin, that would live in the UI and translate into each product’s
          native permissions on save.
        </p>
        <p>
          It held up on paper. In practice, CP Suite would have had to rename and tag every role to
          fit those four buckets. That’s a real operational lift for a team that hadn’t bought into
          the idea yet. I made the case to Product that we should park it until those stakeholders
          were invested, instead of forcing it through.
        </p>
        <p>
          What shipped still does most of the job. You can add a user and set all their permissions
          on one screen. CP Suite’s 300+ permission configs stay out of the flow, so admins grant
          roles. The complexity is still underneath. The admin never has to see it.
        </p>
        <p>
          <strong>I didn’t let the richest system win.</strong> CP Suite has the most detailed
          permission model of the three, and the shared design kept getting pulled toward it. I
          took its location-tree navigation out of the general flow. I kept Accounting to payments,
          methods, and statements, instead of folding in disputes just because CP Suite bundles
          them. When creating accounts in our identity provider crept into scope, I flagged it as a
          different problem, who exists versus what they’re allowed to do, and handed it to the
          people who own it.
        </p>
        <p>
          <strong>I picked correct over tidy.</strong> A lot of calls came down to the version that
          wouldn’t break, rather than the one that looked cleaner.
        </p>
        <div className={styles.bleed}>
          <div className={styles.tableWrap}>
            <table className={styles.decisions}>
              <caption className={styles.tableCaption}>
                Choices where the cleaner option would have failed in use
              </caption>
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
        <p>
          <strong>I checked the work against the code.</strong> Before handing off permissions, I
          checked the role mapping against the codebase instead of trusting my earlier analysis.
          Two things came out of that.
        </p>
        <ul>
          <li>
            CP Suite’s “Administrator (Full Access)” role is meant for internal admins only, and it
            requires approval. My first mapping would have shown it to customers.
          </li>
          <li>
            CP Suite roles aren’t shared. Every client has its own hand-built copy. Lookup logic
            that assumed a shared role ID would have worked on our reference client and broken for
            everyone else.
          </li>
        </ul>
      </CaseSection>

      <CaseSection label="Solution">
        <p>
          What came out of this is a shared foundation, with three layers on top. One layer for
          each problem.
        </p>
        <h3 className={styles.layerTitle}>
          <span className={styles.layerIndex}>Foundation</span>
          Account architecture
        </h3>
        <p>
          The three-level hierarchy gives every screen the same answer to whose data this is,
          whether you’re an owner-operator with one account or an internal admin looking at all of
          them.
        </p>
      </CaseSection>

      <CaseSection label="Vehicles">
        <h3 className={styles.layerTitle}>
          <span className={styles.layerIndex}>The record</span>
          Centralized vehicle management
        </h3>
        <p>
          The full vehicle lifecycle across three products with three write paths: adding,
          enrolling, connecting, unenrolling, disconnecting, and resolving conflicts. Account
          views, device management, conflict resolution, unenroll, and the filter improvements have
          shipped. Disconnect and Bulk Enroll are in progress.
        </p>
      </CaseSection>

      <CaseFigure>
        <CaseCarousel
          slides={vehicles.slides}
          ratio={vehicles.ratio}
          label="Centralized vehicle management screens"
          tone="dark"
          brackets
        />
      </CaseFigure>

      <CaseSection label="People">
        <h3 className={styles.layerTitle}>
          <span className={styles.layerIndex}>The answer</span>
          User permissions
        </h3>
        <p>
          One screen to add a user and set their access, with CP Suite’s 300+ configs hidden behind
          role grants. I prototyped it in HTML twice: an account picker with a dataset switcher, so
          I could test it at one account and at 50+, and a review screen that keeps multi-value
          fields readable at that scale. The four-role framework is designed and parked until CP
          Suite is ready to map to it.
        </p>
      </CaseSection>

      <CaseFigure>
        <CaseCarousel
          slides={people.slides}
          ratio={people.ratio}
          label="User permissions screens"
          tone="dark"
          brackets
        />
      </CaseFigure>

      <CaseSection label="Attention">
        <h3 className={styles.layerTitle}>
          <span className={styles.layerIndex}>The list</span>
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
      </CaseSection>

      <CaseFigure>
        <CaseCarousel
          slides={attention.slides}
          ratio={attention.ratio}
          label="Command Center dashboard and severity model"
          tone="light"
          brackets
        />
      </CaseFigure>

      <CaseSection label="Impact">
        <CaseStats
          stacked
          stats={[
            {
              label: 'Vehicle management view rate, once the onboarding bugs were fixed',
              before: { value: '44–80%', when: 'Before' },
              value: '80–100%',
              when: 'After',
            },
            {
              label: 'Connect Vehicles conversion',
              before: { value: '0%', when: 'Before' },
              value: '23–40%',
              when: 'After',
            },
          ]}
        />
        <p>
          After launch I went through six recorded sessions in Pendo and found four places the
          vehicle flow was breaking. The onboarding guide didn’t fire. The banner didn’t show. The
          account switcher didn’t default to the connected account. The mapping guide came back
          after the person had already finished. Once those were fixed, the view rate and the
          Connect Vehicles conversion moved to the ranges above.
        </p>
        <p>
          On the structural side, the account hierarchy became the model for embedding CP Suite in
          Command Center, and the severity model is being reused on other surfaces.
        </p>
        <p>
          Some of the impact is in things that never reached customers. An internal-only admin role
          that would have shown up in their role list. Role lookups that would have broken for
          every client but one. Partial saves from a combined edit drawer. A “Connect vehicles”
          name that collided with an existing Connect feature. “Resolve & Sync” button copy that
          promised more than sync actually does.
        </p>
      </CaseSection>

      <CaseSection label="Next">
        <p>
          The biggest open dependency is data. Once events can be joined at the vehicle level
          across products, the dashboard can go past “these two problems are on the same truck” and
          start showing how they relate. The cause-and-effect work I set aside is waiting on that.
        </p>
        <p>
          Still open on my side: picking the four-role framework back up once CP Suite is on board,
          and figuring out who owns creating users in our identity provider.
        </p>
      </CaseSection>
    </CaseStudy>
  )
}
