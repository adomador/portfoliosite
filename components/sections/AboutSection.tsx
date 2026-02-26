'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useCanvasNavigation } from '@/contexts/CanvasNavigationContext'
import styles from './AboutSection.module.css'

const CHESS_LINKS = [
  { label: 'Chess.com', href: 'https://www.chess.com/member/williammontagueiv', icon: '/chesscom.svg' },
  { label: 'Lichess', href: 'https://lichess.org/@/WilliamHarvey', icon: '/lichess.svg' },
]

const TOOLS: Array<{ name: string; icon: string; darkIcon?: boolean }> = [
  { name: 'Figma', icon: '/Figma-logo.svg' },
  { name: 'Cursor', icon: '/cursor-icon.svg' },
  { name: 'Claude', icon: '/anthropic-1.svg' },
  { name: 'GitHub', icon: '/Octicons-mark-github.svg', darkIcon: true },
  { name: 'Notion', icon: '/notion-logo.svg' },
  { name: 'Miro', icon: '/miro-logo.svg' },
]

export default function AboutSection() {
  const { goTo } = useCanvasNavigation()
  const [menuOpen, setMenuOpen] = useState(false)
  const chessBlockRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (chessBlockRef.current && !chessBlockRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    // Use capture phase so we receive the event before any child can stopPropagation
    document.addEventListener('mousedown', handleClickOutside, true)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen])

  return (
    <section className={styles.section} aria-label="About">
      <div className={styles.topLight} aria-hidden />
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.back}
          onClick={() => goTo('home')}
        >
          ← Back
        </button>
        <div className={styles.content}>
          <div className={styles.copy}>
            <h1 className={styles.title}>About me</h1>
            <p className={styles.lead}>
            I am a designer and builder with over 5 years of experience. Drawn to ambiguous problems and the challenge of building something new, 
           I&apos;ve been in freight technology space for the last three years, one of the most complex and under-served industries in the world.
            </p>
            <p className={styles.body}>
             Currently based in Pennsylvania. </p>
          </div>
          <div className={styles.toolsBlock}>
            <h2 className={styles.toolsTitle}>My tools</h2>
            <ul className={styles.toolsRow} role="list">
            {TOOLS.map((tool) => (
              <li key={tool.name} className={styles.toolIconWrap}>
                <span className={`${styles.toolIcon} ${tool.darkIcon ? styles.toolIconDark : ''}`}>
                  <Image src={tool.icon} alt="" width={32} height={32} />
                </span>
              </li>
            ))}
            </ul>
          </div>
          <div
            ref={chessBlockRef}
            className={`${styles.chessBlock} ${menuOpen ? styles.menuOpen : ''}`}
          >
            <button
              type="button"
              className={styles.chessButton}
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label="Let&apos;s play chess – open menu"
            >
              Let&apos;s play
            </button>
            <div className={styles.chessMenu} role="menu">
              {CHESS_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.chessMenuItem}
                  role="menuitem"
                >
                  <span className={styles.chessMenuItemIcon}>
                    <Image src={link.icon} alt="" width={20} height={20} />
                  </span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
