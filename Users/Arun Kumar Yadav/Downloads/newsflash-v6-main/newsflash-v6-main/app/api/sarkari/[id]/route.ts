// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../lib/db'
import SarkariJob from '../../../models/SarkariJob'
import { getAuth, getEmployeeAuth } from '../../../lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const job = await SarkariJob.findById(params.id).lean()
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // Increment views
  SarkariJob.findByIdAndUpdate(params.id, { $inc: { views: 1 } }).exec()
  return NextResponse.json(job)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuth() || getEmployeeAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const job = await SarkariJob.findByIdAndUpdate(params.id, body, { new: true })
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(job)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuth()
  if (!auth || auth.role !== 'SuperAdmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await connectDB()
  await SarkariJob.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}
