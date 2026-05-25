// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../lib/db'
import Article from '../../../models/Article'
import { getAuth, getEmployeeAuth, hasPermission } from '../../../lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const article = await Article.findById(params.id).lean()
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(article)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuth() || getEmployeeAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()

  // Employees cannot publish — only SuperAdmin can
  if (auth.type === 'employee' && body.status === 'published') {
    body.status = 'pending_review'
  }

  const article = await Article.findByIdAndUpdate(params.id, body, { new: true })
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(article)
}

// Support PUT as alias for PATCH (fixes ArticleForm bug)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return PATCH(req, { params })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuth()
  if (!auth || auth.role !== 'SuperAdmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await connectDB()
  await Article.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}
