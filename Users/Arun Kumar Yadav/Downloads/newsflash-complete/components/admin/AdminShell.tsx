'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { label:'Dashboard',    href:'/admin/dashboard', icon:'⊞' },
  { label:'All Articles', href:'/admin/articles',  icon:'📄' },
  { label:'New Article',  href:'/admin/articles/new', icon:'✚' },
  { label:'Ad Management',href:'/admin/ads',       icon:'📢' },
  { label:'Settings',     href:'/admin/settings',  icon:'⚙' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method:'POST', credentials:'include' })
    router.push('/admin')
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width:240, background:'#1A1A1A', color:'white', flexShrink:0, display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'20px 18px', borderBottom:'1px solid #333' }}>
          <div style={{ fontFamily:'Playfair Display, serif', fontSize:20, fontWeight:900 }}>NEWS<span style={{ color:'#C62828' }}>FLASH</span></div>
          <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, color:'#666', marginTop:2, textTransform:'uppercase' }}>Admin Panel</div>
        </div>
        <nav style={{ flex:1, padding:'8px 0' }}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 18px', fontFamily:'JetBrains Mono, monospace', fontSize:11, letterSpacing:0.8, textTransform:'uppercase', textDecoration:'none',
                color: path === item.href ? 'white' : '#888',
                background: path === item.href ? '#2A2A2A' : 'transparent',
                borderLeft: path === item.href ? '3px solid #C62828' : '3px solid transparent',
              }}>
              <span style={{ opacity: path === item.href ? 1 : 0.5 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding:'12px 18px', borderTop:'1px solid #333', display:'flex', flexDirection:'column', gap:8 }}>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 0', fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'#666', textDecoration:'none' }}>
            ← View Site
          </Link>
          <button onClick={logout} style={{ background:'transparent', border:'1px solid #333', color:'#666', padding:'8px', fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textTransform:'uppercase', cursor:'pointer', borderRadius:2, textAlign:'left' }}>
            ⏻ Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, background:'#FAFAF8', overflow:'auto' }}>
        {children}
      </main>
    </div>
  )
}
