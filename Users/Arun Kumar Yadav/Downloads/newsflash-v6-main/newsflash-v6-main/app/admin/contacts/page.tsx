'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import AdminShell from '../../components/admin/AdminShell'
import { format } from 'date-fns'

export default function ContactsPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [page, setPage]         = useState(1)
  const [total, setTotal]       = useState(0)

  async function load(p = 1) {
    setLoading(true)
    const res = await fetch(`/api/contact?page=${p}`, { credentials: 'include' })
    const data = await res.json()
    setMessages(data.messages || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  useEffect(() => { load(page) }, [page])

  async function markRead(id: string) {
    await fetch(`/api/contact/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isRead: true }),
    })
    load(page)
  }

  async function deleteMsg(id: string) {
    if (!confirm('Delete this message?')) return
    await fetch(`/api/contact/${id}`, { method: 'DELETE', credentials: 'include' })
    setSelected(null)
    load(page)
  }

  const fmt = (d: any) => format(new Date(d), 'd MMM yyyy, HH:mm')

  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Contact Inbox</h1>
          <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>{total} messages total</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16, minHeight: 500 }}>
          {/* Message List */}
          <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Loading...</div>
            ) : messages.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>No messages</div>
            ) : (
              messages.map((m: any) => (
                <div key={m._id}
                  onClick={() => { setSelected(m); if (!m.isRead) markRead(m._id) }}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid #F0F0EC',
                    cursor: 'pointer',
                    background: selected?._id === m._id ? '#F0F4FF' : m.isRead ? 'white' : '#FFFDE7',
                    borderLeft: m.isRead ? '3px solid transparent' : '3px solid #D4A017',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ fontWeight: m.isRead ? 500 : 700, fontSize: 13, color: '#0D1B2A' }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: '#aaa', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', marginLeft: 8 }}>{fmt(m.createdAt)}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#555', fontWeight: m.isRead ? 400 : 600, marginBottom: 2 }}>{m.subject}</div>
                  <div style={{ fontSize: 11, color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</div>
                </div>
              ))
            )}
            {/* Pagination */}
            {total > 20 && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid #F0F0EC', display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '5px 12px', border: '1px solid #E0DDD5', borderRadius: 3, cursor: 'pointer', fontSize: 11, background: 'white' }}>← Prev</button>
                <span style={{ fontSize: 11, color: '#888', padding: '5px 8px', fontFamily: 'JetBrains Mono, monospace' }}>Page {page}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} style={{ padding: '5px 12px', border: '1px solid #E0DDD5', borderRadius: 3, cursor: 'pointer', fontSize: 11, background: 'white' }}>Next →</button>
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', padding: 24 }}>
            {!selected ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
                Select a message to read
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#0D1B2A', margin: '0 0 6px' }}>{selected.subject}</h2>
                    <div style={{ fontSize: 12, color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>
                      From: <strong>{selected.name}</strong> · <a href={`mailto:${selected.email}`} style={{ color: '#C62828' }}>{selected.email}</a>
                    </div>
                    <div style={{ fontSize: 11, color: '#aaa', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{fmt(selected.createdAt)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                      style={{ background: '#0D1B2A', color: 'white', padding: '8px 16px', borderRadius: 4, textDecoration: 'none', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                      Reply
                    </a>
                    <button onClick={() => deleteMsg(selected._id)}
                      style={{ background: '#FFEBEE', color: '#C62828', padding: '8px 16px', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ padding: 20, background: '#F8F8F6', borderRadius: 4, border: '1px solid #E0DDD5', lineHeight: 1.8, fontSize: 14, color: '#333', whiteSpace: 'pre-wrap' }}>
                  {selected.message}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
