import { HEADLINE, LOCATION, NAME, ROLE } from '@/lib/profile'
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
          Product design and front-end for freight and logistics. Currently in {LOCATION}.
        </p>
      </div>
    </section>
  )
}
