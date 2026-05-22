import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Article from '@/models/Article'
import { getAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = req.nextUrl
  const page     = parseInt(searchParams.get('page')  || '1')
  const limit    = parseInt(searchParams.get('limit') || '20')
  const category = searchParams.get('category') || ''
  const search   = searchParams.get('search')   || ''
  const status   = searchParams.get('status')   || 'published'

  const q: any = { status }
  if (category) q.category = category
  if (search)   q.$text = { $search: search }

  const [articles, total] = await Promise.all([
    Article.find(q).sort({ createdAt:-1 }).skip((page-1)*limit).limit(limit).select('-content').lean(),
    Article.countDocuments(q),
  ])
  return NextResponse.json({ articles, total, page, pages: Math.ceil(total/limit) })
}

export async function POST(req: NextRequest) {
  const auth = getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const article = await Article.create({ ...body, author: body.author || auth.username })
  return NextResponse.json(article, { status: 201 })
}
