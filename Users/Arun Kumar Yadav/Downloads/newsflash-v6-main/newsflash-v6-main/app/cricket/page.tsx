'use client'
// @ts-nocheck
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  live: '#C62828',
  completed: '#1B5E20',
  upcoming: '#1565C0',
}

function MatchCard({ match }: { match: any }) {
  const isLive = match.matchStarted && !match.matchEnded
  const isCompleted = match.matchEnded
  const status = isLive ? 'live' : isCompleted ? 'completed' : 'upcoming'

  return (
    <Link href={`/cricket/match/${match.id}`}
      style={{ background: 'white', borderRadius: 8, padding: 16, border: '1px solid #E8E8E4', textDecoration: 'none', display: 'block', borderLeft: `4px solid ${STATUS_COLORS[status]}`, transition: 'box-shadow 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {isLive && (
            <span style={{ background: '#C62828', color: 'white', padding: '2px 8px', borderRadius: 2, fontSize: 9, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, animation: 'pulse 2s infinite' }}>
              ● LIVE
            </span>
          )}
          <span style={{ fontSize: 10, color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>{match.matchType?.toUpperCase()} · {match.series_id ? 'IPL 2026' : match.name?.split(',')[1]?.trim() || ''}</span>
        </div>
        <span style={{ fontSize: 10, color: '#aaa', fontFamily: 'JetBrains Mono, monospace' }}>{match.venue?.split(',')[0] || ''}</span>
      </div>

      {/* Teams */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {match.teams?.map((team: string, i: number) => {
          const score = match.score?.[i]
          return (
            <div key={team} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0D1B2A', fontFamily: 'Playfair Display, serif' }}>{team}</div>
              {score && (
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#0D1B2A', fontFamily: 'JetBrains Mono, monospace' }}>
                    {score.r}/{score.w}
                  </span>
                  <span style={{ fontSize: 11, color: '#888', fontFamily: 'JetBrains Mono, monospace', marginLeft: 4 }}>
                    ({score.o} ov)
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Status */}
      <div style={{ marginTop: 10, fontSize: 12, color: isLive ? '#C62828' : '#888', fontFamily: 'JetBrains Mono, monospace', fontWeight: isLive ? 600 : 400 }}>
        {match.status}
      </div>
    </Link>
  )
}

export default function CricketPage() {
  const [matches, setMatches]   = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [tab, setTab]           = useState<'live' | 'upcoming' | 'all'>('live')

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch('/api/cricket/matches?type=currentMatches')
      const data = await res.json()
      if (data.data) {
        setMatches(data.data)
        setLastUpdated(new Date())
        setError('')
      } else if (data.error) {
        setError(data.error)
      }
    } catch {
      setError('Failed to load cricket data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMatches()
    const interval = setInterval(fetchMatches, 30_000)
    return () => clearInterval(interval)
  }, [fetchMatches])

  const liveMatches     = matches.filter(m => m.matchStarted && !m.matchEnded)
  const upcomingMatches = matches.filter(m => !m.matchStarted)
  const completedMatches = matches.filter(m => m.matchEnded)

  const displayed = tab === 'live' ? liveMatches : tab === 'upcoming' ? upcomingMatches : matches

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#F4F4F0', minHeight: '100vh' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .match-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
      `}</style>

      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #0D1B2A 100%)', color: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>← NewsFlash</Link>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 900, marginTop: 4 }}>
                🏏 Cricket <span style={{ color: '#A5D6A7' }}>Live</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                Live scores · IPL 2026 · International Cricket
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {lastUpdated && (
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>
                  Updated: {lastUpdated.toLocaleTimeString('en-IN')}
                </div>
              )}
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                Auto-refresh every 30s
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', gap: 0 }}>
          {[
            { key: 'live',     label: `🔴 Live (${liveMatches.length})` },
            { key: 'upcoming', label: `📅 Upcoming (${upcomingMatches.length})` },
            { key: 'all',      label: `📋 All (${matches.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              style={{ padding: '12px 18px', background: 'none', border: 'none', color: tab === t.key ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', borderBottom: tab === t.key ? '3px solid #C62828' : '3px solid transparent', transition: 'all 0.15s' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ background: 'white', borderRadius: 8, padding: 16, border: '1px solid #E8E8E4', height: 140, background: 'linear-gradient(90deg, #f0f0ec 25%, #e8e8e4 50%, #f0f0ec 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 8 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏏</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#C62828', marginBottom: 8 }}>{error}</div>
            <div style={{ fontSize: 12, color: '#aaa', fontFamily: 'JetBrains Mono, monospace' }}>
              {!process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost') ? 'Configure CRICKETDATA_API_KEY in environment variables' : 'Add your CricketData.org API key to .env.local'}
            </div>
            <button onClick={fetchMatches} style={{ marginTop: 16, background: '#C62828', color: 'white', border: 'none', padding: '9px 20px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
              Retry
            </button>
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 8 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏏</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#aaa' }}>
              {tab === 'live' ? 'No live matches right now' : tab === 'upcoming' ? 'No upcoming matches' : 'No matches found'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {displayed.map((m: any) => <MatchCard key={m.id} match={m} />)}
          </div>
        )}

        {/* Cricket News */}
        <div style={{ marginTop: 32 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#888', marginBottom: 14 }}>Cricket News</div>
          <Link href="/?category=Cricket" style={{ display: 'inline-block', background: '#1B5E20', color: 'white', padding: '10px 20px', borderRadius: 4, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            View All Cricket Articles →
          </Link>
        </div>
      </main>
    </div>
  )
}
