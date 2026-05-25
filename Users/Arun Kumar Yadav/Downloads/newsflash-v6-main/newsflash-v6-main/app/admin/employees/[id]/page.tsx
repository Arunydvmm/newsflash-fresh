'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminShell from '../../../components/admin/AdminShell'

const ROLES = ['NewsEditor','CricketManager','SarkariManager','SEOManager','ContentWriter','Moderator','AdManager']
const PERMISSIONS = [
  { key: 'addArticles',      label: 'Add Articles' },
  { key: 'editOwnArticles',  label: 'Edit Own Articles' },
  { key: 'editAllArticles',  label: 'Edit All Articles' },
  { key: 'deleteArticles',   label: 'Delete Articles' },
  { key: 'publishArticles',  label: 'Publish Articles' },
  { key: 'manageJobs',       label: 'Manage Jobs' },
  { key: 'manageCricket',    label: 'Manage Cricket' },
  { key: 'manageAds',        label: 'Manage Ads' },
  { key: 'viewAnalytics',    label: 'View Analytics' },
  { key: 'manageSettings',   label: 'Manage Settings' },
]

const inp = { width: '100%', padding: '9px 12px', border: '1px solid #E0DDD5', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: 13, outline: 'none' }
const lbl = { display: 'block', marginBottom: 5, fontSize: 11, fontWeight: 600, color: '#444', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.5, textTransform: 'uppercase' as const }

export default function EditEmployeePage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', role: 'ContentWriter', isActive: true, isSuspended: false })
  const [perms, setPerms] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch(`/api/admin/employees/${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        setForm({ name: d.name, username: d.username, email: d.email, password: '', role: d.role, isActive: d.isActive, isSuspended: d.isSuspended })
        setPerms(d.permissions || {})
        setFetching(false)
      })
  }, [id])

  const set = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }
  const togglePerm = (key: string) => setPerms(p => ({ ...p, [key]: !p[key] }))

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const payload: any = { name: form.name, email: form.email, role: form.role, isActive: form.isActive, isSuspended: form.isSuspended, permissions: perms }
    if (form.password) payload.password = form.password
    const res = await fetch(`/api/admin/employees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Failed'); setLoading(false); return }
    setSuccess('Employee updated!')
    setLoading(false)
  }

  if (fetching) return <AdminShell><div style={{ padding: 60, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Loading...</div></AdminShell>

  return (
    <AdminShell>
      <div style={{ padding: 28, maxWidth: 700 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Edit Employee</h1>
          <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>@{form.username}</p>
        </div>

        <form onSubmit={submit} style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', padding: 24 }}>
          {error   && <div style={{ background: '#FFEBEE', color: '#C62828', padding: '10px 14px', borderRadius: 4, marginBottom: 16, fontSize: 13 }}>{error}</div>}
          {success && <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '10px 14px', borderRadius: 4, marginBottom: 16, fontSize: 13 }}>{success}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div><label style={lbl}>Full Name</label><input name="name" value={form.name} onChange={set} required style={inp} /></div>
            <div><label style={lbl}>Email</label><input name="email" type="email" value={form.email} onChange={set} required style={inp} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={lbl}>New Password <span style={{ color: '#aaa', fontWeight: 400 }}>(leave blank to keep)</span></label>
              <input name="password" type="password" value={form.password} onChange={set} minLength={8} placeholder="••••••••" style={inp} />
            </div>
            <div><label style={lbl}>Role</label>
              <select name="role" value={form.role} onChange={set} style={inp}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={set} /> Active
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" name="isSuspended" checked={form.isSuspended} onChange={set} /> Suspended
            </label>
          </div>

          <div style={{ marginBottom: 20, padding: 16, background: '#F8F8F6', borderRadius: 4, border: '1px solid #E0DDD5' }}>
            <label style={{ ...lbl, marginBottom: 12 }}>Permissions</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {PERMISSIONS.map(p => (
                <label key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, padding: '4px 0' }}>
                  <input type="checkbox" checked={!!perms[p.key]} onChange={() => togglePerm(p.key)} />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" disabled={loading} style={{ background: '#C62828', color: 'white', padding: '10px 24px', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => router.back()} style={{ background: 'white', color: '#888', padding: '10px 20px', border: '1px solid #E0DDD5', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}
