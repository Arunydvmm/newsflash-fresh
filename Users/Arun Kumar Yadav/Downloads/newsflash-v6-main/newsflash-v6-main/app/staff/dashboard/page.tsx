'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import StaffShell from '../../components/staff/StaffShell'
import Link from 'next/link'
import { format } from 'date-fns'

export default function StaffDashboardPage() {
  const [employee, setEmployee] = useState<any>(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/staff/me', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/articles?limit=10', { credentials: 'include' }).then(r => r.json()),
    ]).then(([emp, arts]) => {
      setEmployee(emp)
      setArticles(arts.articles || [])
      setLoading(false)
    })
  }, [])

  const myArticles = articles.filter((a: any) => a.author === employee?.name || a.authorId === employee?._id)
  const fmt = (d: any) => format(new Date(d), 'd MMM yyyy')

  const STATUS_COLORS: Record<string, string> = {
    published: '#1B5E20', draft: '#888', pending_review: '#E65100',
  }

  return (
    <StaffShell employee={employee}>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>
            Welcome, {employee?.name || '...'}
          </h1>
          <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
            Role: {employee?.role} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Permissions */}
        {employee?.permissions && (
          <div style={{ background: 'white', borderRadius: 6, padding: 16, marginBottom: 20, border: '1px solid #E8E8E4' }}>
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, textTransform: 'uppercase', color: '#888', marginBottom: 10 }}>Your Permissions</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(employee.permissions).filter(([, v]) => v).map(([k]) => (
                <span key={k} style={{ background: '#E8F5E9', color: '#1B5E20', padding: '3px 10px', borderRadius: 3, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                  ✓ {k.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {employee?.permissions?.addArticles && (
            <Link href="/staff/articles/new" style={{ background: '#C62828', color: 'white', padding: '10px 20px', borderRadius: 4, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              + Write Article
            </Link>
          )}
          <Link href="/staff/articles" style={{ background: '#0D1B2A', color: 'white', padding: '10px 20px', borderRadius: 4, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            My Articles
          </Link>
        </div>

        {/* Notice */}
        <div style={{ background: '#FFF8E1', border: '1px solid #FFE082', borderRadius: 6, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#E65100' }}>
          ⚠ Articles you submit will be reviewed by the Super Admin before publishing. You cannot publish directly.
        </div>

        {/* Recent Articles */}
        <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8E8E4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#0D1B2A' }}>Recent Articles</h2>
            <Link href="/staff/articles" style={{ fontSize: 11, color: '#C62828', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}>View All →</Link>
          </div>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Loading...</div>
          ) : articles.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>No articles yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8F8F6' }}>
                  {['Title','Category','Status','Date'].map(h => (
                    <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {articles.slice(0, 8).map((a: any) => (
                  <tr key={a._id} style={{ borderTop: '1px solid #F0F0EC' }}>
                    <td style={{ padding: '10px 16px', maxWidth: 300 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0D1B2A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ background: '#F0EFE8', padding: '2px 8px', borderRadius: 2, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#666' }}>{a.category}</span>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ background: STATUS_COLORS[a.status] + '20', color: STATUS_COLORS[a.status], padding: '2px 8px', borderRadius: 2, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
                        {a.status === 'pending_review' ? 'Pending' : a.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 11, color: '#aaa', fontFamily: 'JetBrains Mono, monospace' }}>{fmt(a.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </StaffShell>
  )
}
