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
  /** When set, we're in soft-landing phase; lerp to target over this duration */
  landingStart: number | null
  /** Snapshot of position when landing started (for lerp) */
  landingFromX: number
  landingFromY: number
  landingFromRotation: number
}

/** Valid landing spots for the leaf only (avoid center + nav buttons) */
const LEAF_SPOTS: LandingSpot[] = [
  { x: 22, y: 55 },
  { x: 28, y: 60 },
  { x: 25, y: 68 },
  { x: 20, y: 62 },
  { x: 30, y: 52 },
  { x: 26, y: 58 },
]

const KICK_IMPULSE = 28

interface LabyrinthContextValue {
  /** Register a DOM element as a fleeing entity. Returns unregister fn. */
  register: (
    id: string,
    el: HTMLElement,
    landingSpot: LandingSpot,
    startX: number,
    startY: number,
    settleTimeoutMs?: number,
  ) => () => void
  /** Kick entity out of its spot (leaf only); it will billow and reland elsewhere. */
  kickEntity: (id: string) => void
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
const CENTER_REPEL_RADIUS = 140 // px – leaf pushed away from center (identity)
const CENTER_REPEL_STRENGTH = 0.4
const BUTTON_REPEL_RADIUS = 88 // px – leaf kept away from nav row
const BUTTON_REPEL_STRENGTH = 0.35
const DEFAULT_SETTLE_TIMEOUT_MS = 2000
const LEAF_SETTLE_TIMEOUT_MS = 7000
const LANDING_DURATION_MS = 500

type LeafPositionCallback = (x: number, y: number, rotation: number) => void

/** SingleLeaf uses center positioning; labyrinth stores top-left. Convert for leaf only. */
function leafCenter(ent: FleeingEntity): { x: number; y: number } {
  const w = ent.el.offsetWidth || 80
  const h = ent.el.offsetHeight || 80
  return { x: ent.x + w / 2, y: ent.y + h / 2 }
}

/* ── Provider ── */

export function LabyrinthProvider({
  children,
  onLeafPositionChange,
}: {
  children: ReactNode
  onLeafPositionChange?: LeafPositionCallback
}) {
  const cursorRef = useRef({ x: -9999, y: -9999 })
  const entitiesRef = useRef<Map<string, FleeingEntity>>(new Map())
  const rafRef = useRef<number>(0)
  const [landedMap, setLandedMap] = useState<Record<string, boolean>>({})
  const onLeafPositionChangeRef = useRef(onLeafPositionChange)
  onLeafPositionChangeRef.current = onLeafPositionChange

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
        if (ent.landed) {
          if (ent.id === 'leaf' && onLeafPositionChangeRef.current) {
            const { x, y } = leafCenter(ent)
            onLeafPositionChangeRef.current(x, y, ent.rotation)
          }
          return
        }

        const isNav = ent.id === 'about' || ent.id === 'work' || ent.id === 'resume'
        const navOffsetX = vw < 640 && isNav ? vw * -0.05 : 0
        const landX = (ent.landingSpot.x / 100) * vw + navOffsetX
        const landY = (ent.landingSpot.y / 100) * vh

        /* Soft-landing phase: lerp to target over LANDING_DURATION_MS */
        if (ent.landingStart !== null) {
          const elapsed = Date.now() - ent.landingStart
          const progress = Math.min(1, elapsed / LANDING_DURATION_MS)
          const eased = 1 - (1 - progress) * (1 - progress) // ease-out quad
          ent.x = ent.landingFromX + (landX - ent.landingFromX) * eased
          ent.y = ent.landingFromY + (landY - ent.landingFromY) * eased
          ent.rotation = ent.landingFromRotation + (0 - ent.landingFromRotation) * eased
          ent.el.style.transform = `translate(${ent.x}px, ${ent.y}px) rotate(${ent.rotation}deg)`
          if (ent.id === 'leaf' && onLeafPositionChangeRef.current) {
            const { x, y } = leafCenter(ent)
            onLeafPositionChangeRef.current(x, y, ent.rotation)
          }
          if (progress >= 1) {
            ent.x = landX
            ent.y = landY
            ent.rotation = 0
            ent.landed = true
            ent.landingStart = null
            ent.el.style.transform = `translate(${landX}px, ${landY}px) rotate(0deg)`
            ent.el.style.willChange = 'auto'
            if (ent.id === 'leaf' && onLeafPositionChangeRef.current) {
              const { x, y } = leafCenter(ent)
              onLeafPositionChangeRef.current(x, y, 0)
            }
            setLandedMap((prev) => ({ ...prev, [ent.id]: true }))
          }
          return
        }

        // If user prefers reduced motion, snap to landing immediately
        if (reducedMotion) {
          ent.x = landX
          ent.y = landY
          ent.landed = true
          ent.el.style.transform = `translate(${ent.x}px, ${ent.y}px) rotate(0deg)`
          ent.el.style.willChange = 'auto'
          if (ent.id === 'leaf' && onLeafPositionChangeRef.current) {
            const { x, y } = leafCenter(ent)
            onLeafPositionChangeRef.current(x, y, 0)
          }
          setLandedMap((prev) => ({ ...prev, [ent.id]: true }))
          return
        }

        /* Repulsion from cursor */
        const dx = ent.x - cursor.x
        const dy = ent.y - cursor.y
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1)

        if (dist < REPULSION_RADIUS) {
          const force = REPULSION_STRENGTH / dist
          ent.vx += (dx / dist) * force
          ent.vy += (dy / dist) * force
        }

