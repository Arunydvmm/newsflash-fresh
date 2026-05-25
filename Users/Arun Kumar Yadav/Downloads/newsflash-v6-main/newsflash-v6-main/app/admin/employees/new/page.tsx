'use client'
// @ts-nocheck
import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

const DEFAULT_PERMS: Record<string, Record<string, boolean>> = {
  NewsEditor:      { addArticles: true, editOwnArticles: true, editAllArticles: true },
  CricketManager:  { addArticles: true, editOwnArticles: true, manageCricket: true },
  SarkariManager:  { addArticles: true, editOwnArticles: true, manageJobs: true },
  SEOManager:      { editAllArticles: true, viewAnalytics: true, manageSettings: true },
  ContentWriter:   { addArticles: true, editOwnArticles: true },
  Moderator:       { editAllArticles: true, viewAnalytics: true },
  AdManager:       { manageAds: true, viewAnalytics: true },
}

const inp = { width: '100%', padding: '9px 12px', border: '1px solid #E0DDD5', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: 13, outline: 'none' }
const lbl = { display: 'block', marginBottom: 5, fontSize: 11, fontWeight: 600, color: '#444', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.5, textTransform: 'uppercase' as const }

export default function NewEmployeePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', role: 'ContentWriter' })
  const [perms, setPerms] = useState<Record<string, boolean>>(DEFAULT_PERMS['ContentWriter'] || {})

  const set = (e: any) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (name === 'role') setPerms(DEFAULT_PERMS[value] || {})
  }

  const togglePerm = (key: string) => setPerms(p => ({ ...p, [key]: !p[key] }))

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...form, permissions: perms }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Failed'); setLoading(false); return }
    router.push('/admin/employees')
  }

  return (
    <AdminShell>
      <div style={{ padding: 28, maxWidth: 700 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Add Employee</h1>
          <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>Create a new team member account</p>
        </div>

        <form onSubmit={submit} style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', padding: 24 }}>
          {error && <div style={{ background: '#FFEBEE', color: '#C62828', padding: '10px 14px', borderRadius: 4, marginBottom: 16, fontSize: 13 }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div><label style={lbl}>Full Name *</label><input name="name" value={form.name} onChange={set} required style={inp} /></div>
            <div><label style={lbl}>Username *</label><input name="username" value={form.username} onChange={set} required style={inp} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div><label style={lbl}>Email *</label><input name="email" type="email" value={form.email} onChange={set} required style={inp} /></div>
            <div><label style={lbl}>Password *</label><input name="password" type="password" value={form.password} onChange={set} required minLength={8} style={inp} /></div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Role *</label>
            <select name="role" value={form.role} onChange={set} style={inp}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          {/* Permissions */}
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
              {loading ? 'Creating...' : 'Create Employee'}
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
