'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { RESUME_URL } from '@/lib/profile'
import styles from './FloatingNav.module.css'

const ITEMS = [
  { id: 'approach', label: 'Approach' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const

export default function FloatingNav() {
  const [active, setActive] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null)

  useEffect(() => {
    const sections = ITEMS.map((i) => document.getElementById(i.id)).filter(
      (n): n is HTMLElement => Boolean(n)
    )
    if (!sections.length) return

    /* Whichever section owns the upper third of the viewport wins. */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-18% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

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
        <a
          className={styles.resume}
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Résumé
        </a>
      </div>
    </nav>
  )
}
