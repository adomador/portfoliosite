'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'

export type CanvasSection = 'home' | 'about' | 'work'

const TRANSITION_DURATION_MS = 4000

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

interface CanvasNavigationContextValue {
  activeSection: CanvasSection
  /** translateY value in vh for the canvas wrapper */
  translateYVh: number
  /** true while the canvas is animating between sections (one leaf overlay shown) */
  isTransitioning: boolean
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

export function CanvasNavigationProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<CanvasSection>(getInitialSection)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionEndRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback((section: CanvasSection) => {
    if (section === activeSection) return
    if (transitionEndRef.current) clearTimeout(transitionEndRef.current)
    setIsTransitioning(true)
    document.body.classList.add('canvas-transitioning')
    setActiveSection(section)
    const hash = sectionToHash(section)
    const full = hash ? `${window.location.pathname}${hash}` : window.location.pathname
    window.history.replaceState(null, '', full)
    transitionEndRef.current = setTimeout(() => {
      transitionEndRef.current = null
      setIsTransitioning(false)
      document.body.classList.remove('canvas-transitioning')
    }, TRANSITION_DURATION_MS)
  }, [activeSection])

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const section = hashToSection(hash)
    setActiveSection(section)
  }, [])

  useEffect(() => {
    if (activeSection === 'about') document.body.classList.add('no-glow')
    else document.body.classList.remove('no-glow')
    return () => document.body.classList.remove('no-glow')
  }, [activeSection])

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
      value={{ activeSection, translateYVh, isTransitioning, goTo }}
    >
      {children}
    </CanvasNavigationContext.Provider>
  )
}
