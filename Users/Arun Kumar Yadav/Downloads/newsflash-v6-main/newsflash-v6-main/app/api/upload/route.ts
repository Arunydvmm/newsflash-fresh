// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '../../lib/cloudinary'
import { getAuth, getEmployeeAuth } from '../../lib/auth'

export async function POST(req: NextRequest) {
  const auth = getAuth() || getEmployeeAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = (formData.get('file') || formData.get('image')) as File | null
    if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const base64 = `data:${file.type};base64,${Buffer.from(arrayBuffer).toString('base64')}`
    const url = await uploadImage(base64)
    return NextResponse.json({ url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
