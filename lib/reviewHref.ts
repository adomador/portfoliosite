/** Prefix used by the public review copy. Inflight's data-path matches this same path. */
export const REVIEW_PREFIX = '/dive'

/**
 * Keep a link inside the review copy when it points at this site.
 * External, mail, and hash-only links stay untouched.
 */
export function scopeHref(href: string, prefix = ''): string {
  if (!prefix || !href.startsWith('/') || href.startsWith('//')) return href
  if (
    href === prefix ||
    href.startsWith(`${prefix}/`) ||
    href.startsWith(`${prefix}?`) ||
    href.startsWith(`${prefix}#`)
  ) {
    return href
  }
  if (href === '/') return prefix
  if (href.startsWith('/?') || href.startsWith('/#')) return `${prefix}${href.slice(1)}`
  return `${prefix}${href}`
}
