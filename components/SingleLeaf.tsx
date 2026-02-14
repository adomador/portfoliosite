'use client'

import { useRef, useEffect } from 'react'
import {
  useCanvasNavigation,
  TRANSITION_DURATION_MS,
  type LeafPosition,
} from '@/contexts/CanvasNavigationContext'
import styles from './SingleLeaf.module.css'

/* Rest positions: About = upper-left (above back button), Work = bottom-left */
const ABOUT_REST = { xPercent: 12, yPercent: 12 }
const WORK_REST = { xPercent: 12, yPercent: 88 }
const ARRIVAL_DURATION_MS = 600

function getRestPositionPx(
  section: 'about' | 'work',
  vw: number,
  vh: number
): LeafPosition {
  const rest = section === 'about' ? ABOUT_REST : WORK_REST
  return {
    x: (rest.xPercent / 100) * vw,
    y: (rest.yPercent / 100) * vh,
    rotation: 0,
  }
}

function lerp(a: LeafPosition, b: LeafPosition, t: number): LeafPosition {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    rotation: a.rotation + (b.rotation - a.rotation) * t,
  }
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

/** Slight acceleration (gravity-like) for falling */
function easeInQuad(t: number): number {
  return t * t
}

/** Gentle ease for rising (floaty) */
function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

const TAU = Math.PI * 2
/** When progress is past this, lock to exact target so the transition ends with no snap */
const LAND_THRESHOLD = 0.998

/** Fade out sway/wobble as we approach 1 so we land exactly on target with no snap */
function landEase(t: number): number {
  return t >= 1 ? 0 : (1 - t) * (1 - t)
}

/**
 * Falling physics: tumble down toward Work rest (bottom-left) with rotation and lateral sway.
 * Sway and rotation fade to zero at progress=1 so the leaf eases into the exact rest position.
 */
function applyFallingPhysics(
  progress: number,
  start: LeafPosition,
  vw: number,
  vh: number
): LeafPosition {
  const target = getRestPositionPx('work', vw, vh)
  const swayAmplitude = Math.min(48, vw * 0.07)
  const wobbleCycles = 5
  const tumbleRotations = 2.2
  const wobbleAmplitude = 28
  const fade = landEase(progress)

  const eased = easeInQuad(progress)
  const x =
    start.x + (target.x - start.x) * eased +
    swayAmplitude * Math.sin(progress * TAU * wobbleCycles) * fade
  const y = start.y + (target.y - start.y) * eased
  const tumble =
    tumbleRotations * 360 * progress +
    wobbleAmplitude * Math.sin(progress * TAU * (wobbleCycles + 0.7))
  const rotation = start.rotation * (1 - eased) + tumble * fade

  return { x, y, rotation }
}

/**
 * Rising physics: float up toward About rest (upper-left) with gentle sway and subtle rotation.
 * Sway and rotation fade to zero at progress=1 so the leaf eases into the exact rest position.
 */
function applyRisingPhysics(
  progress: number,
  start: LeafPosition,
  vw: number,
  vh: number
): LeafPosition {
  const target = getRestPositionPx('about', vw, vh)
  const swayAmplitude = Math.min(32, vw * 0.05)
  const wobbleCycles = 3
  const floatRotation = 50
  const fade = landEase(progress)

  const eased = easeOutQuad(progress)
  const x =
    start.x + (target.x - start.x) * eased +
    swayAmplitude * Math.sin(progress * TAU * wobbleCycles) * fade
  const y = start.y + (target.y - start.y) * eased
  const wobble = floatRotation * Math.sin(progress * TAU * 2)
  const rotation = start.rotation * (1 - eased) + wobble * fade

  return { x, y, rotation }
}

/**
 * The only leaf in the app.
 * - Home: labyrinth drives position.
 * - Going to Work: leaf stays frozen during transition, then animates to bottom-left rest.
 * - Going to About: leaf stays frozen during transition, then animates to upper-left rest.
 * - Returning to Home: leaf animates from that rest position back to last home position over the full transition.
 */
