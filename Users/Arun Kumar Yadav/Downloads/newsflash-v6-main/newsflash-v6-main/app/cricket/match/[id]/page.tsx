'use client'
// @ts-nocheck
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function MatchDetailPage() {
  const { id } = useParams()
  const [data, setData]     = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]       = useState<'scorecard' | 'info'>('scorecard')

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/cricket/match/${id}`)
      const d = await res.json()
      setData(d)
    } catch {}
    finally { setLoading(false) }
  }, [id])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30_000)
    return () => clearInterval(interval)
  }, [fetchData])

  const info = data?.info?.data
  const scorecard = data?.scorecard?.data

  const isLive = info?.matchStarted && !info?.matchEnded

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#F4F4F0', minHeight: '100vh' }}>
      <header style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #0D1B2A 100%)', color: 'white', padding: '14px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>NewsFlash</Link>
            <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.3)' }}>›</span>
            <Link href="/cricket" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Cricket</Link>
            <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ color: 'white' }}>Match Detail</span>
          </div>
          {info && (
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                {isLive && <span style={{ background: '#C62828', color: 'white', padding: '2px 8px', borderRadius: 2, fontSize: 9, fontFamily: 'JetBrains Mono, monospace', animation: 'pulse 2s infinite' }}>● LIVE</span>}
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>{info.matchType?.toUpperCase()} · {info.venue}</span>
              </div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, margin: 0 }}>{info.name}</h1>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{info.status}</div>
            </div>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Loading match data...</div>
        ) : !info ? (
          <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 8 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏏</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#aaa' }}>Match data unavailable</div>
            <Link href="/cricket" style={{ display: 'inline-block', marginTop: 16, color: '#C62828', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>← Back to Cricket</Link>
          </div>
        ) : (
          <>
            {/* Score Summary */}
            {info.score?.length > 0 && (
              <div style={{ background: 'white', borderRadius: 8, padding: 20, marginBottom: 16, border: '1px solid #E8E8E4' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {info.teams?.map((team: string, i: number) => {
                    const score = info.score?.[i]
                    return (
                      <div key={team} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === 0 ? '1px solid #F0F0EC' : 'none' }}>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#0D1B2A' }}>{team}</div>
                        {score ? (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 24, fontWeight: 700, color: '#0D1B2A' }}>{score.r}/{score.w}</div>
                            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#888' }}>({score.o} overs)</div>
                          </div>
                        ) : <div style={{ color: '#aaa', fontSize: 13 }}>Yet to bat</div>}
                      </div>
                    )
                  })}
                </div>
                <div style={{ marginTop: 12, padding: '10px 14px', background: isLive ? '#FFEBEE' : '#E8F5E9', borderRadius: 4, fontSize: 13, fontWeight: 600, color: isLive ? '#C62828' : '#1B5E20', fontFamily: 'JetBrains Mono, monospace' }}>
                  {info.status}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 16, background: 'white', borderRadius: 8, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
              {[{ key: 'scorecard', label: 'Scorecard' }, { key: 'info', label: 'Match Info' }].map(t => (
                <button key={t.key} onClick={() => setTab(t.key as any)}
                  style={{ flex: 1, padding: '12px', background: tab === t.key ? '#0D1B2A' : 'white', color: tab === t.key ? 'white' : '#888', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s' }}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'scorecard' && scorecard && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {scorecard.map((innings: any, idx: number) => (
                  <div key={idx} style={{ background: 'white', borderRadius: 8, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
                    <div style={{ background: '#0D1B2A', color: 'white', padding: '12px 16px', fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700 }}>
                      {innings.inningsId === 1 ? '1st' : '2nd'} Innings — {innings.batTeamDetails?.batTeamName}
                    </div>
                    {innings.batTeamDetails?.batsmenData && (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                          <thead>
                            <tr style={{ background: '#F8F8F6' }}>
                              {['Batsman','R','B','4s','6s','SR'].map(h => (
                                <th key={h} style={{ padding: '8px 12px', textAlign: h === 'Batsman' ? 'left' : 'right', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#888', fontWeight: 600 }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Object.values(innings.batTeamDetails.batsmenData).map((b: any) => (
                              <tr key={b.batId} style={{ borderTop: '1px solid #F0F0EC' }}>
                                <td style={{ padding: '10px 12px' }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1B2A' }}>{b.batName}</div>
                                  <div style={{ fontSize: 11, color: '#aaa' }}>{b.outDesc || (b.isStriker ? '* batting' : '')}</div>
                                </td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 14, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#0D1B2A' }}>{b.runs}</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#888' }}>{b.balls}</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#888' }}>{b.fours}</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#888' }}>{b.sixes}</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#888' }}>{b.strikeRate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {innings.bowlTeamDetails?.bowlersData && (
                      <div style={{ overflowX: 'auto', borderTop: '2px solid #F0F0EC' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
                          <thead>
                            <tr style={{ background: '#F8F8F6' }}>
                              {['Bowler','O','M','R','W','Econ'].map(h => (
                                <th key={h} style={{ padding: '8px 12px', textAlign: h === 'Bowler' ? 'left' : 'right', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#888', fontWeight: 600 }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Object.values(innings.bowlTeamDetails.bowlersData).map((b: any) => (
                              <tr key={b.bowlId} style={{ borderTop: '1px solid #F0F0EC' }}>
                                <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#0D1B2A' }}>{b.bowlName}</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#888' }}>{b.overs}</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#888' }}>{b.maidens}</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#888' }}>{b.runs}</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 14, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#C62828' }}>{b.wickets}</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#888' }}>{b.economy}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {tab === 'info' && info && (
              <div style={{ background: 'white', borderRadius: 8, padding: 20, border: '1px solid #E8E8E4' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {[
                      { label: 'Match', value: info.name },
                      { label: 'Type', value: info.matchType?.toUpperCase() },
                      { label: 'Venue', value: info.venue },
                      { label: 'Date', value: info.date },
                      { label: 'Toss', value: info.tossResults?.tossWinner ? `${info.tossResults.tossWinner} won the toss and chose to ${info.tossResults.decision}` : '—' },
                      { label: 'Umpires', value: info.umpires || '—' },
                      { label: 'Referee', value: info.referee || '—' },
                    ].map(r => (
                      <tr key={r.label} style={{ borderBottom: '1px solid #F0F0EC' }}>
                        <td style={{ padding: '10px 0', fontSize: 12, color: '#888', width: '30%', fontFamily: 'JetBrains Mono, monospace' }}>{r.label}</td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#0D1B2A', fontWeight: 500 }}>{r.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
