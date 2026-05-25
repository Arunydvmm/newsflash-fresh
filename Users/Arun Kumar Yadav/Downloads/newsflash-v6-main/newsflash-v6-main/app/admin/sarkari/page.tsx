'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import AdminShell from '../../components/admin/AdminShell'
import Link from 'next/link'
import { format } from 'date-fns'

const CAT_COLORS: Record<string, string> = {
  Railway: '#1565C0', SSC: '#6A1B9A', UPSC: '#C62828', Police: '#1B5E20',
  Defence: '#0D1B2A', Bank: '#D4A017', Teaching: '#E65100', State: '#2E7D32',
  PSU: '#1565C0', Internship: '#00838F', Private: '#555', Other: '#888',
}

export default function SarkariAdminPage() {
  const [jobs, setJobs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cat, setCat]       = useState('')
  const [page, setPage]     = useState(1)
  const [total, setTotal]   = useState(0)

  async function load() {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)
    if (cat)    params.set('category', cat)
    const res = await fetch(`/api/sarkari?${params}&expired=1`, { credentials: 'include' })
    const data = await res.json()
    setJobs(data.jobs || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [page, cat])

  async function deleteJob(id: string) {
    if (!confirm('Delete this job?')) return
    await fetch(`/api/sarkari/${id}`, { method: 'DELETE', credentials: 'include' })
    load()
  }

  async function toggleFeatured(id: string, isFeatured: boolean) {
    await fetch(`/api/sarkari/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isFeatured: !isFeatured }),
    })
    load()
  }

  const fmt = (d: any) => d ? format(new Date(d), 'd MMM yyyy') : '—'

  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Sarkari Naukri</h1>
            <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>{total} jobs total</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} placeholder="Search jobs..." style={{ padding: '8px 12px', border: '1px solid #E0DDD5', borderRadius: 4, fontSize: 13, outline: 'none', width: 180 }} />
            <select value={cat} onChange={e => { setCat(e.target.value); setPage(1) }} style={{ padding: '8px 12px', border: '1px solid #E0DDD5', borderRadius: 4, fontSize: 13, outline: 'none' }}>
              <option value="">All Categories</option>
              {Object.keys(CAT_COLORS).map(c => <option key={c}>{c}</option>)}
            </select>
            <Link href="/admin/sarkari/new" style={{ background: '#1B5E20', color: 'white', padding: '9px 18px', borderRadius: 4, textDecoration: 'none', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
              + Add Job
            </Link>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8F8F6' }}>
                {['Job Title','Category','Vacancy','Last Date','Status','Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Loading...</td></tr>
              ) : jobs.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>No jobs found</td></tr>
              ) : jobs.map((j: any) => (
                <tr key={j._id} style={{ borderTop: '1px solid #F0F0EC' }}>
                  <td style={{ padding: '12px 16px', maxWidth: 280 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0D1B2A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.title}</div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{j.organization}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: CAT_COLORS[j.category] || '#666', color: 'white', padding: '3px 10px', borderRadius: 3, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>{j.category}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#444', fontFamily: 'JetBrains Mono, monospace' }}>{j.totalVacancy || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: j.isExpired ? '#C62828' : '#444', fontFamily: 'JetBrains Mono, monospace' }}>{fmt(j.importantDates?.lastDate)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: j.isExpired ? '#FFEBEE' : j.isFeatured ? '#FFF8E1' : '#E8F5E9', color: j.isExpired ? '#C62828' : j.isFeatured ? '#E65100' : '#2E7D32', padding: '3px 10px', borderRadius: 3, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
                      {j.isExpired ? 'Expired' : j.isFeatured ? 'Featured' : 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link href={`/admin/sarkari/${j._id}`} style={{ background: '#F0F0EC', color: '#444', padding: '5px 10px', borderRadius: 3, textDecoration: 'none', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>Edit</Link>
                      <button onClick={() => toggleFeatured(j._id, j.isFeatured)} style={{ background: '#FFF8E1', color: '#E65100', padding: '5px 10px', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                        {j.isFeatured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button onClick={() => deleteJob(j._id)} style={{ background: '#FFEBEE', color: '#C62828', padding: '5px 10px', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {total > 20 && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid #F0F0EC', display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 14px', border: '1px solid #E0DDD5', borderRadius: 3, cursor: 'pointer', fontSize: 12, background: 'white' }}>← Prev</button>
              <span style={{ fontSize: 12, color: '#888', padding: '6px 10px', fontFamily: 'JetBrains Mono, monospace' }}>Page {page} of {Math.ceil(total / 20)}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} style={{ padding: '6px 14px', border: '1px solid #E0DDD5', borderRadius: 3, cursor: 'pointer', fontSize: 12, background: 'white' }}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
