'use client'

import styles from './ResumeBook.module.css'

const PAGE_COUNT = 24
const FLY_DURATION = 1.4
const DELAY_STEP = 0.06

export default function ResumeBook({
  bookClassName,
}: {
  bookClassName: string
}) {
  return (
    <div className={styles.wrapper}>
      <img
        src="/resume-book.svg"
        alt=""
        className={`${styles.book} ${bookClassName}`}
        draggable={false}
      />
      <div className={styles.pagesLayer} aria-hidden>
        {Array.from({ length: PAGE_COUNT }, (_, i) => (
          <div
            key={i}
            className={styles.page}
            style={{
              animationDelay: `${i * DELAY_STEP}s`,
              animationDuration: `${FLY_DURATION}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
