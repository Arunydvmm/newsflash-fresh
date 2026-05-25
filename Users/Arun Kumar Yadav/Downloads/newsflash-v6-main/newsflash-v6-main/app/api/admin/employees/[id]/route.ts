// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../../lib/db'
import Employee from '../../../../models/Employee'
import { getAuth } from '../../../../lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuth()
  if (!auth || auth.role !== 'SuperAdmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await connectDB()
  const emp = await Employee.findById(params.id).select('-passwordHash').lean()
  if (!emp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(emp)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuth()
  if (!auth || auth.role !== 'SuperAdmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await connectDB()
  const body = await req.json()

  // If password is being changed, update passwordHash
  if (body.password) {
    const emp = await Employee.findById(params.id)
    if (!emp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    emp.passwordHash = body.password
    Object.assign(emp, { ...body, passwordHash: body.password })
    delete emp.password
    await emp.save()
    const result = emp.toObject()
    delete result.passwordHash
    return NextResponse.json(result)
  }

  delete body.passwordHash
  delete body.password
  const emp = await Employee.findByIdAndUpdate(params.id, body, { new: true }).select('-passwordHash')
  if (!emp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(emp)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuth()
  if (!auth || auth.role !== 'SuperAdmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await connectDB()
  await Employee.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}
