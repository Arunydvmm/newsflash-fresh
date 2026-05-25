'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import StaffShell from '../../components/staff/StaffShell'
import Link from 'next/link'
import { format } from 'date-fns'

export default function StaffArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch('/api/articles?limit=50', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setArticles(d.articles || []); setLoading(false) })
  }, [])

  const fmt = (d: any) => format(new Date(d), 'd MMM yyyy')
  const STATUS_COLORS: Record<string, string> = {
    published: '#1B5E20', draft: '#888', pending_review: '#E65100',
  }

  return (
    <StaffShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>My Articles</h1>
          <Link href="/staff/articles/new" style={{ background: '#C62828', color: 'white', padding: '9px 18px', borderRadius: 4, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>+ New Article</Link>
        </div>

        <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8F8F6' }}>
                {['Title','Category','Status','Views','Date','Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Loading...</td></tr>
              ) : articles.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>No articles yet</td></tr>
              ) : articles.map((a: any) => (
                <tr key={a._id} style={{ borderTop: '1px solid #F0F0EC' }}>
                  <td style={{ padding: '10px 16px', maxWidth: 280 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#0D1B2A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ background: '#F0EFE8', padding: '2px 8px', borderRadius: 2, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#666' }}>{a.category}</span>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ background: STATUS_COLORS[a.status] + '20', color: STATUS_COLORS[a.status], padding: '2px 8px', borderRadius: 2, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
                      {a.status === 'pending_review' ? 'Pending Review' : a.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>{(a.views || 0).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 16px', fontSize: 11, color: '#aaa', fontFamily: 'JetBrains Mono, monospace' }}>{fmt(a.createdAt)}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link href={`/staff/articles/${a._id}`} style={{ background: '#F0F0EC', color: '#444', padding: '5px 10px', borderRadius: 3, textDecoration: 'none', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>Edit</Link>
                      {a.status === 'published' && (
                        <Link href={`/article/${a.slug}`} target="_blank" style={{ background: '#E8F5E9', color: '#1B5E20', padding: '5px 10px', borderRadius: 3, textDecoration: 'none', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>View</Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StaffShell>
  )
}
