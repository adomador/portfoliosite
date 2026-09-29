'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './CaseCarousel.module.css'

export type CaseSlide = {
  /** Image path. Omit to show a labeled placeholder instead. */
  src?: string
  alt: string
  caption: string
  /** Label shown when `src` is missing. Defaults to `alt`. */
  placeholder?: string
}

export default function CaseCarousel({
  slides,
  ratio,
  label,
  /** Light frame for light product screenshots (Trochi). Dark frame for phone mockups (Diezl). */
  tone = 'light',
  onExpand,
}: {
  slides: readonly CaseSlide[]
  ratio: string
  label: string
  tone?: 'light' | 'dark'
  onExpand?: (image: { src: string; alt: string }) => void
}) {
  const [index, setIndex] = useState(0)
  const slide = slides[index]
  const go = (next: number) => setIndex((next + slides.length) % slides.length)
  const canExpand = Boolean(slide.src && onExpand)

  return (
    <div className={styles.carousel} role="group" aria-roledescription="carousel" aria-label={label}>
      <button
        type="button"
        className={`${styles.frame} ${tone === 'dark' ? styles.frameDark : ''} ${canExpand ? styles.frameExpandable : styles.frameStatic}`}
        style={{ aspectRatio: ratio }}
        onClick={() => {
          if (slide.src && onExpand) onExpand({ src: slide.src, alt: slide.alt })
        }}
        disabled={!canExpand}
        aria-label={canExpand ? `${slide.alt} — click to expand` : slide.alt}
      >
        {slides.map((s, i) =>
          s.src ? (
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
      </button>

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
