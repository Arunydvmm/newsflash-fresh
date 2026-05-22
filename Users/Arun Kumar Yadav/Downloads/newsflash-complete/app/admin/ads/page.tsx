'use client'
import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'

const inp: React.CSSProperties = { width:'100%', padding:'10px 14px', border:'1.5px solid #E0DDD5', borderRadius:3, fontSize:13, outline:'none', fontFamily:'JetBrains Mono, monospace', background:'white', resize:'vertical' as const }

export default function AdsPage() {
  const [slots, setSlots] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/ads').then(r => r.json()).then(setSlots)
  }, [])

  function update(i: number, key: string, val: any) {
    const s = [...slots]; s[i] = { ...s[i], [key]: val }; setSlots(s)
  }

  async function save() {
    setSaving(true)
    const res = await fetch('/api/ads', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(slots), credentials:'include' })
    setMsg(res.ok ? '✓ Ad settings saved!' : 'Save failed')
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <AdminShell>
      <div style={{ background:'white', borderBottom:'1px solid #E0DDD5', padding:'16px 28px' }}>
        <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:22, fontWeight:700 }}>Ad Management</h1>
      </div>
      <div style={{ padding:28, maxWidth:800 }}>
        <p style={{ fontFamily:'JetBrains Mono, monospace', fontSize:11, color:'#aaa', marginBottom:24, letterSpacing:0.5 }}>
          Toggle ad slots on/off and paste your Google AdSense or any ad network script below.
        </p>

        {msg && (
          <div style={{ background:'#E8F5E9', borderLeft:'3px solid #2E7D32', padding:'10px 14px', fontFamily:'JetBrains Mono, monospace', fontSize:11, color:'#2E7D32', marginBottom:20, borderRadius:'0 3px 3px 0' }}>{msg}</div>
        )}

        {slots.map((s, i) => (
          <div key={s.slotId} style={{ background:'white', border:'1.5px solid #E0DDD5', borderRadius:4, padding:20, marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div>
                <div style={{ fontFamily:'Playfair Display, serif', fontSize:17, fontWeight:700, color:'#1A1A1A' }}>{s.name}</div>
                <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#aaa', marginTop:2, letterSpacing:0.5 }}>{s.size} · {s.position}</div>
              </div>
              {/* Toggle */}
              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textTransform:'uppercase', color: s.enabled ? '#2E7D32':'#aaa' }}>{s.enabled ? 'ON':'OFF'}</span>
                <div onClick={() => update(i, 'enabled', !s.enabled)}
                  style={{ width:44, height:24, borderRadius:12, background: s.enabled ? '#1A1A1A':'#ddd', position:'relative', cursor:'pointer', transition:'.2s' }}>
                  <div style={{ position:'absolute', width:18, height:18, borderRadius:'50%', background:'white', top:3, left: s.enabled ? 23:3, transition:'.2s' }} />
                </div>
              </label>
            </div>
            <label style={{ display:'block', fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#6B6B6B', marginBottom:6 }}>Ad Script</label>
            <textarea value={s.script} onChange={e => update(i, 'script', e.target.value)} rows={4}
              placeholder={`Paste your ${s.name} ad code here (Google AdSense, etc.)`}
              style={inp} />
          </div>
        ))}

        {slots.length === 0 && (
          <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:11, color:'#aaa', padding:20, textAlign:'center' }}>Loading ad slots...</div>
        )}

        <button onClick={save} disabled={saving}
          style={{ background:'#1A1A1A', color:'white', border:'none', padding:'12px 24px', fontFamily:'JetBrains Mono, monospace', fontSize:11, letterSpacing:1.5, textTransform:'uppercase', cursor:'pointer', borderRadius:2, marginTop:8 }}>
          {saving ? 'Saving...' : 'Save Ad Settings'}
        </button>
      </div>
    </AdminShell>
  )
}
