// @ts-nocheck
import { NextResponse } from 'next/server'
import { getEmployeeAuth } from '../../../lib/auth'
import { connectDB } from '../../../lib/db'
import Employee from '../../../models/Employee'

export async function GET() {
  const auth = getEmployeeAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const emp = await Employee.findById(auth.adminId).select('-passwordHash').lean()
  if (!emp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(emp)
}
