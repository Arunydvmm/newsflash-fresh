// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../../lib/db'
import Article from '../../../../models/Article'
import { getAuth } from '../../../../lib/auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuth()
  if (!auth || auth.role !== 'SuperAdmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await connectDB()
  const { action } = await req.json() // 'approve' | 'reject'

  const status = action === 'approve' ? 'published' : 'draft'
  const article = await Article.findByIdAndUpdate(params.id, { status }, { new: true })
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, status: article.status })
}
