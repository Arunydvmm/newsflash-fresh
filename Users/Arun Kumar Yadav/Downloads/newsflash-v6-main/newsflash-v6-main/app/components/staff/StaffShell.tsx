'use client'
// @ts-nocheck
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { label: 'Dashboard',    href: '/staff/dashboard', icon: '⊞' },
  { label: 'My Articles',  href: '/staff/articles',  icon: '📄' },
  { label: 'New Article',  href: '/staff/articles/new', icon: '✚' },
]

export default function StaffShell({ children, employee }: { children: React.ReactNode; employee?: any }) {
  const path   = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/staff/logout', { method: 'POST', credentials: 'include' })
    router.push('/staff')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif", background: '#F4F4F0' }}>
      <aside style={{ width: 220, background: '#1B2B3A', color: 'white', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 16px', borderBottom: '1px solid #2C3E50' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 900 }}>NEWS<span style={{ color: '#C62828' }}>FLASH</span></div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: 2, color: '#4A6080', marginTop: 2, textTransform: 'uppercase' }}>Staff Portal</div>
          {employee && (
            <div style={{ marginTop: 10, padding: '8px 10px', background: '#0D1B2A', borderRadius: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{employee.name}</div>
              <div style={{ fontSize: 10, color: '#4A6080', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{employee.role}</div>
            </div>
          )}
        </div>
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', textDecoration: 'none', color: path === item.href ? 'white' : '#4A6080', background: path === item.href ? '#0D1B2A' : 'transparent', borderLeft: path === item.href ? '3px solid #C62828' : '3px solid transparent' }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #2C3E50', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: '#4A6080', textDecoration: 'none' }}>
            🌐 View Site
          </Link>
          <button onClick={logout} style={{ background: 'transparent', border: '1px solid #2C3E50', color: '#4A6080', padding: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, textAlign: 'left' }}>
            ⏻ Logout
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>{children}</main>
    </div>
  )
}