        /* Leaf: repel from center and nav zones so it doesn’t cover text or buttons */
        if (ent.id === 'leaf') {
          const cx = vw / 2
          const cy = vh / 2
          const cdx = ent.x - cx
          const cdy = ent.y - cy
          const cdist = Math.max(Math.sqrt(cdx * cdx + cdy * cdy), 1)
          if (cdist < CENTER_REPEL_RADIUS) {
            const cforce = (1 - cdist / CENTER_REPEL_RADIUS) * CENTER_REPEL_STRENGTH
            ent.vx += (cdx / cdist) * cforce
            ent.vy += (cdy / cdist) * cforce
          }
          /* Nav row: Work, About, Resume (structured bottom strip) */
          const navOffset = vw < 640 ? vw * -0.05 : 0
          const buttonZones: [number, number][] = [
            [(25 / 100) * vw + navOffset, (80 / 100) * vh],
            [(50 / 100) * vw + navOffset, (80 / 100) * vh],
            [(75 / 100) * vw + navOffset, (80 / 100) * vh],
          ]
          buttonZones.forEach(([bx, by]) => {
            const bdx = ent.x - bx
            const bdy = ent.y - by
            const bdist = Math.max(Math.sqrt(bdx * bdx + bdy * bdy), 1)
            if (bdist < BUTTON_REPEL_RADIUS) {
              const bforce = (1 - bdist / BUTTON_REPEL_RADIUS) * BUTTON_REPEL_STRENGTH
              ent.vx += (bdx / bdist) * bforce
              ent.vy += (bdy / bdist) * bforce
            }
          })
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

        /* Landing check: start soft-landing phase when close and slow */
        const toDist = Math.sqrt(toDx * toDx + toDy * toDy)
        const speed = Math.sqrt(ent.vx * ent.vx + ent.vy * ent.vy)

        if (toDist < LAND_DIST && speed < LAND_VEL) {
          ent.vx = 0
          ent.vy = 0
          ent.landingStart = Date.now()
          ent.landingFromX = ent.x
          ent.landingFromY = ent.y
          ent.landingFromRotation = ent.rotation
          ent.el.style.willChange = 'transform'
          return
        }

        /* Apply transform (GPU-composited) */
        ent.el.style.transform = `translate(${ent.x}px, ${ent.y}px) rotate(${ent.rotation}deg)`
        if (ent.id === 'leaf' && onLeafPositionChangeRef.current) {
          const { x, y } = leafCenter(ent)
          onLeafPositionChangeRef.current(x, y, ent.rotation)
        }
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* ── Kick entity (leaf only): unland, impulse away from cursor, new valid spot ── */
  const kickEntity = useCallback((id: string) => {
    if (id !== 'leaf') return
    const ent = entitiesRef.current.get(id)
    if (!ent || !ent.landed) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const cursor = cursorRef.current

    ent.landed = false
    ent.landingStart = null
    setLandedMap((prev) => ({ ...prev, [id]: false }))

    const landX = (ent.landingSpot.x / 100) * vw
    const landY = (ent.landingSpot.y / 100) * vh

    const dx = ent.x - cursor.x
    const dy = ent.y - cursor.y
    const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1)
    ent.vx += (dx / dist) * KICK_IMPULSE
    ent.vy += (dy / dist) * KICK_IMPULSE

    const currentSpot = ent.landingSpot
    const otherSpots = LEAF_SPOTS.filter(
      (s) => s.x !== currentSpot.x || s.y !== currentSpot.y
    )
    const nextSpot = otherSpots[Math.floor(Math.random() * otherSpots.length)] ?? LEAF_SPOTS[0]
    ent.landingSpot = nextSpot

    ent.el.style.transition = 'none'
    ent.el.style.willChange = 'transform'
  }, [])

  /* ── Register / unregister ── */
  const register = useCallback(
    (
      id: string,
      el: HTMLElement,
      landingSpot: LandingSpot,
      startX: number,
      startY: number,
      settleTimeoutMs?: number,
    ) => {
      const timeoutMs =
        settleTimeoutMs ?? (id === 'leaf' ? LEAF_SETTLE_TIMEOUT_MS : DEFAULT_SETTLE_TIMEOUT_MS)
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
        landingStart: null,
        landingFromX: startX,
        landingFromY: startY,
        landingFromRotation: 0,
      }
      el.style.willChange = 'transform'
      el.style.transform = `translate(${startX}px, ${startY}px) rotate(${entity.rotation}deg)`
      entitiesRef.current.set(id, entity)
      if (id === 'leaf' && onLeafPositionChangeRef.current) {
        const w = el.offsetWidth || 80
        const h = el.offsetHeight || 80
        onLeafPositionChangeRef.current(startX + w / 2, startY + h / 2, entity.rotation)
      }

      const settleTimeout = setTimeout(() => {
        const ent = entitiesRef.current.get(id)
        if (!ent || ent.landed || ent.landingStart !== null) return
        const vw = window.innerWidth
        const vh = window.innerHeight
        ent.vx = 0
        ent.vy = 0
        ent.landingStart = Date.now()
        ent.landingFromX = ent.x
        ent.landingFromY = ent.y
        ent.landingFromRotation = ent.rotation
        ent.el.style.willChange = 'transform'
      }, timeoutMs)

      return () => {
        clearTimeout(settleTimeout)
        entitiesRef.current.delete(id)
      }
    },
    [],
  )

  return (
    <LabyrinthContext.Provider value={{ register, kickEntity, landedMap }}>
      {children}
    </LabyrinthContext.Provider>
  )
}
