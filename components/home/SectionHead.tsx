import Reveal from '@/components/Reveal'
import styles from './SectionHead.module.css'

interface SectionHeadProps {
  label: string
  title: string
  /** Optional standfirst under the title. */
  lead?: string
}

export default function SectionHead({ label, title, lead }: SectionHeadProps) {
  return (
    <header className={styles.head}>
      <Reveal>
        <p className={`u-label ${styles.label}`}>
          <span className={styles.mark} aria-hidden />
          {label}
        </p>
      </Reveal>
      <Reveal delay={90}>
        <h2 className={`u-display ${styles.title}`}>{title}</h2>
      </Reveal>
      {lead && (
        <Reveal delay={170}>
          <p className={styles.lead}>{lead}</p>
        </Reveal>
      )}
    </header>
  )
}
