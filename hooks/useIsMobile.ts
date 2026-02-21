'use client'

import { useState, useEffect } from 'react'

const MOBILE_MAX = 640

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`)
    const update = () => setIsMobile(window.innerWidth <= MOBILE_MAX)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return isMobile
}
