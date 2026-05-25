// @ts-nocheck
const API_KEY  = process.env.CRICKETDATA_API_KEY || ''
const BASE_URL = 'https://api.cricapi.com/v1'

// Simple in-memory cache to avoid hammering the API
const cache: Record<string, { data: any; ts: number }> = {}
const TTL = 30_000 // 30 seconds

async function fetchCricket(endpoint: string, params: Record<string, string> = {}) {
  const cacheKey = endpoint + JSON.stringify(params)
  const now = Date.now()

  if (cache[cacheKey] && now - cache[cacheKey].ts < TTL) {
    return cache[cacheKey].data
  }

  const url = new URL(`${BASE_URL}/${endpoint}`)
  url.searchParams.set('apikey', API_KEY)
  url.searchParams.set('offset', '0')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 30 },
      headers: { 'Accept': 'application/json' },
    })
    if (!res.ok) throw new Error(`Cricket API error: ${res.status}`)
    const json = await res.json()
    cache[cacheKey] = { data: json, ts: now }
    return json
  } catch (err) {
    console.error('[Cricket API]', err)
    return null
  }
}

export async function getCurrentMatches() {
  return fetchCricket('currentMatches', { per_page: '10' })
}

export async function getMatchInfo(matchId: string) {
  return fetchCricket('match_info', { id: matchId })
}

export async function getMatchScorecard(matchId: string) {
  return fetchCricket('match_scorecard', { id: matchId })
}

export async function getSeriesList() {
  return fetchCricket('series', { per_page: '10' })
}

export async function getSeriesInfo(seriesId: string) {
  return fetchCricket('series_info', { id: seriesId })
}

export async function getPlayerInfo(playerId: string) {
  return fetchCricket('players_info', { id: playerId })
}

// Format match status for display
export function formatMatchStatus(match: any): string {
  if (!match) return 'Unknown'
  if (match.matchStarted && !match.matchEnded) return 'LIVE'
  if (match.matchEnded) return 'Completed'
  return 'Upcoming'
}

// Get team score string
export function getTeamScore(scoreArr: any[], teamName: string): string {
  if (!scoreArr?.length) return '—'
  const innings = scoreArr.filter((s: any) =>
    s.inning?.toLowerCase().includes(teamName?.toLowerCase())
  )
  if (!innings.length) return '—'
  return innings.map((i: any) => `${i.r}/${i.w} (${i.o} ov)`).join(' & ')
}
