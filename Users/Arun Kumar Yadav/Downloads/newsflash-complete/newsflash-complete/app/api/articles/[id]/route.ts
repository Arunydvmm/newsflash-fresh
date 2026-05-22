import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Article from '@/models/Article'
import { getAuth } from '@/lib/auth'

type P = { params: { id: string } }

export async function GET(_: NextRequest, { params }: P) {
  await connectDB()
  const a = await Article.findById(params.id).lean()
  if (!a) return NextResponse.json({ error:'Not found' }, { status:404 })
  return NextResponse.json(a)
}

export async function PATCH(req: NextRequest, { params }: P) {
  if (!getAuth()) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  await connectDB()
  const body = await req.json()
  const a = await Article.findByIdAndUpdate(params.id, body, { new:true })
  if (!a) return NextResponse.json({ error:'Not found' }, { status:404 })
  return NextResponse.json(a)
}

export async function DELETE(_: NextRequest, { params }: P) {
  const auth = getAuth()
  if (!auth) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  await connectDB()
  await Article.findByIdAndDelete(params.id)
  return NextResponse.json({ success:true })
}
