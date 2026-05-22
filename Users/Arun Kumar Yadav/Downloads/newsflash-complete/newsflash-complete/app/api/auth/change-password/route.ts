import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Admin from '@/models/Admin'
import { getAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const auth = getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { currentPassword, newPassword } = await req.json()
  if (!currentPassword || !newPassword)
    return NextResponse.json({ error: 'Both passwords required' }, { status: 400 })

  await connectDB()
  const admin = await Admin.findById(auth.adminId)
  if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 })

  const valid = await admin.comparePassword(currentPassword)
  if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })

  admin.passwordHash = newPassword // pre-save hook will hash it
  await admin.save()
  return NextResponse.json({ success: true })
}
