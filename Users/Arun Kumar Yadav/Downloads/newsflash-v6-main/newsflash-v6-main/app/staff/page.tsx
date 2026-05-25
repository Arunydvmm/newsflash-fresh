'use client'
// @ts-nocheck
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StaffLoginPage() {
  const router = useRouter()
  const [form, setForm]     = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/staff/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Login failed'); setLoading(false); return }
    router.push('/staff/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 900, color: 'white' }}>
            NEWS<span style={{ color: '#C62828' }}>FLASH</span>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, color: '#4A6080', marginTop: 4, textTransform: 'uppercase' }}>
            Staff Portal
          </div>
        </div>

        <form onSubmit={submit} style={{ background: '#1B2B3A', borderRadius: 8, padding: 28, border: '1px solid #2C3E50' }}>
          <h2 style={{ color: 'white', fontSize: 18, fontWeight: 600, marginBottom: 20, margin: '0 0 20px' }}>Sign In</h2>
          {error && <div style={{ background: '#3D1515', color: '#FF8A80', padding: '10px 14px', borderRadius: 4, marginBottom: 16, fontSize: 13 }}>{error}</div>}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, color: '#4A6080', textTransform: 'uppercase' }}>Username</label>
            <input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required autoComplete="username"
              style={{ width: '100%', padding: '10px 12px', background: '#0D1B2A', border: '1px solid #2C3E50', borderRadius: 4, color: 'white', fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, color: '#4A6080', textTransform: 'uppercase' }}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required autoComplete="current-password"
              style={{ width: '100%', padding: '10px 12px', background: '#0D1B2A', border: '1px solid #2C3E50', borderRadius: 4, color: 'white', fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#C62828', color: 'white', padding: '12px', border: 'none', borderRadius: 4, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#4A6080', fontFamily: 'JetBrains Mono, monospace' }}>
          Contact your admin if you forgot your password
        </div>
      </div>
    </div>
  )
}
