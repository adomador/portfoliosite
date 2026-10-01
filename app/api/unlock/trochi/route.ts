import { NextResponse } from 'next/server'
import {
  TROCHI_COOKIE,
  accessToken,
  caseStudyPassword,
  siteUrl,
} from '@/lib/caseStudyAccess'

export async function POST(request: Request) {
  const form = await request.formData()
  const attempt = String(form.get('password') ?? '')
  const password = caseStudyPassword()

  if (!password || attempt !== password) {
    return NextResponse.redirect(siteUrl(request, '/work/trochi?error=1'), 303)
  }

  const response = NextResponse.redirect(siteUrl(request, '/work/trochi'), 303)
  response.cookies.set(TROCHI_COOKIE, await accessToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return response
}
