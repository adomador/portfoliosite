'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { CHESS_LINKS, ENDORSEMENTS, INTRO, TOOLS } from '@/lib/profile'
import styles from './Mosaic.module.css'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Intro, endorsements and toolkit — shared by the slide-over and the list view. */
export function AboutBody({ titleId = 'about-title' }: { titleId?: string }) {
  const [index, setIndex] = useState(0)
  const labelId = useId()
  const total = ENDORSEMENTS.length
  const endorsement = ENDORSEMENTS[index]

  return (
    <>
      <p className="u-label">About me</p>
      <h2 id={titleId} className={styles.aboutTitle}>
        Designer who ships his own code
      </h2>

      <p className={styles.aboutIntro}>{INTRO}</p>
      <p className={styles.aboutAside}>
        Off the clock I&apos;m usually playing chess, writing short stories, or reading fiction — find me on{' '}
        {CHESS_LINKS.map((link, i) => (
          <span key={link.label}>
            <a
              className={styles.inlineLink}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
            {i < CHESS_LINKS.length - 1 ? ' or ' : '.'}
          </span>
        ))}
      </p>

      <figure className={styles.endorsement} aria-labelledby={labelId}>
        <div className={styles.endorsementHead}>
          <p className={`u-label ${styles.blockLabel}`} id={labelId}>
            Endorsements
          </p>
          {total > 1 && (
            <div className={styles.pager} role="group" aria-label="Endorsement navigation">
              <button
                type="button"
                className={styles.pagerBtn}
                onClick={() => setIndex((i) => (i - 1 + total) % total)}
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
                onClick={() => setIndex((i) => (i + 1) % total)}
                aria-label="Next endorsement"
              >
                <Chevron dir="next" />
              </button>
            </div>
          )}
        </div>
        <blockquote key={index} aria-live="polite">
          <p>{endorsement.quote}</p>
        </blockquote>
        <figcaption className={styles.attribution}>
          <span className={styles.author}>{endorsement.author}</span>
          <span className={styles.authorRole}>{endorsement.role}</span>
        </figcaption>
      </figure>

      <div className={styles.toolsBlock}>
        <p className={`u-label ${styles.blockLabel}`}>Toolkit</p>
        <ul className={styles.tools} role="list">
          {TOOLS.map((tool) => (
            <li
              key={tool.name}
              className={`${styles.tool} ${tool.invertOnDark ? styles.invert : ''}`}
            >
              <Image src={tool.icon} alt="" width={18} height={18} />
              {tool.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default function AboutPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      returnTo?.focus?.()
    }
  }, [onClose])

  return (
    <>
      <div className={styles.aboutBackdrop} onClick={onClose} aria-hidden />
      <aside
        ref={panelRef}
        className={styles.about}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
      >
        <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
          <span aria-hidden>×</span>
          <span className={styles.srOnly}>Close about</span>
        </button>
        <AboutBody titleId="about-title" />
      </aside>
    </>
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
