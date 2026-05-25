// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'

const API_KEY  = process.env.CRICKETDATA_API_KEY
const BASE_URL = 'https://api.cricapi.com/v1'

// Simple in-memory cache (30s TTL for Render free tier)
let cache: { data: any; ts: number } | null = null
const CACHE_TTL = 30_000

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') || 'currentMatches'

  // Serve from cache if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, max-age=30' },
    })
  }

  if (!API_KEY) {
    return NextResponse.json({ error: 'Cricket API key not configured' }, { status: 503 })
  }

  try {
    let endpoint = ''
    switch (type) {
      case 'currentMatches': endpoint = `${BASE_URL}/currentMatches?apikey=${API_KEY}&offset=0`; break
      case 'upcomingMatches': endpoint = `${BASE_URL}/matches?apikey=${API_KEY}&offset=0`; break
      case 'series': endpoint = `${BASE_URL}/series?apikey=${API_KEY}&offset=0`; break
      default: endpoint = `${BASE_URL}/currentMatches?apikey=${API_KEY}&offset=0`
    }

    const res = await fetch(endpoint, { next: { revalidate: 30 } })
    if (!res.ok) throw new Error(`Cricket API error: ${res.status}`)
    const data = await res.json()

    cache = { data, ts: Date.now() }
    return NextResponse.json(data, {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, max-age=30' },
    })
  } catch (err: any) {
    console.error('Cricket API error:', err.message)
    // Return cached stale data if available
    if (cache) return NextResponse.json(cache.data, { headers: { 'X-Cache': 'STALE' } })
    return NextResponse.json({ error: 'Failed to fetch cricket data', data: [] }, { status: 502 })
  }
}
