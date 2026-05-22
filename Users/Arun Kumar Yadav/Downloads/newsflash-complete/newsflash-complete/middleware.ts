import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, AUTH_COOKIE } from '@/lib/auth'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /admin/* but NOT /admin (login page) or /api/auth/*
  const isAdminPage = pathname.startsWith('/admin/') // dashboard, articles, ads, settings
  if (!isAdminPage) return NextResponse.next()

  const token = req.cookies.get(AUTH_COOKIE)?.value
  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path+'],
}
