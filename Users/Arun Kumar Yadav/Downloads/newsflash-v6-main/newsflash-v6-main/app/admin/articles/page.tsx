'use client'
// @ts-nocheck
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '../../components/admin/AdminShell'
import { format } from 'date-fns'

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  published:      { bg: '#E8F5E9', color: '#1B5E20' },
  draft:          { bg: '#F0F0EC', color: '#888' },
  pending_review: { bg: '#FFF3E0', color: '#E65100' },
}

export default function ArticlesListPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage]         = useState(1)
  const [total, setTotal]       = useState(0)

  async function load() {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search)   params.set('search', search)
    if (status)   params.set('status', status)
    if (category) params.set('category', category)
    const res = await fetch(`/api/articles?${params}`, { credentials: 'include' })
    const data = await res.json()
    setArticles(data.articles || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [page, status, category])

  async function deleteArticle(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    await fetch(`/api/articles/${id}`, { method: 'DELETE', credentials: 'include' })
    load()
  }

  async function quickPublish(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    await fetch(`/api/articles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: newStatus }),
    })
    load()
  }

  const fmt = (d: string) => format(new Date(d), 'd MMM yy')

  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        {/* Header */}
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Articles</h1>
            <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>{total} total</p>
          </div>
          <Link href="/admin/articles/new" style={{ background: '#C62828', color: 'white', padding: '9px 18px', borderRadius: 4, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
            + New Article
          </Link>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} placeholder="Search articles..." style={{ padding: '8px 12px', border: '1px solid #E0DDD5', borderRadius: 4, fontSize: 13, outline: 'none', flex: 1, minWidth: 180 }} />
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} style={{ padding: '8px 12px', border: '1px solid #E0DDD5', borderRadius: 4, fontSize: 13, outline: 'none' }}>
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending_review">Pending Review</option>
          </select>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1) }} style={{ padding: '8px 12px', border: '1px solid #E0DDD5', borderRadius: 4, fontSize: 13, outline: 'none' }}>
            <option value="">All Categories</option>
            {['India','World','Business','Technology','Sports','Science','Health','Entertainment','Opinion','Cricket','Sarkari'].map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={load} style={{ background: '#0D1B2A', color: 'white', padding: '8px 16px', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Search</button>
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8F8F6' }}>
                {['Title', 'Category', 'Status', 'Author', 'Views', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Loading...</td></tr>
              ) : articles.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>No articles found</td></tr>
              ) : articles.map((a: any) => (
                <tr key={a._id} style={{ borderTop: '1px solid #F0F0EC' }}>
                  <td style={{ padding: '11px 14px', maxWidth: 260 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0D1B2A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#aaa', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.slug}</div>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ background: '#F0EFE8', padding: '2px 8px', borderRadius: 2, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#666' }}>{a.category}</span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ background: STATUS_STYLES[a.status]?.bg || '#F0F0EC', color: STATUS_STYLES[a.status]?.color || '#888', padding: '2px 8px', borderRadius: 2, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
                      {a.status === 'pending_review' ? 'Pending' : a.status}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: '#888' }}>{a.author || '—'}</td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>{(a.views || 0).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '11px 14px', fontSize: 11, color: '#aaa', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>{fmt(a.createdAt)}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <Link href={`/admin/articles/${a._id}`} style={{ background: '#F0F0EC', color: '#444', padding: '4px 9px', borderRadius: 3, textDecoration: 'none', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>Edit</Link>
                      <Link href={`/article/${a.slug}`} target="_blank" style={{ background: '#E8F5E9', color: '#1B5E20', padding: '4px 9px', borderRadius: 3, textDecoration: 'none', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>View</Link>
                      <button onClick={() => quickPublish(a._id, a.status)} style={{ background: a.status === 'published' ? '#FFF3E0' : '#E8F5E9', color: a.status === 'published' ? '#E65100' : '#1B5E20', padding: '4px 9px', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
                        {a.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => deleteArticle(a._id, a.title)} style={{ background: '#FFEBEE', color: '#C62828', padding: '4px 9px', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {total > 20 && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid #F0F0EC', display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 14px', border: '1px solid #E0DDD5', borderRadius: 3, cursor: 'pointer', fontSize: 12, background: 'white' }}>← Prev</button>
              <span style={{ fontSize: 12, color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>Page {page} of {Math.ceil(total / 20)}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} style={{ padding: '6px 14px', border: '1px solid #E0DDD5', borderRadius: 3, cursor: 'pointer', fontSize: 12, background: 'white' }}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
