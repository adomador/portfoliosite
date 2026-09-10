'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { GITHUB, LINKEDIN, RESUME_URL } from '@/lib/profile'
import styles from './FloatingNav.module.css'

const ITEMS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const

/** Section whose top has most recently crossed this line owns the nav highlight. */
const FOCUS_RATIO = 0.22

/**
 * Both marks are drawn in `currentColor` rather than loaded as images, so they
 * ride the same ink as the rest of the nav and cross-fade at nightfall instead
 * of needing a filter per background.
 */
function LinkedInMark() {
  return (
    <svg className={styles.icon} viewBox="0 0 225 225" fillRule="evenodd" aria-hidden>
      <path
        fill="currentColor"
        d="M21.5831 0H203.45C203.888 0.298176 208.177 1.1522 209.279 1.62099C218.037 5.34434 223.35 12.2911 225 21.5841V204.122C222.921 212.22 219.757 217.294 212.535 221.821C210.263 223.244 205.406 224.574 204.754 225H19.8557C18.5973 224.11 14.0125 222.972 11.3188 221.065C4.83387 216.474 1.62515 211.271 0 203.6V21.5691C2.10516 12.1669 6.6134 5.44863 15.7601 1.59343C17.3837 0.909112 20.3913 0.60975 21.5831 0ZM150.001 82.2572C151.298 82.0827 153.159 82.1548 154.502 82.1291C173.227 81.772 188.537 92.7105 192.321 111.415C194.62 122.781 193.812 134.694 193.81 146.304L193.817 193.818C182.818 193.657 171.421 193.809 160.389 193.807L160.391 154.022C160.393 151.234 160.419 148.436 160.402 145.647C160.343 135.903 161.495 123.504 153.459 116.352C149.889 113.175 144.754 112.323 140.145 112.654C134.276 113.076 130.298 115.058 126.507 119.488C122.656 124.59 121.644 131.001 121.72 137.223C121.779 142.06 121.741 146.928 121.741 151.768L121.747 193.817C111.115 193.704 100.288 193.806 89.6405 193.802L89.6328 85.2551L121.755 85.251C121.756 89.9505 121.856 95.0908 121.644 99.754C122.03 99.2007 122.421 98.6519 122.818 98.1072C129.819 88.5368 138.518 84.0247 150.001 82.2572ZM34.4806 85.2577L68.1416 85.25C67.9854 97.9041 68.1267 110.857 68.1262 123.531L68.1352 193.83C57.6466 193.475 45.1 193.803 34.4795 193.8C34.639 181.681 34.4894 169.199 34.4903 157.056L34.4806 85.2577ZM48.6268 31.4588C59.5909 30.1031 69.5641 37.9293 70.8543 48.9014C72.1444 59.8734 64.2588 69.7995 53.2793 71.0243C42.3921 72.2387 32.5674 64.4336 31.2882 53.5538C30.0087 42.6741 37.7549 32.8031 48.6268 31.4588Z"
      />
    </svg>
  )
}

function GitHubMark() {
  return (
    <svg className={styles.icon} viewBox="0 0 16 16" fillRule="evenodd" aria-hidden>
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
      />
    </svg>
  )
}

export default function FloatingNav() {
  const [active, setActive] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null)
  const raf = useRef(0)

  const syncActive = useCallback(() => {
    const focusY = window.innerHeight * FOCUS_RATIO
    let current: string | null = null

    for (const item of ITEMS) {
      const el = document.getElementById(item.id)
      if (!el) continue
      if (el.getBoundingClientRect().top <= focusY) {
        current = item.id
      }
    }

    setActive((prev) => (prev === current ? prev : current))
  }, [])

  useEffect(() => {
    const onScrollOrResize = () => {
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(syncActive)
    }

    syncActive()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [syncActive])

  const measure = useCallback(() => {
    const list = listRef.current
    const node = active ? itemRefs.current[active] : null
    if (!list || !node) {
      setPill(null)
      return
    }
    const listBox = list.getBoundingClientRect()
    const box = node.getBoundingClientRect()
    setPill({ x: box.left - listBox.left, w: box.width })
  }, [active])

  useLayoutEffect(measure, [measure])

  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  return (
    <nav className={styles.nav} aria-label="Sections">
      <div className={styles.pillbox}>
        <div className={styles.list} ref={listRef}>
          {pill && (
            <span
              className={styles.indicator}
              style={{ transform: `translateX(${pill.x}px)`, width: `${pill.w}px` }}
              aria-hidden
            />
          )}
          {ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              ref={(el) => {
                itemRefs.current[item.id] = el
              }}
              className={`${styles.item} ${active === item.id ? styles.active : ''}`}
              aria-current={active === item.id ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>
        <span className={styles.divider} aria-hidden />
        <div className={styles.socials}>
          <a
            className={styles.iconLink}
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInMark />
          </a>
          <a
            className={styles.iconLink}
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <GitHubMark />
          </a>
          <a
            className={styles.resume}
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Résumé
          </a>
        </div>
      </div>
    </nav>
  )
}
