'use client'

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from 'react'

/* ── Types ── */

export interface LandingSpot {
  /** Percentage of viewport width (0-100) */
  x: number
  /** Percentage of viewport height (0-100) */
  y: number
}

interface FleeingEntity {
  id: string
  el: HTMLElement
  landingSpot: LandingSpot
  x: number
  y: number
  vx: number
  vy: number
  /** Accumulated rotation (degrees) – driven by velocity */
  rotation: number
  landed: boolean
}

interface LabyrinthContextValue {
  /** Register a DOM element as a fleeing entity. Returns unregister fn. */
  register: (
    id: string,
    el: HTMLElement,
    landingSpot: LandingSpot,
    startX: number,
    startY: number,
  ) => () => void
  /** Map of id → landed boolean (triggers React re-renders when buttons land) */
  landedMap: Record<string, boolean>
}

const LabyrinthContext = createContext<LabyrinthContextValue | null>(null)

export function useLabyrinth() {
  const ctx = useContext(LabyrinthContext)
  if (!ctx) throw new Error('useLabyrinth must be used within LabyrinthProvider')
  return ctx
}

/* ── Physics constants ── */

const REPULSION_RADIUS = 220 // px – cursor influence range
const REPULSION_STRENGTH = 18 // force multiplier
const FRICTION = 0.92
const LAND_DIST = 30 // px – snap threshold
const LAND_VEL = 0.4 // px/frame – velocity threshold for landing
const DRIFT_STRENGTH = 0.08 // gentle pull toward landing spot
const BOUNDS_PADDING = 40 // px inset from viewport edge

/* ── Provider ── */

export function LabyrinthProvider({ children }: { children: ReactNode }) {
  const cursorRef = useRef({ x: -9999, y: -9999 })
  const entitiesRef = useRef<Map<string, FleeingEntity>>(new Map())
  const rafRef = useRef<number>(0)
  const [landedMap, setLandedMap] = useState<Record<string, boolean>>({})

  /* ── Cursor tracking (no state, just ref) ── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX
      cursorRef.current.y = e.clientY
    }
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        cursorRef.current.x = e.touches[0].clientX
        cursorRef.current.y = e.touches[0].clientY
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])

  /* ── rAF physics loop ── */
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const tick = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const cursor = cursorRef.current

      entitiesRef.current.forEach((ent) => {
        if (ent.landed) return

        // If user prefers reduced motion, snap to landing immediately
        if (reducedMotion) {
          ent.x = (ent.landingSpot.x / 100) * vw
          ent.y = (ent.landingSpot.y / 100) * vh
          ent.landed = true
          ent.el.style.transform = `translate(${ent.x}px, ${ent.y}px) rotate(0deg)`
          ent.el.style.willChange = 'auto'
          setLandedMap((prev) => ({ ...prev, [ent.id]: true }))
          return
        }

        const landX = (ent.landingSpot.x / 100) * vw
        const landY = (ent.landingSpot.y / 100) * vh

        /* Repulsion from cursor */
        const dx = ent.x - cursor.x
        const dy = ent.y - cursor.y
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1)

        if (dist < REPULSION_RADIUS) {
          const force = REPULSION_STRENGTH / dist
          ent.vx += (dx / dist) * force
          ent.vy += (dy / dist) * force
        }

        /* Gentle drift toward landing spot */
        const toDx = landX - ent.x
        const toDy = landY - ent.y
        ent.vx += toDx * DRIFT_STRENGTH * 0.01
        ent.vy += toDy * DRIFT_STRENGTH * 0.01

        /* Friction */
        ent.vx *= FRICTION
        ent.vy *= FRICTION

        /* Integrate */
        ent.x += ent.vx
        ent.y += ent.vy

        /* Bounds (keep on screen); larger inset on small viewports for touch */
        const boundsPadding = vw < 640 ? 56 : BOUNDS_PADDING
        ent.x = Math.max(boundsPadding, Math.min(vw - boundsPadding, ent.x))
        ent.y = Math.max(boundsPadding, Math.min(vh - boundsPadding, ent.y))

        /* Rotation driven by horizontal velocity (leaf tumbling) */
        ent.rotation += ent.vx * 2.5

        /* Landing check */
        const toDist = Math.sqrt(toDx * toDx + toDy * toDy)
        const speed = Math.sqrt(ent.vx * ent.vx + ent.vy * ent.vy)

        if (toDist < LAND_DIST && speed < LAND_VEL) {
          ent.x = landX
          ent.y = landY
          ent.vx = 0
          ent.vy = 0
          ent.landed = true
          ent.el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          ent.el.style.transform = `translate(${ent.x}px, ${ent.y}px) rotate(0deg)`
          ent.el.style.willChange = 'auto'
          setLandedMap((prev) => ({ ...prev, [ent.id]: true }))
          return
        }

        /* Apply transform (GPU-composited) */
        ent.el.style.transform = `translate(${ent.x}px, ${ent.y}px) rotate(${ent.rotation}deg)`
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* ── Register / unregister ── */
  const register = useCallback(
    (
      id: string,
      el: HTMLElement,
      landingSpot: LandingSpot,
      startX: number,
      startY: number,
    ) => {
      const entity: FleeingEntity = {
        id,
        el,
        landingSpot,
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 4, // small random initial velocity
        vy: (Math.random() - 0.5) * 4,
        rotation: Math.random() * 360,
        landed: false,
      }
      el.style.willChange = 'transform'
      el.style.transform = `translate(${startX}px, ${startY}px) rotate(${entity.rotation}deg)`
      entitiesRef.current.set(id, entity)

      return () => {
        entitiesRef.current.delete(id)
      }
    },
    [],
  )

  return (
    <LabyrinthContext.Provider value={{ register, landedMap }}>
      {children}
    </LabyrinthContext.Provider>
  )
}
