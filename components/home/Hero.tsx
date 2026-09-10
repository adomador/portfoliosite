import { HEADLINE, METRICS, NAME, ROLE } from '@/lib/profile'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={`u-shell ${styles.inner}`}>
        <p className={styles.eyebrow}>
          <span className="u-label">{NAME}</span>
          <span className={styles.tick} aria-hidden />
          <span className={styles.role}>{ROLE}</span>
        </p>

        <h1 className={`u-display ${styles.headline}`}>{HEADLINE}</h1>

        <p className={styles.support}>
          5+ years of experience in supply chain, logistics, and fintech.
          <br />
          Currently solving problems at{' '}
          <a
            className={styles.supportLink}
            href="https://fleetworthy.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fleetworthy
          </a>
          .
        </p>

        <ul className={styles.metrics} aria-label="Selected outcomes">
          {METRICS.map((metric) => (
            <li key={metric.label} className={styles.metric}>
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={styles.metricLabel}>{metric.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