export default function SingleLeaf() {
  const {
    activeSection,
    isTransitioning,
    leafPositionRef,
    frozenLeafPositionRef,
    fromSectionRef,
    transitionStartRef,
  } = useCanvasNavigation()
  const elRef = useRef<HTMLDivElement>(null)
  const arrivalRef = useRef<{
    section: 'about' | 'work'
    from: LeafPosition
    startTime: number
  } | null>(null)
  const wasTransitioningRef = useRef(false)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    let rafId: number
    const vw = () => window.innerWidth
    const vh = () => window.innerHeight

    const tick = () => {
      const vwN = vw()
      const vhN = vh()
      let x: number
      let y: number
      let rotation: number
      let useRestClass = false

      if (activeSection === 'home' && !isTransitioning) {
        const p = leafPositionRef.current
        x = p.x
        y = p.y
        rotation = p.rotation
        arrivalRef.current = null
      } else if (activeSection === 'home' && isTransitioning) {
        const fromSection = fromSectionRef.current
        const frozen = frozenLeafPositionRef.current
        if (fromSection === 'about' || fromSection === 'work') {
          const start = getRestPositionPx(fromSection, vwN, vhN)
          const progress = Math.min(
            1,
            (Date.now() - transitionStartRef.current) / TRANSITION_DURATION_MS
          )
          if (progress >= LAND_THRESHOLD) {
            x = frozen.x
            y = frozen.y
            rotation = frozen.rotation
          } else {
            const eased = easeOutCubic(progress)
            const pos = lerp(start, frozen, eased)
            x = pos.x
            y = pos.y
            rotation = pos.rotation
          }
        } else {
          x = frozen.x
          y = frozen.y
          rotation = frozen.rotation
        }
        arrivalRef.current = null
      } else if (activeSection === 'work' && isTransitioning) {
        const start = frozenLeafPositionRef.current
        const progress = Math.min(
          1,
          (Date.now() - transitionStartRef.current) / TRANSITION_DURATION_MS
        )
        const restPx = getRestPositionPx('work', vwN, vhN)
        if (progress >= LAND_THRESHOLD) {
          x = restPx.x
          y = restPx.y
          rotation = restPx.rotation
        } else {
          const pos = applyFallingPhysics(progress, start, vwN, vhN)
          x = pos.x
          y = pos.y
          rotation = pos.rotation
        }
        arrivalRef.current = null
      } else if (activeSection === 'about' && isTransitioning) {
        const start = frozenLeafPositionRef.current
        const progress = Math.min(
          1,
          (Date.now() - transitionStartRef.current) / TRANSITION_DURATION_MS
        )
        const restPx = getRestPositionPx('about', vwN, vhN)
        if (progress >= LAND_THRESHOLD) {
          x = restPx.x
          y = restPx.y
          rotation = restPx.rotation
        } else {
          const pos = applyRisingPhysics(progress, start, vwN, vhN)
          x = pos.x
          y = pos.y
          rotation = pos.rotation
        }
        arrivalRef.current = null
      } else if (activeSection === 'about' && !isTransitioning) {
        const restPx = getRestPositionPx('about', vwN, vhN)
        if (!arrivalRef.current || arrivalRef.current.section !== 'about') {
          const from = wasTransitioningRef.current
            ? restPx
            : { ...frozenLeafPositionRef.current }
          arrivalRef.current = {
            section: 'about',
            from,
            startTime: Date.now(),
          }
        }
        const arr = arrivalRef.current
        const progress = Math.min(1, (Date.now() - arr.startTime) / ARRIVAL_DURATION_MS)
        if (progress >= 1) {
          x = restPx.x
          y = restPx.y
          rotation = restPx.rotation
          useRestClass = true
        } else {
          const pos = lerp(arr.from, restPx, easeOutCubic(progress))
          x = pos.x
          y = pos.y
          rotation = pos.rotation
        }
      } else if (activeSection === 'work' && !isTransitioning) {
        const restPx = getRestPositionPx('work', vwN, vhN)
        if (!arrivalRef.current || arrivalRef.current.section !== 'work') {
          const from = wasTransitioningRef.current
            ? restPx
            : { ...frozenLeafPositionRef.current }
          arrivalRef.current = {
            section: 'work',
            from,
            startTime: Date.now(),
          }
        }
        const arr = arrivalRef.current
        const progress = Math.min(1, (Date.now() - arr.startTime) / ARRIVAL_DURATION_MS)
        if (progress >= 1) {
          x = restPx.x
          y = restPx.y
          rotation = restPx.rotation
          useRestClass = true
        } else {
          const pos = lerp(arr.from, restPx, easeOutCubic(progress))
          x = pos.x
          y = pos.y
          rotation = pos.rotation
        }
      } else {
        x = 0
        y = 0
        rotation = 0
      }

      el.style.left = `${x}px`
      el.style.top = `${y}px`
      el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`
      el.classList.toggle(styles.rest, useRestClass)
      wasTransitioningRef.current = isTransitioning
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [
    activeSection,
    isTransitioning,
    leafPositionRef,
    frozenLeafPositionRef,
    fromSectionRef,
    transitionStartRef,
  ])

  return (
    <div ref={elRef} className={styles.leaf} aria-hidden>
      <img src="/fall-leaf.svg" alt="" draggable={false} />
    </div>
  )
}
