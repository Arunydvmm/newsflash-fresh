// @ts-nocheck
import { NextResponse } from 'next/server'
import { EMP_AUTH_COOKIE } from '../../../lib/auth'

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set(EMP_AUTH_COOKIE, '', { maxAge: 0, path: '/' })
  return res
}
