import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET       = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-in-production')
const AUTH_COOKIE  = 'nf_token'
const EMP_COOKIE   = 'nf_emp_token'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Super Admin panel (/admin/*)
  if (pathname.startsWith('/admin/')) {
    const token = req.cookies.get(AUTH_COOKIE)?.value
    if (!token) return NextResponse.redirect(new URL('/admin', req.url))
    try {
      await jwtVerify(token, SECRET)
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  // ── Employee portal (/staff/*)
  if (pathname.startsWith('/staff/')) {
    const token = req.cookies.get(EMP_COOKIE)?.value
    if (!token) return NextResponse.redirect(new URL('/staff', req.url))
    try {
      await jwtVerify(token, SECRET)
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/staff', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path+', '/staff/:path+'],
}
