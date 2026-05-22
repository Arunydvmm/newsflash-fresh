'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    })
    const data = await res.json()
    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      setError(data.error || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#FAFAF8', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter', sans-serif" }}>
      <div style={{ background:'white', border:'1.5px solid #E0DDD5', borderRadius:4, padding:40, width:380 }}>
        <div style={{ fontFamily:'Playfair Display, serif', fontSize:28, fontWeight:900, color:'#1A1A1A', marginBottom:4 }}>
          NEWS<span style={{ color:'#C62828' }}>FLASH</span>
        </div>
        <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:2, color:'#aaa', textTransform:'uppercase', marginBottom:28 }}>Admin Panel · Secure Login</div>

        {error && (
          <div style={{ background:'#FFEBEE', borderLeft:'3px solid #C62828', padding:'10px 12px', fontFamily:'JetBrains Mono, monospace', fontSize:11, color:'#C62828', marginBottom:16, borderRadius:'0 2px 2px 0' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#6B6B6B', marginBottom:6 }}>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="admin"
              style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #E0DDD5', borderRadius:3, fontSize:15, outline:'none', fontFamily:'inherit' }} required />
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ display:'block', fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#6B6B6B', marginBottom:6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #E0DDD5', borderRadius:3, fontSize:15, outline:'none', fontFamily:'inherit' }} required />
          </div>
          <button type="submit" disabled={loading}
            style={{ width:'100%', background:'#1A1A1A', color:'white', border:'none', padding:'12px', fontFamily:'JetBrains Mono, monospace', fontSize:11, letterSpacing:1.5, textTransform:'uppercase', cursor:'pointer', borderRadius:2 }}>
            {loading ? 'Signing in...' : 'Login to Admin Panel'}
          </button>
        </form>
        <div style={{ marginTop:12, fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#aaa', textAlign:'center' }}>
          Default: admin / Admin@123
        </div>
      </div>
    </div>
  )
}
