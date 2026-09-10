import { Suspense } from 'react'
import { NightfallProvider } from '@/contexts/NightfallContext'
import Atmosphere from '@/components/Atmosphere'
import DeepLink from '@/components/DeepLink'
import FloatingNav from '@/components/FloatingNav'
import ScrollLeaf from '@/components/ScrollLeaf'
import Hero from '@/components/home/Hero'
import Work from '@/components/home/Work'
import About from '@/components/home/About'
import Contact from '@/components/home/Contact'
import SiteFooter from '@/components/home/SiteFooter'
import styles from './page.module.css'

export default function Page() {
  return (
    <NightfallProvider>
      <Atmosphere />
      <Suspense fallback={null}>
        <DeepLink />
      </Suspense>
      <FloatingNav />
      <ScrollLeaf />

      <main className={styles.main}>
        <Hero />
        <Work />
        <About />
        <Contact />
        <SiteFooter />
      </main>
    </NightfallProvider>
  )
}
