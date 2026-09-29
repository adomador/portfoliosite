export const TROCHI_COOKIE = 'trochi_access'

/** Cookie value is a hash of the password, so the password itself never leaves the server. */
export async function accessToken(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`trochi:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
