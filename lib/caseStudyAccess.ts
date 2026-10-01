/** Shared unlock cookie for password-gated case studies (Trochi, Fleetworthy). */
export const TROCHI_COOKIE = 'trochi_access'

/** Password from env, with wrapping quotes stripped (Netlify sometimes stores them literally). */
export function caseStudyPassword(): string {
  let value = (process.env.TROCHI_PASSWORD ?? '').trim()
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    value = value.slice(1, -1)
  }
  return value
}

/**
 * Build an absolute site URL for redirects. Netlify can present https on port 80,
 * which makes browsers throw ERR_SSL_PROTOCOL_ERROR after unlock.
 */
export function siteUrl(request: Request, pathname: string): URL {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const hostHeader = forwardedHost ?? request.headers.get('host')
  const protoHeader = request.headers.get('x-forwarded-proto')

  if (hostHeader) {
    const host = hostHeader.replace(/:\d+$/, '')
    const proto = protoHeader === 'http' ? 'http' : 'https'
    return new URL(pathname, `${proto}://${host}`)
  }

  const url = new URL(request.url)
  if (
    (url.protocol === 'https:' && url.port === '80') ||
    (url.protocol === 'http:' && url.port === '443')
  ) {
    url.port = ''
  }
  return new URL(pathname, url.origin)
}

/** Cookie value is a hash of the password, so the password itself never leaves the server. */
export async function accessToken(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`trochi:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
