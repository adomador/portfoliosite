import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import SectionHead from './SectionHead'
import { PROJECTS, type Project } from '@/lib/profile'
import styles from './Work.module.css'

function Arrow() {
  return (
    <svg className={styles.arrow} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RowBody({ project }: { project: Project }) {
  return (
    <>
      <span className={styles.bar} aria-hidden />
      <span className={styles.mark}>
        <Image src={project.logo} alt="" width={44} height={44} />
      </span>
      <div className={styles.body}>
        <h3 className={styles.company}>{project.company}</h3>
        <p className={styles.summary}>{project.summary}</p>
      </div>
      <div className={styles.aside}>
        <span className={`u-meta ${styles.scope}`}>{project.scope}</span>
        {project.href ? (
          <span className={styles.cta}>
            View
            <Arrow />
          </span>
        ) : (
          <span className={styles.status}>{project.status}</span>
        )}
      </div>
    </>
  )
}

export default function Work() {
  return (
    <section id="work" className={styles.section} aria-label="Work">
      <div className="u-shell">
        <SectionHead
          label="Selected Work"
          title="Things I've shipped"
          lead="Mostly freight and logistics — the kind of software people depend on to do their job, not to enjoy their evening."
        />

        <div className={styles.list}>
          {PROJECTS.map((project, i) => {
            const external = project.href?.startsWith('http')
            return (
              <Reveal key={project.id} delay={i * 80}>
                {project.href ? (
                  external ? (
                    <a
                      className={styles.row}
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.company} — ${project.scope} (opens in a new tab)`}
                    >
                      <RowBody project={project} />
                    </a>
                  ) : (
                    <Link
                      className={styles.row}
                      href={project.href}
                      aria-label={`${project.company} — ${project.scope}`}
                    >
                      <RowBody project={project} />
                    </Link>
                  )
                ) : (
                  <div className={`${styles.row} ${styles.rowInert}`}>
                    <RowBody project={project} />
                  </div>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
