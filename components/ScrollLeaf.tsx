'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import GlitchOverlay from '@/components/GlitchOverlay'
import { useNightfall } from '@/contexts/NightfallContext'
import styles from './ScrollLeaf.module.css'

const TAU = Math.PI * 2

/** Vertical path in vh, measured from the top of the viewport. */
const Y_START = 13
const Y_END = 86

/** Where the leaf stops falling and comes to rest on the ground. */
const LANDING = 0.93

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

type Lane = {
  /** Resting centre of the lane, in px from the left edge of the viewport. */
  centre: number
  /** How far the leaf may sway before it would touch the text. */
  sway: number
  /** The leaf may never travel left of this. */
  limit: number
}

/**
 * The leaf rides the gutter to the right of the text column. Measure `.u-shell`
 * rather than the sections themselves — the sections run edge to edge, so only
 * their inner content box says where the words actually stop.
 */
function measureLane(el: HTMLElement): Lane {
  const vw = window.innerWidth
  const half = (el.offsetWidth || 60) / 2

  let contentRight = vw / 2
  for (const shell of document.querySelectorAll<HTMLElement>('main .u-shell')) {
    const rect = shell.getBoundingClientRect()
    if (rect.height < 1) continue
    const padRight = parseFloat(getComputedStyle(shell).paddingRight) || 0
    contentRight = Math.max(contentRight, rect.right - padRight)
  }

  const margin = vw - contentRight

  /* Centre it in the gutter when there is room. Where there isn't — phones,
     mostly — it tucks behind the edge of the viewport rather than ride over
     the text, keeping roughly a third of itself in frame. */
  const inset =
    margin >= half * 2 + 16 ? margin / 2 : Math.max(-half * 0.4, margin - half - 4)

  const centre = vw - inset

  return {
    centre,
    sway: Math.min(Math.max(0, margin - half * 2 - 16) / 2, vw * 0.03),
    limit: Math.min(contentRight + half + 4, centre),
  }
}

export default function ScrollLeaf() {
  const { progressRef } = useNightfall()
  const elRef = useRef<HTMLDivElement>(null)
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let lane = measureLane(el)
    let stale = false
    const invalidate = () => {
      stale = true
    }

    /* Rendered state chases the scroll-derived target, which is what gives the
       leaf weight: it overshoots slightly and keeps settling after you stop. */
    let renderX = 0
    let renderY = 0
    let renderRot = 0
    let seeded = false

    /* Scroll velocity spins the leaf up, then decays — a gust of wind. */
    let lastProgress = progressRef.current
    let gust = 0

    let last = performance.now()
    let rafId = 0

    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      const t = now / 1000

      if (stale) {
        stale = false
        lane = measureLane(el)
      }

      const vh = window.innerHeight
      const p = progressRef.current
      const fall = clamp01(p / LANDING)
      const landed = clamp01((p - LANDING) / (1 - LANDING))
      /* Life fades out as the leaf reaches the ground so it settles, not hovers. */
      const life = 1 - landed

      const dp = p - lastProgress
      lastProgress = p
      gust = gust * Math.pow(0.94, dt / 16.67) + dp * 620

      /* Pendulum sway: two frequencies so the arc never repeats visibly, sized
         to whatever empty gutter the layout actually leaves. */
      const sway =
        lane.sway *
        (0.72 * Math.sin(fall * TAU * 2.4) + 0.28 * Math.sin(fall * TAU * 5.9 + 1.4)) *
        life
      const idleX = reduced ? 0 : Math.sin(t / 2.7) * lane.sway * 0.14 * life

      const targetX = lane.centre + sway + idleX
      const targetY = ((Y_START + (Y_END - Y_START) * fall) / 100) * vh

      /* Bank into the direction of travel, tumble slowly, and let gusts add spin. */
      const bank = 26 * Math.cos(fall * TAU * 2.4) * life
      const tumble = fall * 300
      const idleRot = reduced ? 0 : Math.sin(t / 3.4) * 3.5 * life
      const targetRot = tumble + bank + idleRot + gust

      if (!seeded) {
        renderX = targetX
        renderY = targetY
        renderRot = targetRot
        seeded = true
      }

      /* Frame-rate independent easing. Y tracks scroll tightly so the leaf feels
         attached to the page; X and rotation lag, so it flutters. */
      const ease = (rate: number) => 1 - Math.pow(1 - rate, dt / 16.67)
      renderX += (targetX - renderX) * ease(0.085)
      renderY += (targetY - renderY) * ease(0.18)
      renderRot += (targetRot - renderRot) * ease(0.07)

      /* Belt and braces: the flutter lag can't carry it over the text. */
      renderX = Math.max(renderX, lane.limit)

      el.style.transform = `translate3d(${renderX.toFixed(2)}px, ${renderY.toFixed(
        2
      )}px, 0) translate(-50%, -50%) rotate(${renderRot.toFixed(2)}deg)`

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    window.addEventListener('resize', invalidate)
    /* The document reflows as fonts load and sections reveal; re-measure. */
    const observer = new ResizeObserver(invalidate)
    observer.observe(document.body)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', invalidate)
      observer.disconnect()
    }
  }, [progressRef])

  return (
    <>
      {glitching && <GlitchOverlay />}
      <div ref={elRef} className={styles.leaf}>
        <Link
          href="/art"
          onClick={() => setGlitching(true)}
          aria-label="A leaf. Follow it."
          className={styles.hit}
        >
          <img src="/fall-leaf.svg" alt="" draggable={false} />
        </Link>
      </div>
    </>
  )
}
