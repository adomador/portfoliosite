'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import styles from './SoftDissolve.module.css'

/** Matches the mosaic leave veil so both directions feel the same length. */
export const DISSOLVE_MS = 380

type SoftDissolveApi = {
  dissolve: (href: string) => void
}

const SoftDissolveContext = createContext<SoftDissolveApi | null>(null)

export function useSoftDissolve() {
  const ctx = useContext(SoftDissolveContext)
  if (!ctx) throw new Error('useSoftDissolve must be used within SoftDissolveProvider')
  return ctx
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function SoftDissolveProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const targetHref = useRef<string | null>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>()
  const clearTimer = useRef<ReturnType<typeof setTimeout>>()
  const [phase, setPhase] = useState<'idle' | 'in' | 'hold' | 'out'>('idle')

  const finish = useCallback(() => {
    targetHref.current = null
    setPhase('idle')
    document.documentElement.style.overflow = ''
  }, [])

  const dissolve = useCallback(
    (href: string) => {
      if (prefersReducedMotion()) {
        router.push(href)
        return
      }
      clearTimeout(leaveTimer.current)
      clearTimeout(clearTimer.current)
      targetHref.current = href
      document.documentElement.style.overflow = 'hidden'
      setPhase('in')
      router.prefetch(href)
      leaveTimer.current = setTimeout(() => {
        setPhase('hold')
        router.push(href)
      }, DISSOLVE_MS)
    },
    [router]
  )

  useEffect(() => {
    if (phase !== 'hold' || !targetHref.current) return
    const path = targetHref.current.split('?')[0] || '/'
    if (pathname !== path) return
    /* A frame so the mosaic can paint under the veil before we lift it. */
    const id = window.requestAnimationFrame(() => {
      setPhase('out')
      clearTimer.current = setTimeout(finish, DISSOLVE_MS)
    })
    return () => window.cancelAnimationFrame(id)
  }, [pathname, phase, finish])

  /* Safety: never leave the veil or overflow lock stuck if navigation aborts. */
  useEffect(() => {
    if (phase === 'idle' || phase === 'out') return
    const safety = window.setTimeout(() => {
      if (targetHref.current) {
        const path = targetHref.current.split('?')[0] || '/'
        if (window.location.pathname === path || phase === 'hold') {
          setPhase('out')
          clearTimer.current = setTimeout(finish, DISSOLVE_MS)
          return
        }
      }
      finish()
    }, DISSOLVE_MS * 4)
    return () => window.clearTimeout(safety)
  }, [phase, finish])

  useEffect(() => {
    return () => {
      clearTimeout(leaveTimer.current)
      clearTimeout(clearTimer.current)
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <SoftDissolveContext.Provider value={{ dissolve }}>
      {children}
      <div
        className={`${styles.veil} ${
          phase === 'in' || phase === 'hold' ? styles.veilOn : ''
        } ${phase === 'out' ? styles.veilOut : ''}`}
        aria-hidden
      />
    </SoftDissolveContext.Provider>
  )
}

type LinkProps = {
  href: string
  className?: string
  children: ReactNode
}

/** Soft dissolve out of a case study and into the mosaic. */
export function SoftDissolveLink({ href, className, children }: LinkProps) {
  const { dissolve } = useSoftDissolve()

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return
    }
    e.preventDefault()
    dissolve(href)
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
