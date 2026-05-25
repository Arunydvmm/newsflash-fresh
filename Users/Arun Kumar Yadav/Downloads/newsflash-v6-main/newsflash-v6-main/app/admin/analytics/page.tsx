'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import AdminShell from '../../components/admin/AdminShell'
import Link from 'next/link'

export default function AnalyticsPage() {
  const [data, setData]     = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return (
    <AdminShell>
      <div style={{ padding: 60, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Loading analytics...</div>
    </AdminShell>
  )

  const maxArticles = Math.max(...(data?.articlesLast30Days?.map((d: any) => d.count) || [1]))
  const maxCat = Math.max(...(data?.articlesByCategory?.map((c: any) => c.count) || [1]))

  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Analytics</h1>
          <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>Platform performance overview</p>
        </div>

        {/* Top Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total Articles',   value: data?.articles?.total,     color: '#0D1B2A', icon: '📄' },
            { label: 'Published',        value: data?.articles?.published, color: '#1B5E20', icon: '✅' },
            { label: 'Total Views',      value: data?.articles?.totalViews?.toLocaleString('en-IN'), color: '#C62828', icon: '👁' },
            { label: 'Pending Review',   value: data?.articles?.pending,   color: '#E65100', icon: '⏳' },
            { label: 'Active Jobs',      value: data?.jobs?.active,        color: '#1565C0', icon: '🏛' },
            { label: 'Unread Messages',  value: data?.contacts?.unread,    color: '#6A1B9A', icon: '✉' },
            { label: 'Team Members',     value: data?.employees?.active,   color: '#00838F', icon: '👥' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: 6, padding: '16px 18px', border: '1px solid #E8E8E4', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: 'Playfair Display, serif' }}>{s.value ?? '—'}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{s.label}</div>
                </div>
                <span style={{ fontSize: 20, opacity: 0.5 }}>{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Articles by Category */}
          <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0D1B2A', margin: '0 0 16px' }}>Articles by Category</h3>
            {data?.articlesByCategory?.map((c: any) => (
              <div key={c._id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#444' }}>{c._id}</span>
                  <span style={{ fontSize: 11, color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>{c.count}</span>
                </div>
                <div style={{ height: 6, background: '#F0F0EC', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#C62828', borderRadius: 3, width: `${(c.count / maxCat) * 100}%`, transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Jobs by Category */}
          <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0D1B2A', margin: '0 0 16px' }}>Jobs by Category</h3>
            {data?.jobsByCategory?.length === 0 ? (
              <div style={{ color: '#aaa', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', textAlign: 'center', padding: 20 }}>No jobs posted yet</div>
            ) : data?.jobsByCategory?.map((c: any) => {
              const maxJ = Math.max(...(data.jobsByCategory.map((x: any) => x.count)))
              return (
                <div key={c._id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#444' }}>{c._id}</span>
                    <span style={{ fontSize: 11, color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>{c.count}</span>
                  </div>
                  <div style={{ height: 6, background: '#F0F0EC', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#1B5E20', borderRadius: 3, width: `${(c.count / maxJ) * 100}%`, transition: 'width 0.5s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Articles last 30 days */}
        <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0D1B2A', margin: '0 0 16px' }}>Articles Published — Last 30 Days</h3>
          {data?.articlesLast30Days?.length === 0 ? (
            <div style={{ color: '#aaa', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', textAlign: 'center', padding: 20 }}>No data yet</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120, overflowX: 'auto' }}>
              {data?.articlesLast30Days?.map((d: any) => (
                <div key={d._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: '0 0 auto', minWidth: 28 }}>
                  <div style={{ fontSize: 9, color: '#aaa', fontFamily: 'JetBrains Mono, monospace' }}>{d.count}</div>
                  <div style={{ width: 20, background: '#C62828', borderRadius: '2px 2px 0 0', height: `${Math.max(4, (d.count / maxArticles) * 90)}px`, transition: 'height 0.5s' }} />
                  <div style={{ fontSize: 8, color: '#aaa', fontFamily: 'JetBrains Mono, monospace', transform: 'rotate(-45deg)', transformOrigin: 'top left', whiteSpace: 'nowrap', marginTop: 8 }}>
                    {d._id?.slice(5)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Articles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8E8E4' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0D1B2A', margin: 0 }}>🔥 Top Articles by Views</h3>
            </div>
            {data?.topArticles?.map((a: any, i: number) => (
              <div key={a._id} style={{ padding: '12px 20px', borderBottom: '1px solid #F0F0EC', display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 900, color: '#E8E8E4', width: 24, flexShrink: 0 }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                  <div style={{ fontSize: 10, color: '#aaa', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{(a.views || 0).toLocaleString('en-IN')} views</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8E8E4' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0D1B2A', margin: 0 }}>🆕 Recent Articles</h3>
            </div>
            {data?.recentArticles?.map((a: any) => (
              <div key={a._id} style={{ padding: '12px 20px', borderBottom: '1px solid #F0F0EC' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>{a.category}</span>
                  <span style={{ fontSize: 10, color: '#aaa', fontFamily: 'JetBrains Mono, monospace' }}>{a.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
