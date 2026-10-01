import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { EMAIL, NAME } from '@/lib/profile'
import styles from './CaseStudy.module.css'

/** Colors a case study. Every value is optional; unset ones fall back to the Diezl palette. */
export type CaseTheme = {
  bg?: string
  ink?: string
  ink2?: string
  ink3?: string
  rule?: string
  panel?: string
  accent?: string
}

function themeVars(theme: CaseTheme = {}): CSSProperties {
  const vars: Record<string, string> = {}
  if (theme.bg) vars['--cs-bg'] = theme.bg
  if (theme.ink) vars['--cs-ink'] = theme.ink
  if (theme.ink2) vars['--cs-ink-2'] = theme.ink2
  if (theme.ink3) vars['--cs-ink-3'] = theme.ink3
  if (theme.rule) vars['--cs-rule'] = theme.rule
  if (theme.panel) vars['--cs-panel'] = theme.panel
  if (theme.accent) vars['--cs-accent'] = theme.accent
  return vars as CSSProperties
}

export type MoreLink = { eyebrow: string; title: string; href: string }

export function CaseStudy({
  theme,
  more,
  children,
}: {
  theme?: CaseTheme
  more: readonly MoreLink[]
  children: ReactNode
}) {
  return (
    <main className={styles.page} style={themeVars(theme)}>
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
        {children}

        <Reveal as="section" className={styles.more}>
          <h2 className={styles.label}>More case studies</h2>
          <div className={styles.moreGrid}>
            {more.map((item) => (
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

export function CaseHero({
  eyebrow,
  title,
  lead,
  logo,
}: {
  eyebrow: string
  title: string
  lead: ReactNode
  logo?: ReactNode
}) {
  return (
    <Reveal className={styles.hero}>
      {logo && <div className={styles.logo}>{logo}</div>}
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.lead}>{lead}</p>
    </Reveal>
  )
}

export type MetaItem = { label: string; lines: readonly string[] }

export function CaseIntro({ text, meta }: { text: ReactNode; meta: readonly MetaItem[] }) {
  return (
    <Reveal className={styles.intro}>
      <p className={styles.introText}>{text}</p>
      <dl className={styles.meta}>
        {meta.map((item) => (
          <div key={item.label} className={styles.metaItem}>
            <dt>{item.label}</dt>
            {item.lines.map((line) => (
              <dd key={line}>{line}</dd>
            ))}
          </div>
        ))}
      </dl>
    </Reveal>
  )
}

export function CaseSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Reveal as="section" className={styles.row}>
      <h2 className={styles.label}>{label}</h2>
      <div className={styles.body}>{children}</div>
    </Reveal>
  )
}

export function CaseFigure({ caption, children }: { caption?: ReactNode; children: ReactNode }) {
  return (
    <Reveal as="figure" className={styles.figure}>
      {children}
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </Reveal>
  )
}

export function CasePlaceholder({
  label,
  caption,
  tall,
  alt,
}: {
  label: string
  caption?: string
  tall?: boolean
  /** Describes the image that will replace this placeholder. */
  alt?: string
}) {
  return (
    <CaseFigure caption={caption}>
      <div
        className={`${styles.placeholder} ${tall ? styles.placeholderTall : ''}`}
        role={alt ? 'img' : undefined}
        aria-label={alt}
      >
        <span>{label}</span>
      </div>
    </CaseFigure>
  )
}

export type Stat = {
  value: string
  label: string
  /** When the value was measured. Shown under the value in before/after stats. */
  when?: string
  before?: { value: string; when: string }
}

export function CaseStats({ stats, stacked }: { stats: readonly Stat[]; stacked?: boolean }) {
  return (
    <div className={stacked ? `${styles.stats} ${styles.statsStacked}` : styles.stats}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          {stat.before ? (
            <div className={styles.statCompare}>
              <div className={styles.statPoint}>
                <span className={`${styles.statValue} ${styles.statBefore}`}>
                  {stat.before.value}
                </span>
                <span className={styles.statWhen}>{stat.before.when}</span>
              </div>
              <span className={styles.statArrow} aria-hidden="true">
                →
              </span>
              <span className={styles.srOnly}>to</span>
              <div className={styles.statPoint}>
                <span className={styles.statValue}>{stat.value}</span>
                {stat.when && <span className={styles.statWhen}>{stat.when}</span>}
              </div>
            </div>
          ) : (
            <div className={styles.statValue}>{stat.value}</div>
          )}
          <div className={styles.statLabel}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
