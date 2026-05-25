'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import AdminShell from '../../components/admin/AdminShell'
import Link from 'next/link'
import { format } from 'date-fns'

const ROLE_COLORS: Record<string, string> = {
  NewsEditor:      '#1565C0',
  CricketManager:  '#1B5E20',
  SarkariManager:  '#E65100',
  SEOManager:      '#6A1B9A',
  ContentWriter:   '#0D1B2A',
  Moderator:       '#C62828',
  AdManager:       '#D4A017',
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/employees', { credentials: 'include' })
    const data = await res.json()
    setEmployees(data.employees || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleSuspend(id: string, isSuspended: boolean) {
    await fetch(`/api/admin/employees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isSuspended: !isSuspended }),
    })
    load()
  }

  async function deleteEmp(id: string, name: string) {
    if (!confirm(`Delete employee "${name}"? This cannot be undone.`)) return
    await fetch(`/api/admin/employees/${id}`, { method: 'DELETE', credentials: 'include' })
    load()
  }

  const filtered = employees.filter((e: any) =>
    !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.username.toLowerCase().includes(search.toLowerCase())
  )

  const fmt = (d: any) => d ? format(new Date(d), 'd MMM yyyy') : 'Never'

  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Employees</h1>
            <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>{employees.length} team members</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." style={{ padding: '8px 12px', border: '1px solid #E0DDD5', borderRadius: 4, fontSize: 13, outline: 'none', width: 200 }} />
            <Link href="/admin/employees/new" style={{ background: '#C62828', color: 'white', padding: '9px 18px', borderRadius: 4, textDecoration: 'none', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
              + Add Employee
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Loading...</div>
        ) : (
          <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8F8F6' }}>
                  {['Employee','Role','Status','Last Login','Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e: any) => (
                  <tr key={e._id} style={{ borderTop: '1px solid #F0F0EC' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#0D1B2A' }}>{e.name}</div>
                      <div style={{ fontSize: 11, color: '#888', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>@{e.username} · {e.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: ROLE_COLORS[e.role] || '#666', color: 'white', padding: '3px 10px', borderRadius: 3, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
                        {e.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: e.isSuspended ? '#FFEBEE' : '#E8F5E9', color: e.isSuspended ? '#C62828' : '#2E7D32', padding: '3px 10px', borderRadius: 3, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
                        {e.isSuspended ? 'Suspended' : e.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 11, color: '#aaa', fontFamily: 'JetBrains Mono, monospace' }}>{fmt(e.lastLogin)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/admin/employees/${e._id}`} style={{ background: '#F0F0EC', color: '#444', padding: '5px 10px', borderRadius: 3, textDecoration: 'none', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>Edit</Link>
                        <button onClick={() => toggleSuspend(e._id, e.isSuspended)}
                          style={{ background: e.isSuspended ? '#E8F5E9' : '#FFF3E0', color: e.isSuspended ? '#2E7D32' : '#E65100', padding: '5px 10px', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                          {e.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                        <button onClick={() => deleteEmp(e._id, e.name)}
                          style={{ background: '#FFEBEE', color: '#C62828', padding: '5px 10px', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>No employees found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
