// @ts-nocheck
import { NextResponse } from 'next/server'
import { getAuth } from '../../../lib/auth'

export async function GET() {
  const auth = getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ ok: true })
}
