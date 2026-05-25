// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../lib/db'
import Admin from '../../../models/Admin'
import { signToken, AUTH_COOKIE } from '../../../lib/auth'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  if (!username || !password)
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 })

  await connectDB()
  const admin = await Admin.findOne({ username: username.toLowerCase().trim() })
  if (!admin || !(await admin.comparePassword(password)))
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  admin.lastLogin = new Date()
  await admin.save()

  const token = signToken({ adminId: String(admin._id), username: admin.username, role: admin.role })
  const res = NextResponse.json({ success: true })
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7,
    path:     '/',
  })
  return res
}
