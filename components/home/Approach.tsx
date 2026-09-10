import Reveal from '@/components/Reveal'
import SectionHead from './SectionHead'
import { APPROACH_LEAD, PRINCIPLES } from '@/lib/profile'
import styles from './Approach.module.css'

export default function Approach() {
  return (
    <section id="approach" className={styles.section} aria-label="Approach">
      <div className="u-shell">
        <SectionHead label="Approach" title="How I work" lead={APPROACH_LEAD} />

        <ol className={styles.grid}>
          {PRINCIPLES.map((principle, i) => (
            <Reveal as="li" key={principle.n} delay={i * 110} className={styles.item}>
              <span className={styles.n}>{principle.n}</span>
              <h3 className={styles.title}>{principle.title}</h3>
              <p className={styles.body}>{principle.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
