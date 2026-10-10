'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import styles from './CaseCarousel.module.css'

export type CaseSlide = {
  /** Image path. Omit to show a labeled placeholder instead. */
  src?: string
  alt: string
  caption: string
  /** Label shown when `src` is missing. Defaults to `alt`. */
  placeholder?: string
  /** Per-slide aspect ratio (e.g. "16 / 9"). Falls back to the carousel `ratio`. */
  ratio?: string
  /** Drawn figure in place of an image. The frame sizes to the figure. */
  content?: ReactNode
}

function SelectionMarks() {
  return (
    <>
      <span className={`${styles.bracket} ${styles.bracketTl}`} aria-hidden="true" />
      <span className={`${styles.bracket} ${styles.bracketTr}`} aria-hidden="true" />
      <span className={`${styles.bracket} ${styles.bracketBl}`} aria-hidden="true" />
      <span className={`${styles.bracket} ${styles.bracketBr}`} aria-hidden="true" />
    </>
  )
}

export default function CaseCarousel({
  slides,
  ratio,
  label,
  /** Light frame for light product screenshots (Trochi). Dark frame for phone mockups (Diezl). */
  tone = 'light',
  onExpand,
  /** Fleetworthy-style selection corners. They draw in on hover. */
  brackets = false,
}: {
  slides: readonly CaseSlide[]
  ratio: string
  label: string
  tone?: 'light' | 'dark'
  onExpand?: (image: { src: string; alt: string }) => void
  brackets?: boolean
}) {
  const [index, setIndex] = useState(0)
  const slide = slides[index]
  const go = (next: number) => setIndex((next + slides.length) % slides.length)
  const canExpand = Boolean(slide.src && onExpand)
  const frameRatio = slide.ratio ?? ratio
  const fit = Boolean(slide.content)
  const frameClass = `${styles.frame} ${tone === 'dark' ? styles.frameDark : ''} ${fit ? styles.frameFit : ''} ${canExpand ? styles.frameExpandable : styles.frameStatic}`

  const frameBody = (
    <>
      {slides.map((s, i) =>
        s.content ? (
          <div
            key={s.alt}
            className={`${styles.custom} ${i === index ? styles.customActive : ''}`}
            aria-hidden={i !== index}
          >
            {s.content}
          </div>
        ) : s.src ? (
          <Image
            key={s.src}
            src={s.src}
            alt={i === index ? s.alt : ''}
            fill
            sizes="(max-width: 1080px) 100vw, 1016px"
            className={`${styles.frameImg} ${i === index ? styles.frameImgActive : ''}`}
            priority={i === 0}
          />
        ) : (
          <span
            key={s.alt}
            className={`${styles.placeholder} ${i === index ? styles.placeholderActive : ''}`}
            aria-hidden={i !== index}
          >
            {s.placeholder ?? s.alt}
          </span>
        )
      )}
      {brackets && <SelectionMarks />}
    </>
  )

  return (
    <div className={styles.carousel} role="group" aria-roledescription="carousel" aria-label={label}>
      {canExpand ? (
        <button
          type="button"
          className={frameClass}
          style={fit ? undefined : { aspectRatio: frameRatio }}
          onClick={() => {
            if (slide.src && onExpand) onExpand({ src: slide.src, alt: slide.alt })
          }}
          aria-label={`${slide.alt}. Click to expand`}
        >
          {frameBody}
        </button>
      ) : (
        <div className={frameClass} style={fit ? undefined : { aspectRatio: frameRatio }}>
          {frameBody}
        </div>
      )}

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => go(index - 1)}
          aria-label="Previous image"
        >
          ←
        </button>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => go(index + 1)}
          aria-label="Next image"
        >
          →
        </button>
        <p className={styles.controlsCaption} aria-live="polite">
          {slide.caption}
        </p>
        <div className={styles.dots}>
          {slides.map((s, i) => (
            <button
              key={s.src ?? s.alt}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
            />
          ))}
        </div>
        <span className={styles.count}>
          {index + 1} / {slides.length}
        </span>
      </div>
    </div>
  )
}
