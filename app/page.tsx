'use client'

import { CanvasNavigationProvider, useCanvasNavigation } from '@/contexts/CanvasNavigationContext'
import AboutSection from '@/components/sections/AboutSection'
import WorkSection from '@/components/sections/WorkSection'
import HomeSection from '@/components/sections/HomeSection'
import TransitionSection from '@/components/sections/TransitionSection'
import PersistentLeafOverlay from '@/components/PersistentLeafOverlay'
import styles from './page.module.css'

function CanvasWrapper({ children }: { children: React.ReactNode }) {
  const { translateYVh } = useCanvasNavigation()
  return (
    <div
      className={styles.canvasWrapper}
      style={{ transform: `translateY(${translateYVh}vh)` }}
    >
      {children}
    </div>
  )
}

export default function Page() {
  return (
    <CanvasNavigationProvider>
      <PersistentLeafOverlay />
      <CanvasWrapper>
        <AboutSection />
        <TransitionSection direction="rise" />
        <TransitionSection direction="rise" />
        <HomeSection />
        <TransitionSection direction="fall" />
        <TransitionSection direction="fall" />
        <WorkSection />
      </CanvasWrapper>
    </CanvasNavigationProvider>
  )
}
