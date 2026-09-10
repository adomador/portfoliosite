'use client'

import { useId, useState } from 'react'
import { ENDORSEMENTS } from '@/lib/profile'
import styles from './About.module.css'

export default function Endorsements() {
  const [index, setIndex] = useState(0)
  const labelId = useId()
  const total = ENDORSEMENTS.length
  const current = ENDORSEMENTS[index]

  const go = (delta: number) => {
    if (total < 2) return
    setIndex((i) => (i + delta + total) % total)
  }

  return (
    <figure className={styles.endorsement} aria-labelledby={labelId}>
      <div className={styles.endorsementHead}>
        <p className={`u-label ${styles.dt}`} id={labelId}>
          Endorsements
        </p>
        {total > 1 && (
          <div className={styles.pager} role="group" aria-label="Endorsement navigation">
            <button
              type="button"
              className={styles.pagerBtn}
              onClick={() => go(-1)}
              aria-label="Previous endorsement"
            >
              <Chevron dir="prev" />
            </button>
            <span className={styles.pagerCount} aria-live="polite">
              {index + 1} / {total}
            </span>
            <button
              type="button"
              className={styles.pagerBtn}
              onClick={() => go(1)}
              aria-label="Next endorsement"
            >
              <Chevron dir="next" />
            </button>
          </div>
        )}
      </div>

      <blockquote className={styles.quote} key={index} aria-live="polite">
        <p>{current.quote}</p>
      </blockquote>
      <figcaption className={styles.attribution}>
        <span className={styles.author}>{current.author}</span>
        <span className={styles.role}>{current.role}</span>
      </figcaption>
    </figure>
  )
}

function Chevron({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={dir === 'prev' ? 'M10 3.5 5.5 8 10 12.5' : 'M6 3.5 10.5 8 6 12.5'}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
