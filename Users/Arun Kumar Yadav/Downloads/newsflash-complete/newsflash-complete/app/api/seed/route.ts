import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Admin from '@/models/Admin'
import AdSlot from '@/models/AdSlot'

// One-time setup route — call GET /api/seed?key=SEED_SECRET
// Set SEED_SECRET env var, then hit this URL once after deploy
export async function GET(req: NextRequest) {
  const key    = req.nextUrl.searchParams.get('key')
  const secret = process.env.SEED_SECRET || 'newsflash-seed-2026'

  if (key !== secret)
    return NextResponse.json({ error: 'Invalid seed key' }, { status: 403 })

  await connectDB()

  // Create admin if not exists
  let adminCreated = false
  const existing = await Admin.findOne({ username: 'admin' })
  if (!existing) {
    const admin = new Admin({
      username: 'admin',
      email: 'admin@newsflash.in',
      passwordHash: 'Admin@123',
      role: 'SuperAdmin',
    })
    await admin.save()
    adminCreated = true
  }

  // Create default ad slots
  const slots = [
    { slotId:'header-leaderboard', name:'Header Leaderboard',  size:'728×90',  position:'Below navigation in site header', enabled:false, script:'' },
    { slotId:'sidebar-rectangle',  name:'Sidebar Rectangle',   size:'300×250', position:'Right sidebar on homepage',       enabled:false, script:'' },
    { slotId:'mid-article',        name:'Mid-Article Banner',   size:'728×90',  position:'Mid-way through article body',    enabled:false, script:'' },
  ]
  for (const s of slots) {
    await AdSlot.updateOne({ slotId: s.slotId }, { $setOnInsert: s }, { upsert: true })
  }

  return NextResponse.json({
    success: true,
    adminCreated,
    message: adminCreated
      ? 'Admin created: username=admin password=Admin@123 — CHANGE THIS PASSWORD IMMEDIATELY at /admin/settings'
      : 'Admin already existed. Ad slots seeded.',
  })
}
