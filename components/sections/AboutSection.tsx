'use client'

import Image from 'next/image'
import { useCanvasNavigation } from '@/contexts/CanvasNavigationContext'
import styles from './AboutSection.module.css'

const TOOLS: Array<{ name: string; icon: string; darkIcon?: boolean }> = [
  { name: 'Figma', icon: '/Figma-logo.svg' },
  { name: 'Cursor', icon: '/cursor-icon.svg' },
  { name: 'Notion', icon: '/notion-logo.svg' },
  { name: 'Miro', icon: '/miro-logo.svg' },
  { name: 'GitHub', icon: '/Octicons-mark-github.svg', darkIcon: true },
  { name: 'Claude', icon: '/anthropic-1.svg' },
]

export default function AboutSection() {
  const { goTo } = useCanvasNavigation()

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
            <h1 className={styles.title}>About</h1>
            <p className={styles.lead}>
              Through first principles, strategic systems thinking, and a bias toward
              action, I transform ambiguous problems into elegant experiences humans
              enjoy using.
            </p>
            <p className={styles.body}>
              Currently based in Pennsylvania. Enjoy playing chess, reading fiction,
              and hiking.
            </p>
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
        </div>
      </div>
    </section>
  )
}
