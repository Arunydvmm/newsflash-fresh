// @ts-nocheck
import { NextResponse } from 'next/server'

export async function GET() {
  const txt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://newsflash-v6.onrender.com/sitemap.xml`

  return new NextResponse(txt, {
    headers: { 'Content-Type': 'text/plain' }
  })
}
