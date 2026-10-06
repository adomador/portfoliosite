'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { CHESS_LINKS, ENDORSEMENTS, INTRO, TOOLS } from '@/lib/profile'
import styles from './Mosaic.module.css'

const ENDORSEMENT = ENDORSEMENTS.find((e) => e.author === 'Rob Daffin') ?? ENDORSEMENTS[0]

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

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

        <p className="u-label">About me</p>
        <h2 id="about-title" className={styles.aboutTitle}>
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

        <figure className={styles.endorsement}>
          <p className={`u-label ${styles.blockLabel}`}>Endorsement</p>
          <blockquote>
            <p>{ENDORSEMENT.quote}</p>
          </blockquote>
          <figcaption className={styles.attribution}>
            <span className={styles.author}>{ENDORSEMENT.author}</span>
            <span className={styles.authorRole}>{ENDORSEMENT.role}</span>
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
      </aside>
    </>
  )
}
