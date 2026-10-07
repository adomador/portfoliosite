'use client'

import { forwardRef, memo, useEffect, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import type { ProjectNode } from '@/src/data/mosaic'
import styles from './Mosaic.module.css'

const CYCLE_MS = 2800
const CYCLE_REDUCED_MS = 4200

type Props = {
  project: ProjectNode
  /** The node is open (or opening). Drives the image cycle. */
  on: boolean
  /** Mount the images ahead of the first hover so they are already decoded. */
  primed: boolean
  reducedMotion: boolean
}

/**
 * The content of an expanded case-study node. Position and opacity are written
 * directly by the parent each frame; this component only owns the image cycle,
 * so the loop never re-renders the page around it.
 */
const ProjectPanel = memo(
  forwardRef<HTMLDivElement, Props>(function ProjectPanel({ project, on, primed, reducedMotion }, ref) {
    const [index, setIndex] = useState(0)
    const frames = project.frames
    const count = frames.length

    useEffect(() => {
      if (!on) return
      setIndex(0)
      if (count < 2) return
      const id = setInterval(
        () => setIndex((i) => (i + 1) % count),
        reducedMotion ? CYCLE_REDUCED_MS : CYCLE_MS
      )
      return () => clearInterval(id)
    }, [on, count, reducedMotion])

    const style = {
      '--brand': project.color,
      '--cycle': `${reducedMotion ? CYCLE_REDUCED_MS : CYCLE_MS}ms`,
    } as CSSProperties

    return (
      <div
        ref={ref}
        className={`${styles.panel} ${on ? styles.panelOn : ''} ${reducedMotion ? styles.panelStill : ''}`}
        style={style}
        aria-hidden
      >
        <div className={styles.panelHead}>
          <span className={styles.panelTag}>{project.tag}</span>
          <Image className={styles.panelLogo} src={project.logo} alt="" width={22} height={22} />
        </div>

        <div className={styles.panelMedia}>
          {(primed || on) &&
            frames.map((frame, i) => (
              <div key={frame.src} className={`${styles.panelFrame} ${i === index ? styles.panelFrameOn : ''}`}>
                <Image
                  src={frame.src}
                  alt=""
                  fill
                  sizes="340px"
                  className={styles.panelImg}
                />
              </div>
            ))}
          {on && !reducedMotion && <span key={index} className={styles.panelScan} />}
        </div>

        <div className={styles.panelTrack}>
          {frames.map((frame, i) => (
            <span key={frame.src} className={styles.panelSeg}>
              <span
                key={i === index && on ? `run-${index}` : 'idle'}
                className={`${styles.panelSegFill} ${
                  i < index ? styles.panelSegDone : i === index && on ? styles.panelSegRun : ''
                }`}
              />
            </span>
          ))}
        </div>
        <p key={index} className={styles.panelCaption}>
          <span className={styles.panelCount}>
            {String(index + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}
          </span>
          {frames[index]?.caption}
        </p>

        <p className={styles.panelTitle}>{project.label}</p>
        <p className={styles.panelLine}>{project.line}</p>
        <p className={styles.panelCta}>
          Open case study <span aria-hidden>→</span>
        </p>
      </div>
    )
  })
)

export default ProjectPanel
