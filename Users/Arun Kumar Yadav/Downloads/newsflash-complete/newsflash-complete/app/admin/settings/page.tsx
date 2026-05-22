'use client'
import { useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'

const inp: React.CSSProperties = { width:'100%', padding:'10px 14px', border:'1.5px solid #E0DDD5', borderRadius:3, fontSize:15, outline:'none', fontFamily:'inherit', background:'white' }
const lbl: React.CSSProperties = { display:'block', fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#6B6B6B', marginBottom:6 }

export default function SettingsPage() {
  const [msg, setMsg]         = useState('')
  const [curPwd, setCurPwd]   = useState('')
  const [newPwd, setNewPwd]   = useState('')
  const [confPwd, setConfPwd] = useState('')

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPwd !== confPwd) { setMsg('❌ Passwords do not match'); return }
    if (newPwd.length < 6)  { setMsg('❌ Password must be at least 6 characters'); return }
    const res = await fetch('/api/auth/change-password', {
      method:'POST', headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ currentPassword: curPwd, newPassword: newPwd }),
      credentials:'include',
    })
    const data = await res.json()
    setMsg(res.ok ? '✓ Password changed successfully!' : (data.error || '❌ Failed'))
    if (res.ok) { setCurPwd(''); setNewPwd(''); setConfPwd('') }
  }

  return (
    <AdminShell>
      <div style={{ background:'white', borderBottom:'1px solid #E0DDD5', padding:'16px 28px' }}>
        <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:22, fontWeight:700 }}>Settings</h1>
      </div>
      <div style={{ padding:28, maxWidth:520 }}>

        {msg && (
          <div style={{ background: msg.startsWith('✓') ? '#E8F5E9':'#FFEBEE', borderLeft:`3px solid ${msg.startsWith('✓')?'#2E7D32':'#C62828'}`, padding:'10px 14px', fontFamily:'JetBrains Mono, monospace', fontSize:11, color: msg.startsWith('✓')?'#2E7D32':'#C62828', marginBottom:20, borderRadius:'0 3px 3px 0' }}>
            {msg}
          </div>
        )}

        {/* Admin info */}
        <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#aaa', marginBottom:16, paddingBottom:8, borderBottom:'2px solid #1A1A1A' }}>Account Info</div>
        <div style={{ background:'white', border:'1.5px solid #E0DDD5', borderRadius:4, padding:18, marginBottom:28 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[['Username','admin (cannot change)'],['Role','SuperAdmin'],['Email','admin@newsflash.in'],['Last Login','See MongoDB']].map(([k,v]) => (
              <div key={k}>
                <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#aaa', marginBottom:3 }}>{k}</div>
                <div style={{ fontSize:14, color:'#1A1A1A' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Change Password */}
        <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#aaa', marginBottom:16, paddingBottom:8, borderBottom:'2px solid #1A1A1A' }}>Change Password</div>
        <form onSubmit={changePassword}>
          <div style={{ marginBottom:16 }}>
            <label style={lbl}>Current Password</label>
            <input type="password" value={curPwd} onChange={e => setCurPwd(e.target.value)} required style={inp} placeholder="••••••••" />
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={lbl}>New Password</label>
            <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} required style={inp} placeholder="••••••••" />
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={lbl}>Confirm New Password</label>
            <input type="password" value={confPwd} onChange={e => setConfPwd(e.target.value)} required style={inp} placeholder="••••••••" />
          </div>
          <button type="submit"
            style={{ background:'#1A1A1A', color:'white', border:'none', padding:'12px 24px', fontFamily:'JetBrains Mono, monospace', fontSize:11, letterSpacing:1.5, textTransform:'uppercase', cursor:'pointer', borderRadius:2 }}>
            Update Password
          </button>
        </form>
      </div>
    </AdminShell>
  )
}
