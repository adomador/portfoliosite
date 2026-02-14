'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'

export type CanvasSection = 'home' | 'about' | 'work'

const SECTION_TO_OFFSET: Record<CanvasSection, number> = {
  about: 0,
  home: -100,
  work: -200,
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

  const goTo = useCallback((section: CanvasSection) => {
    setActiveSection(section)
    const hash = sectionToHash(section)
    const full = hash ? `${window.location.pathname}${hash}` : window.location.pathname
    window.history.replaceState(null, '', full)
  }, [])

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
      value={{ activeSection, translateYVh, goTo }}
    >
      {children}
    </CanvasNavigationContext.Provider>
  )
}
