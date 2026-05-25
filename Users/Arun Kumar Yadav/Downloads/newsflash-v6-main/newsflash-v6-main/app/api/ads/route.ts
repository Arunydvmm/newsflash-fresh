// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../lib/db'
import AdSlot from '../../models/AdSlot'
import { getAuth } from '../../lib/auth'

export async function GET() {
  await connectDB()
  const slots = await AdSlot.find().lean()
  return NextResponse.json(slots)
}

export async function PUT(req: NextRequest) {
  if (!getAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const slots = await req.json()
  const updates = await Promise.all(
    slots.map((s: any) =>
      AdSlot.findOneAndUpdate(
        { slotId: s.slotId },
        { enabled: s.enabled, script: s.script },
        { new: true }
      )
    )
  )
  return NextResponse.json(updates)
}
