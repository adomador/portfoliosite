import { NextResponse, type NextRequest } from 'next/server'
import { TROCHI_COOKIE, accessToken } from '@/lib/caseStudyAccess'

export async function middleware(request: NextRequest) {
  const password = process.env.TROCHI_PASSWORD
  const cookie = request.cookies.get(TROCHI_COOKIE)?.value

  if (password && cookie && cookie === (await accessToken(password))) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname === '/work/trochi') {
    return NextResponse.rewrite(new URL(`/locked/trochi${request.nextUrl.search}`, request.url))
  }

  return new NextResponse(null, { status: 401 })
}

export const config = {
  matcher: ['/work/trochi', '/work/trochi/:path*'],
}
