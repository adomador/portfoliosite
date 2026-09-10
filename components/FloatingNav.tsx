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
            <img src="/linkedin.svg" alt="" className={styles.icon} width={15} height={15} />
          </a>
          <a
            className={`${styles.iconLink} ${styles.invert}`}
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <img
              src="/Octicons-mark-github.svg"
              alt=""
              className={styles.icon}
              width={15}
              height={15}
            />
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
