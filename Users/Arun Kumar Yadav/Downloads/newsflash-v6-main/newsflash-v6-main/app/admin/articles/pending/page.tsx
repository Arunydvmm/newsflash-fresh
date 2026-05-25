'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import Link from 'next/link'
import { format } from 'date-fns'

export default function PendingArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/articles?status=pending_review&limit=50', { credentials: 'include' })
    const data = await res.json()
    setArticles(data.articles || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function action(id: string, act: 'approve' | 'reject') {
    await fetch(`/api/admin/approve/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: act }),
    })
    load()
  }

  const fmt = (d: any) => format(new Date(d), 'd MMM yyyy, HH:mm')

  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Pending Review</h1>
            <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>Articles submitted by employees awaiting your approval</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Loading...</div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 6, border: '1px solid #E8E8E4' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#aaa' }}>No articles pending review</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {articles.map((a: any) => (
              <div key={a._id} style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', borderLeft: '4px solid #E65100', padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {a.featuredImage && (
                  <img src={a.featuredImage} alt="" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ background: '#F0EFE8', padding: '2px 8px', borderRadius: 2, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#666' }}>{a.category}</span>
                    <span style={{ background: '#FFF3E0', padding: '2px 8px', borderRadius: 2, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#E65100' }}>PENDING</span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0D1B2A', margin: '0 0 4px', fontFamily: 'Playfair Display, serif' }}>{a.title}</h3>
                  <p style={{ fontSize: 12, color: '#888', margin: '0 0 8px', lineHeight: 1.5 }}>{a.summary}</p>
                  <div style={{ fontSize: 11, color: '#aaa', fontFamily: 'JetBrains Mono, monospace' }}>
                    By {a.author || 'Unknown'} · {fmt(a.createdAt)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexDirection: 'column' }}>
                  <Link href={`/admin/articles/${a._id}`} style={{ background: '#F0F0EC', color: '#444', padding: '7px 14px', borderRadius: 4, textDecoration: 'none', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }}>
                    Preview
                  </Link>
                  <button onClick={() => action(a._id, 'approve')}
                    style={{ background: '#1B5E20', color: 'white', padding: '7px 14px', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                    ✓ Approve
                  </button>
                  <button onClick={() => action(a._id, 'reject')}
                    style={{ background: '#C62828', color: 'white', padding: '7px 14px', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
