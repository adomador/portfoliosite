import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { EMAIL, NAME } from '@/lib/profile'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: `Take the load or pass — ${NAME}`,
  description:
    'Diezl: a profitability calculator that gives owner-operators a defensible verdict, most of the time in under a minute.',
}

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
  { eyebrow: 'Trochi · 0 → 1 MVP', title: 'Trochi', href: '/work/trochi' },
  { eyebrow: 'Triumph · End-to-end design & research', title: 'Triumph', href: '/work/triumph' },
] as const

function Placeholder({ label, caption, tall }: { label: string; caption?: string; tall?: boolean }) {
  return (
    <Reveal as="figure" className={styles.figure}>
      <div className={`${styles.placeholder} ${tall ? styles.placeholderTall : ''}`}>
        <span>{label}</span>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </Reveal>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" className={styles.row}>
      <h2 className={styles.label}>{label}</h2>
      <div className={styles.body}>{children}</div>
    </Reveal>
  )
}

export default function DiezlCaseStudyPage() {
  return (
    <main className={styles.page}>
      <header className={styles.bar}>
        <div className={styles.barInner}>
          <Link href="/" className={styles.barName}>
            {NAME}
          </Link>
          <Link href="/?section=work" className={styles.barBack}>
            <span aria-hidden="true">‹</span> All work
          </Link>
        </div>
      </header>

      <div className={styles.inner}>
        <Reveal className={styles.hero}>
          <p className={styles.eyebrow}>Diezl · Solo design and build</p>
          <h1 className={styles.title}>Take the load or pass</h1>
          <p className={styles.lead}>
            Designed, built and shipped alone, from the first interview to the App&nbsp;Store.
          </p>
        </Reveal>

        <Placeholder label="Cover" />

        <Reveal className={styles.intro}>
          <p className={styles.introText}>
            A profitability calculator that gives owner-operators a defensible verdict, most of the
            time in under a&nbsp;minute.
          </p>
          <dl className={styles.meta}>
            {META.map((item) => (
              <div key={item.label} className={styles.metaItem}>
                <dt>{item.label}</dt>
                {item.lines.map((line) => (
                  <dd key={line}>{line}</dd>
                ))}
              </div>
            ))}
          </dl>
        </Reveal>

        <Section label="Context">
          <p>
            Owner-operators pick loads by rate per mile, which ignores deadhead, fuel, terrain and
            where the truck ends up. A load that looks fine on the rate confirmation can quietly
            lose&nbsp;money.
          </p>
        </Section>

        <Section label="Problem">
          <p>
            The decision happens on a phone call, with a broker waiting. The existing options were
            spreadsheets or fleet software built for dispatchers, and neither survives
            that&nbsp;moment.
          </p>
        </Section>

        <Placeholder
          label="Input screen"
          caption="Natural language input turns a load message into a full set of inputs."
          tall
        />

        <Section label="Approach">
          <p>
            I scoped this to one user and one decision on purpose. I tested the cost model against
            real lanes with a DAT researcher, then cut anything that didn&apos;t help someone say yes
            or no&nbsp;faster.
          </p>
        </Section>

        <Section label="Solution">
          <p>
            Natural language input turns a load message into a full set of inputs, no typing
            required. The result leads with a single TAKE or PASS, and Show Me the Math opens the
            full breakdown behind it. Destination Outlook rates where the truck ends up, so a good
            rate into a dead market doesn&apos;t fool&nbsp;anyone.
          </p>
        </Section>

        <Placeholder
          label="TAKE / PASS result"
          caption="A single TAKE or PASS, with Show Me the Math behind it."
          tall
        />

        <Section label="Impact">
          <div className={styles.stats}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </Section>

        <Reveal as="section" className={styles.more}>
          <h2 className={styles.label}>More case studies</h2>
          <div className={styles.moreGrid}>
            {MORE.map((item) => (
              <Link key={item.href} href={item.href} className={styles.moreCard}>
                <span className={styles.moreEyebrow}>{item.eyebrow}</span>
                <span className={styles.moreTitle}>
                  {item.title} <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
          <a href={`mailto:${EMAIL}`} className={styles.email}>
            Email me
          </a>
        </Reveal>
      </div>
    </main>
  )
}
