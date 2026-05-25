// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../lib/db'
import SarkariJob from '../../models/SarkariJob'
import { getAuth, getEmployeeAuth } from '../../lib/auth'

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = req.nextUrl
  const page     = parseInt(searchParams.get('page')     || '1')
  const limit    = parseInt(searchParams.get('limit')    || '20')
  const category = searchParams.get('category') || ''
  const state    = searchParams.get('state')    || ''
  const search   = searchParams.get('search')   || ''
  const featured = searchParams.get('featured') || ''
  const expired  = searchParams.get('expired')  || ''

  const q: any = { isActive: true }
  if (!expired) q.isExpired = false
  if (category) q.category = category
  if (state && state !== 'All India') q.state = { $in: [state, 'All India'] }
  if (featured) q.isFeatured = true
  if (search) q.$text = { $search: search }

  const [jobs, total] = await Promise.all([
    SarkariJob.find(q).sort({ isFeatured: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    SarkariJob.countDocuments(q),
  ])

  return NextResponse.json({ jobs, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const auth = getAuth() || getEmployeeAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const job = await SarkariJob.create({ ...body, postedBy: auth.adminId })
  return NextResponse.json(job, { status: 201 })
}
