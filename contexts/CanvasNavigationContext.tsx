'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type MutableRefObject,
} from 'react'

export type CanvasSection = 'home' | 'about' | 'work'

export const TRANSITION_DURATION_MS = 4000

/* 7 sections: About, empty, empty, Home, empty, empty, Work (each 100vh) */
const SECTION_TO_OFFSET: Record<CanvasSection, number> = {
  about: 0,
  home: -300,
  work: -600,
}

function hashToSection(hash: string): CanvasSection {
  if (hash === '#about') return 'about'
  if (hash === '#work') return 'work'
  return 'home'
}

function sectionToHash(section: CanvasSection): string {
  if (section === 'home') return ''
  return `#${section}`
}

export interface LeafPosition {
  x: number
  y: number
  rotation: number
}

interface CanvasNavigationContextValue {
  activeSection: CanvasSection
  translateYVh: number
  isTransitioning: boolean
  /** Written by labyrinth every frame when on home; SingleLeaf reads this */
  leafPositionRef: MutableRefObject<LeafPosition>
  /** Frozen copy when transition starts; SingleLeaf uses this while isTransitioning */
  frozenLeafPositionRef: MutableRefObject<LeafPosition>
  /** When returning to home, which section we came from (so leaf animates from that rest position) */
  fromSectionRef: MutableRefObject<CanvasSection | null>
  /** When transition started (Date.now()); used to interpolate leaf on return-to-home */
  transitionStartRef: MutableRefObject<number>
  goTo: (section: CanvasSection) => void
}

const CanvasNavigationContext = createContext<CanvasNavigationContextValue | null>(null)

export function useCanvasNavigation() {
  const ctx = useContext(CanvasNavigationContext)
  if (!ctx) throw new Error('useCanvasNavigation must be used within CanvasNavigationProvider')
  return ctx
}

function getInitialSection(): CanvasSection {
  if (typeof window === 'undefined') return 'home'
  return hashToSection(window.location.hash)
}

const DEFAULT_LEAF: LeafPosition = { x: 0, y: 0, rotation: 0 }

export function CanvasNavigationProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<CanvasSection>(getInitialSection)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionEndRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leafPositionRef = useRef<LeafPosition>({ ...DEFAULT_LEAF })
  const frozenLeafPositionRef = useRef<LeafPosition>({ ...DEFAULT_LEAF })
  const fromSectionRef = useRef<CanvasSection | null>(null)
  const transitionStartRef = useRef<number>(0)

  useEffect(() => {
    const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 0
    const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 0
    leafPositionRef.current = { x: cx, y: cy, rotation: 0 }
    frozenLeafPositionRef.current = { x: cx, y: cy, rotation: 0 }
  }, [])

  const goTo = useCallback((section: CanvasSection) => {
    if (section === activeSection) return
    if (transitionEndRef.current) clearTimeout(transitionEndRef.current)
    transitionStartRef.current = Date.now()
    if (section === 'home') {
      fromSectionRef.current = activeSection
    } else {
      fromSectionRef.current = null
    }
    frozenLeafPositionRef.current = { ...leafPositionRef.current }
    setIsTransitioning(true)
    setActiveSection(section)
    const hash = sectionToHash(section)
    const full = hash ? `${window.location.pathname}${hash}` : window.location.pathname
    window.history.replaceState(null, '', full)
    transitionEndRef.current = setTimeout(() => {
      transitionEndRef.current = null
      setIsTransitioning(false)
    }, TRANSITION_DURATION_MS)
  }, [activeSection])

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const section = hashToSection(hash)
    setActiveSection(section)
  }, [])

  useEffect(() => {
    const onPopState = () => {
      const hash = window.location.hash
      const section = hashToSection(hash)
      setActiveSection(section)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const translateYVh = SECTION_TO_OFFSET[activeSection]

  return (
    <CanvasNavigationContext.Provider
      value={{
        activeSection,
        translateYVh,
        isTransitioning,
        leafPositionRef,
        frozenLeafPositionRef,
        fromSectionRef,
        transitionStartRef,
        goTo,
      }}
    >
      {children}
    </CanvasNavigationContext.Provider>
  )
}
