// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { connectDB } from '../../../../lib/db'
import Article from '../../../../models/Article'
import { getAuth } from '../../../../lib/auth'

type P = { params: { id: string } }

export async function POST(_: NextRequest, { params }: P) {
  const auth = getAuth()
  if (!auth) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  await connectDB()
  await Article.findByIdAndDelete(params.id)
  return NextResponse.redirect(new URL('/admin/articles', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
}
