'use client'

import { useEffect, useRef, useState } from 'react'
import Reveal from '@/components/Reveal'
import { EMAIL, GITHUB, LINKEDIN, RESUME_URL } from '@/lib/profile'
import styles from './Contact.module.css'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2200)
    } catch {
      /* Clipboard blocked (insecure context, permissions) — fall back to mailto. */
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <section id="contact" className={styles.section} aria-label="Contact">
      <div className={`u-shell ${styles.inner}`}>
        <Reveal>
          <p className="u-label">Get in touch</p>
        </Reveal>
        <Reveal delay={90}>
          <h2 className={`u-display ${styles.title}`}>
            Have something hard to figure out?
          </h2>
        </Reveal>
        <Reveal delay={170}>
          <p className={styles.lead}>
            I like early, messy problems and small teams that move.
            <br />
            If that&apos;s yours, say hello.
          </p>
        </Reveal>

        <Reveal delay={250}>
          <div className={styles.actions}>
            <button
              type="button"
              onClick={copy}
              className={`${styles.primary} ${copied ? styles.copied : ''}`}
            >
              <span className={styles.primaryLabel}>{copied ? 'Copied' : EMAIL}</span>
              <span className={styles.primaryHint} aria-hidden>
                {copied ? '✓' : 'Copy'}
              </span>
            </button>

            <div className={styles.secondary}>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className={styles.link}>
                LinkedIn
              </a>
              <span className={styles.dot} aria-hidden />
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className={styles.link}>
                GitHub
              </a>
              <span className={styles.dot} aria-hidden />
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Résumé
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
