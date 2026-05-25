'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import AdminShell from '../../components/admin/AdminShell'
import Link from 'next/link'

export default function AdminCricketPage() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    fetch('/api/cricket/matches')
      .then(r => r.json())
      .then(d => {
        setMatches(d.data || [])
        if (d.error) setError(d.error)
        setLoading(false)
      })
      .catch(() => { setError('Failed to load'); setLoading(false) })
  }, [])

  const live      = matches.filter((m: any) => m.matchStarted && !m.matchEnded)
  const upcoming  = matches.filter((m: any) => !m.matchStarted)
  const completed = matches.filter((m: any) => m.matchEnded)

  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Cricket Management</h1>
            <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>Live scores via CricketData.org API · Auto-refresh 30s</p>
          </div>
          <Link href="/cricket" target="_blank" style={{ background: '#1B5E20', color: 'white', padding: '9px 18px', borderRadius: 4, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
            🏏 View Cricket Portal →
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Live Matches',     value: live.length,      color: '#C62828', icon: '🔴' },
            { label: 'Upcoming',         value: upcoming.length,  color: '#1565C0', icon: '📅' },
            { label: 'Completed Today',  value: completed.length, color: '#1B5E20', icon: '✅' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: 6, padding: '16px 20px', border: '1px solid #E8E8E4', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: 'Playfair Display, serif' }}>{s.icon} {s.value}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* API Status */}
        <div style={{ background: error ? '#FFEBEE' : '#E8F5E9', border: `1px solid ${error ? '#FFCDD2' : '#C5E1A5'}`, borderRadius: 6, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: error ? '#C62828' : '#1B5E20', fontFamily: 'JetBrains Mono, monospace' }}>
          {error ? `⚠ API Error: ${error} — Check CRICKETDATA_API_KEY in environment variables` : `✓ CricketData.org API connected — ${matches.length} matches loaded`}
        </div>

        {/* Live Matches */}
        {live.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#C62828', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, background: '#C62828', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Live Now
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {live.map((m: any) => (
                <div key={m.id} style={{ background: 'white', borderRadius: 6, padding: '14px 18px', border: '1px solid #E8E8E4', borderLeft: '4px solid #C62828', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0D1B2A' }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{m.status}</div>
                    {m.score?.map((s: any, i: number) => (
                      <div key={i} style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#444', marginTop: 2 }}>
                        {m.teams?.[i]}: {s.r}/{s.w} ({s.o} ov)
                      </div>
                    ))}
                  </div>
                  <Link href={`/cricket/match/${m.id}`} target="_blank" style={{ background: '#C62828', color: 'white', padding: '7px 14px', borderRadius: 4, textDecoration: 'none', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                    Live →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cricket Articles */}
        <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0D1B2A', margin: '0 0 12px' }}>Cricket Content</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/admin/articles/new" style={{ background: '#1B5E20', color: 'white', padding: '9px 16px', borderRadius: 4, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
              + Write Cricket Article
            </Link>
            <Link href="/admin/articles?category=Cricket" style={{ background: '#F0F0EC', color: '#444', padding: '9px 16px', borderRadius: 4, textDecoration: 'none', fontSize: 12 }}>
              View Cricket Articles
            </Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </AdminShell>
  )
}
