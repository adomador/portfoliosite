'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const ALIASES: Record<string, string> = {
  home: '',
  about: 'about',
  work: 'work',
  approach: 'approach',
  contact: 'contact',
}

/**
 * The case-study pages and /art link back with `?section=work`, a leftover from
 * when the homepage was a fixed canvas rather than a scrolling document. Honour
 * those URLs, jump to the right section, then tidy the address bar.
 */
export default function DeepLink() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const requested = searchParams?.get('section')
    if (requested === null || requested === undefined) return

    const id = ALIASES[requested]
    const target = id ? document.getElementById(id) : null

    if (target) {
      target.scrollIntoView({ behavior: 'auto', block: 'start' })
    } else {
      window.scrollTo(0, 0)
    }

    window.history.replaceState(null, '', window.location.pathname + (id ? `#${id}` : ''))
  }, [searchParams])

  return null
}
