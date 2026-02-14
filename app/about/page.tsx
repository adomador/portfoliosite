'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'

const TOOLS = [
  { name: 'Figma', icon: '/Figma-logo.svg' },
  { name: 'Cursor', icon: '/cursor-icon.svg' },
  { name: 'Notion', icon: '/notion-logo.svg' },
  { name: 'Miro', icon: '/miro-logo.svg' },
  { name: 'GitHub', icon: '/Octicons-mark-github.svg', darkIcon: true },
  { name: 'Claude', icon: '/anthropic-1.svg' },
] as const

export default function AboutPage() {
  useEffect(() => {
    document.body.classList.add('no-glow')
    return () => document.body.classList.remove('no-glow')
  }, [])

  return (
    <main className={styles.canvas}>
      <div className={styles.inner}>
        <Link href="/" className={styles.back}>
          ← Back
        </Link>
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
    </main>
  )
}
