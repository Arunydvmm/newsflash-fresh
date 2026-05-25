// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../lib/db'
import Employee from '../../../models/Employee'
import { signToken, EMP_AUTH_COOKIE } from '../../../lib/auth'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  if (!username || !password)
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 })

  await connectDB()
  const emp = await Employee.findOne({ username: username.toLowerCase().trim() })
  if (!emp || !(await emp.comparePassword(password)))
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  if (!emp.isActive || emp.isSuspended)
    return NextResponse.json({ error: 'Account suspended. Contact admin.' }, { status: 403 })

  emp.lastLogin = new Date()
  await emp.save()

  const token = signToken({
    adminId: String(emp._id),
    username: emp.username,
    role: emp.role,
    type: 'employee',
    permissions: emp.permissions.toObject ? emp.permissions.toObject() : emp.permissions,
  })

  const res = NextResponse.json({ success: true, role: emp.role, name: emp.name })
  res.cookies.set(EMP_AUTH_COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7,
    path:     '/',
  })
  return res
}
