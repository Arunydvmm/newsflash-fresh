// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../lib/db'
import Employee from '../../../models/Employee'
import { getAuth } from '../../../lib/auth'

export async function GET(req: NextRequest) {
  const auth = getAuth()
  if (!auth || auth.role !== 'SuperAdmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await connectDB()
  const employees = await Employee.find().select('-passwordHash').sort({ createdAt: -1 }).lean()
  return NextResponse.json({ employees })
}

export async function POST(req: NextRequest) {
  const auth = getAuth()
  if (!auth || auth.role !== 'SuperAdmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await connectDB()
  const body = await req.json()
  const { name, username, email, password, role, permissions } = body

  if (!name || !username || !email || !password || !role)
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })

  const existing = await Employee.findOne({ $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }] })
  if (existing) return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 })

  const emp = new Employee({
    name,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    passwordHash: password,
    role,
    permissions: permissions || {},
    createdBy: auth.adminId,
  })
  await emp.save()

  const result = emp.toObject()
  delete result.passwordHash
  return NextResponse.json(result, { status: 201 })
}
