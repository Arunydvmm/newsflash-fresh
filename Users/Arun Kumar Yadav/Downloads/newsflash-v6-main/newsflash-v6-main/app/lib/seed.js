require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) { console.error('❌ Set MONGODB_URI in .env.local'); process.exit(1) }

const AdminSchema = new mongoose.Schema({
  username: String, email: String, passwordHash: String, role: String,
}, { timestamps: true })

const AdSlotSchema = new mongoose.Schema({
  slotId: String, name: String, size: String, position: String, enabled: Boolean, script: String,
}, { timestamps: true })

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  const Admin  = mongoose.models.Admin  || mongoose.model('Admin', AdminSchema)
  const AdSlot = mongoose.models.AdSlot || mongoose.model('AdSlot', AdSlotSchema)

  const existing = await Admin.findOne({ username: 'admin' })
  if (!existing) {
    const hash = await bcrypt.hash('Admin@123', 12)
    await Admin.create({ username: 'admin', email: 'admin@newsflash.in', passwordHash: hash, role: 'SuperAdmin' })
    console.log('✅ Admin created → username: admin | password: Admin@123')
  } else {
    console.log('ℹ️  Admin already exists')
  }

  const slots = [
    { slotId: 'header-leaderboard', name: 'Header Leaderboard',  size: '728×90',  position: 'Below navigation', enabled: false, script: '' },
    { slotId: 'sidebar-rectangle',  name: 'Sidebar Rectangle',   size: '300×250', position: 'Right sidebar',    enabled: false, script: '' },
    { slotId: 'mid-article',        name: 'Mid-Article Banner',   size: '728×90',  position: 'Mid article',      enabled: false, script: '' },
  ]
  for (const s of slots) {
    await AdSlot.updateOne({ slotId: s.slotId }, { $setOnInsert: s }, { upsert: true })
  }
  console.log('✅ Ad slots seeded')
  await mongoose.disconnect()
  console.log('✅ Seeding complete!')
}

seed().catch(err => { console.error(err); process.exit(1) })
