'use client'
// @ts-nocheck
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const NAV_GROUPS = [
  {
    label: 'Content',
    items: [
      { label: 'Dashboard',      href: '/admin/dashboard',       icon: '⊞' },
      { label: 'All Articles',   href: '/admin/articles',        icon: '📄' },
      { label: 'New Article',    href: '/admin/articles/new',    icon: '✚' },
      { label: 'Pending Review', href: '/admin/articles/pending',icon: '⏳' },
    ],
  },
  {
    label: 'Portals',
    items: [
      { label: 'Sarkari Naukri', href: '/admin/sarkari',         icon: '🏛' },
      { label: 'Cricket',        href: '/admin/cricket',         icon: '🏏' },
    ],
  },
  {
    label: 'Team',
    items: [
      { label: 'Employees',      href: '/admin/employees',       icon: '👥' },
      { label: 'Contact Inbox',  href: '/admin/contacts',        icon: '✉' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Ad Management',  href: '/admin/ads',             icon: '📢' },
      { label: 'Analytics',      href: '/admin/analytics',       icon: '📊' },
      { label: 'Settings',       href: '/admin/settings',        icon: '⚙' },
    ],
  },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path   = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    router.push('/admin')
  }

  const isActive = (href: string) => path === href || (href !== '/admin/dashboard' && path.startsWith(href))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif", background: '#F4F4F0' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 60 : 240,
        background: '#0D1B2A',
        color: 'white',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '18px 0' : '18px 16px', borderBottom: '1px solid #1B2B3A', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 900 }}>
                NEWS<span style={{ color: '#C62828' }}>FLASH</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: 2, color: '#4A6080', marginTop: 2, textTransform: 'uppercase' }}>
                Super Admin
              </div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: '#4A6080', cursor: 'pointer', fontSize: 16, padding: 4 }}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              {!collapsed && (
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: 2, color: '#2C3E50', textTransform: 'uppercase', padding: '12px 16px 4px' }}>
                  {group.label}
                </div>
              )}
              {group.items.map(item => (
                <Link key={item.href} href={item.href}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: collapsed ? '11px 0' : '10px 16px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 10,
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: isActive(item.href) ? 'white' : '#4A6080',
                    background: isActive(item.href) ? '#1B2B3A' : 'transparent',
                    borderLeft: isActive(item.href) ? '3px solid #C62828' : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  {!collapsed && item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: collapsed ? '12px 0' : '12px 16px', borderTop: '1px solid #1B2B3A', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Link href="/" target="_blank"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: collapsed ? '8px 0' : '8px 0', justifyContent: collapsed ? 'center' : 'flex-start', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: '#4A6080', textDecoration: 'none' }}>
            <span>🌐</span>{!collapsed && 'View Site'}
          </Link>
          <button onClick={logout}
            style={{ background: 'transparent', border: '1px solid #1B2B3A', color: '#4A6080', padding: collapsed ? '8px 0' : '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 8, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <span>⏻</span>{!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
