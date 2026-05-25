// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'

const API_KEY  = process.env.CRICKETDATA_API_KEY
const BASE_URL = 'https://api.cricapi.com/v1'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!API_KEY) return NextResponse.json({ error: 'Cricket API key not configured' }, { status: 503 })

  try {
    const [infoRes, scoreRes] = await Promise.all([
      fetch(`${BASE_URL}/match_info?apikey=${API_KEY}&id=${params.id}`),
      fetch(`${BASE_URL}/match_scorecard?apikey=${API_KEY}&id=${params.id}`),
    ])

    const [info, scorecard] = await Promise.all([infoRes.json(), scoreRes.json()])
    return NextResponse.json({ info, scorecard }, {
      headers: { 'Cache-Control': 'public, max-age=30' },
    })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch match data' }, { status: 502 })
  }
}
