'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import GlitchOverlay from '@/components/GlitchOverlay'
import { useNightfall } from '@/contexts/NightfallContext'
import styles from './ScrollLeaf.module.css'

const TAU = Math.PI * 2

/** Horizontal path in vw: starts off to the right, drifts across, settles left. */
const X_START = 76
const X_END = 13

/** Vertical path in vh, measured from the top of the viewport. */
const Y_START = 13
const Y_END = 86

/** Where the leaf stops falling and comes to rest on the ground. */
const LANDING = 0.93

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/** Slow-in / slow-out so the drift across the page doesn't read as a straight line. */
function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}

export default function ScrollLeaf() {
  const { progressRef } = useNightfall()
  const elRef = useRef<HTMLDivElement>(null)
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

      const vw = window.innerWidth
      const vh = window.innerHeight
      const p = progressRef.current
      const fall = clamp01(p / LANDING)
      const landed = clamp01((p - LANDING) / (1 - LANDING))
      /* Life fades out as the leaf reaches the ground so it settles, not hovers. */
      const life = 1 - landed

      const dp = p - lastProgress
      lastProgress = p
      gust = gust * Math.pow(0.94, dt / 16.67) + dp * 620

      /* Pendulum sway: two frequencies so the arc never repeats visibly. */
      const swayVw =
        8.5 * Math.sin(fall * TAU * 2.4) * life +
        3.2 * Math.sin(fall * TAU * 5.9 + 1.4) * life

      const baseXvw = X_START + (X_END - X_START) * smoothstep(fall)
      const idleX = reduced ? 0 : Math.sin(t / 2.7) * 0.7 * life

      const targetX = ((baseXvw + swayVw + idleX) / 100) * vw
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

      el.style.transform = `translate3d(${renderX.toFixed(2)}px, ${renderY.toFixed(
        2
      )}px, 0) translate(-50%, -50%) rotate(${renderRot.toFixed(2)}deg)`

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
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
