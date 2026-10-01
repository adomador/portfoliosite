import { NextResponse, type NextRequest } from 'next/server'
import { TROCHI_COOKIE, accessToken } from '@/lib/caseStudyAccess'

const LOCKED: Record<string, string> = {
  '/work/trochi': '/locked/trochi',
  '/work/fleetworthy': '/locked/fleetworthy',
}

export async function middleware(request: NextRequest) {
  const password = process.env.TROCHI_PASSWORD
  const cookie = request.cookies.get(TROCHI_COOKIE)?.value

  if (password && cookie && cookie === (await accessToken(password))) {
    return NextResponse.next()
  }

  const path = request.nextUrl.pathname.replace(/\/$/, '') || '/'
  const locked = LOCKED[path]
  if (locked) {
    return NextResponse.rewrite(new URL(`${locked}${request.nextUrl.search}`, request.url))
  }

  return new NextResponse(null, { status: 401 })
}

export const config = {
  matcher: [
    '/work/trochi',
    '/work/trochi/:path*',
    '/work/fleetworthy',
    '/work/fleetworthy/:path*',
  ],
}
