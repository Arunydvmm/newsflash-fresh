// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../lib/db'
import Contact from '../../../models/Contact'
import { getAuth } from '../../../lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const msg = await Contact.findByIdAndUpdate(params.id, body, { new: true })
  return NextResponse.json(msg)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuth()
  if (!auth || auth.role !== 'SuperAdmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await connectDB()
  await Contact.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}
