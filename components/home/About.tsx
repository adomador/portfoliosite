import Image from 'next/image'
import Reveal from '@/components/Reveal'
import SectionHead from './SectionHead'
import Endorsements from './Endorsements'
import { CHESS_LINKS, INTRO, TOOLS } from '@/lib/profile'
import styles from './About.module.css'

export default function About() {
  return (
    <section id="about" className={styles.section} aria-label="About">
      <div className="u-shell">
        <SectionHead label="About me" title="Designer who ships his own code" />

        <div className={styles.grid}>
          <Reveal className={styles.copy}>
            <p className={styles.intro}>{INTRO}</p>
            <p className={styles.aside}>
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
          </Reveal>

          <Reveal delay={130} className={styles.facts}>
            <Endorsements />

            <div className={styles.toolsBlock}>
              <p className={`u-label ${styles.dt}`}>Toolkit</p>
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
          </Reveal>
        </div>
      </div>
    </section>
  )
}
