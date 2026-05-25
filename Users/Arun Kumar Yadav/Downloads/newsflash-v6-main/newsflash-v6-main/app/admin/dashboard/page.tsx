// @ts-nocheck
import { connectDB } from '../../lib/db'
import Article from '../../models/Article'
import SarkariJob from '../../models/SarkariJob'
import Contact from '../../models/Contact'
import Employee from '../../models/Employee'
import AdminShell from '../../components/admin/AdminShell'
import Link from 'next/link'
import { format } from 'date-fns'

export const revalidate = 30

export default async function DashboardPage() {
  await connectDB()

  const [
    totalArticles, publishedArticles, draftArticles, pendingArticles,
    totalViews, totalJobs, activeJobs, unreadContacts, totalEmployees,
    recentArticles, topArticles, pendingList,
  ] = await Promise.all([
    Article.countDocuments(),
    Article.countDocuments({ status: 'published' }),
    Article.countDocuments({ status: 'draft' }),
    Article.countDocuments({ status: 'pending_review' }),
    Article.aggregate([{ $group: { _id: null, t: { $sum: '$views' } } }]),
    SarkariJob.countDocuments(),
    SarkariJob.countDocuments({ isActive: true, isExpired: false }),
    Contact.countDocuments({ isRead: false }),
    Employee.countDocuments({ isActive: true }),
    Article.find({ status: 'published' }).sort({ createdAt: -1 }).limit(6).select('title slug category views createdAt author').lean(),
    Article.find({ status: 'published' }).sort({ views: -1 }).limit(5).select('title views').lean(),
    Article.find({ status: 'pending_review' }).sort({ createdAt: -1 }).limit(5).select('title category author createdAt _id').lean(),
  ])

  const views = totalViews[0]?.t || 0
  const fmt = (d: any) => format(new Date(d), 'd MMM yyyy')

  const stats = [
    { label: 'Total Articles', value: totalArticles, sub: `${publishedArticles} published`, color: '#0D1B2A', icon: '📄' },
    { label: 'Total Views',    value: views.toLocaleString('en-IN'), sub: 'All time', color: '#C62828', icon: '👁' },
    { label: 'Pending Review', value: pendingArticles, sub: 'Awaiting approval', color: '#E65100', icon: '⏳', href: '/admin/articles/pending' },
    { label: 'Active Jobs',    value: activeJobs, sub: `${totalJobs} total`, color: '#1B5E20', icon: '🏛' },
    { label: 'Unread Messages',value: unreadContacts, sub: 'Contact inbox', color: '#6A1B9A', icon: '✉', href: '/admin/contacts' },
    { label: 'Team Members',   value: totalEmployees, sub: 'Active employees', color: '#1565C0', icon: '👥' },
  ]

  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Dashboard</h1>
          <p style={{ color: '#888', fontSize: 13, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: 6, padding: '18px 20px', border: '1px solid #E8E8E4', borderLeft: `4px solid ${s.color}` }}>
              {s.href ? (
                <Link href={s.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: 'Playfair Display, serif' }}>{s.value}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#444', marginTop: 2 }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{s.sub}</div>
                    </div>
                    <span style={{ fontSize: 22, opacity: 0.6 }}>{s.icon}</span>
                  </div>
                </Link>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: 'Playfair Display, serif' }}>{s.value}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#444', marginTop: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{s.sub}</div>
                  </div>
                  <span style={{ fontSize: 22, opacity: 0.6 }}>{s.icon}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Recent Articles */}
          <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8E8E4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#0D1B2A' }}>Recent Articles</h2>
              <Link href="/admin/articles" style={{ fontSize: 11, color: '#C62828', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}>View All →</Link>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8F8F6' }}>
                  {['Title','Category','Author','Views','Date'].map(h => (
                    <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentArticles.map((a, i) => (
                  <tr key={String(a._id)} style={{ borderTop: '1px solid #F0F0EC' }}>
                    <td style={{ padding: '10px 16px', maxWidth: 260 }}>
                      <Link href={`/admin/articles/${a._id}`} style={{ fontSize: 13, color: '#0D1B2A', textDecoration: 'none', fontWeight: 500, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.title}
                      </Link>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ background: '#F0EFE8', padding: '2px 8px', borderRadius: 2, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#666' }}>{a.category}</span>
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: '#888' }}>{a.author || '—'}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>{(a.views || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 16px', fontSize: 11, color: '#aaa', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>{fmt(a.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Pending Review */}
            {pendingList.length > 0 && (
              <div style={{ background: '#FFF8E1', borderRadius: 6, border: '1px solid #FFE082', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #FFE082', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#E65100' }}>⏳ Pending Review ({pendingArticles})</h3>
                  <Link href="/admin/articles/pending" style={{ fontSize: 10, color: '#E65100', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}>Review →</Link>
                </div>
                {pendingList.map(a => (
                  <div key={String(a._id)} style={{ padding: '10px 16px', borderBottom: '1px solid #FFF3CD' }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#333', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                    <div style={{ fontSize: 10, color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>{a.author} · {fmt(a.createdAt)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Top Articles */}
            <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #E8E8E4' }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#0D1B2A' }}>🔥 Top Articles</h3>
              </div>
              {topArticles.map((a, i) => (
                <div key={String(a._id)} style={{ padding: '10px 16px', borderBottom: '1px solid #F0F0EC', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 900, color: '#E8E8E4', lineHeight: 1, width: 28, flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                    <div style={{ fontSize: 10, color: '#aaa', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{(a.views || 0).toLocaleString('en-IN')} views</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{ background: 'white', borderRadius: 6, border: '1px solid #E8E8E4', padding: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, margin: '0 0 12px', color: '#0D1B2A' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: '+ New Article',    href: '/admin/articles/new',    bg: '#C62828' },
                  { label: '+ New Job',        href: '/admin/sarkari/new',     bg: '#1B5E20' },
                  { label: '+ New Employee',   href: '/admin/employees/new',   bg: '#0D1B2A' },
                  { label: '📬 Contact Inbox', href: '/admin/contacts',        bg: '#6A1B9A' },
                ].map(a => (
                  <Link key={a.href} href={a.href} style={{ background: a.bg, color: 'white', padding: '9px 14px', borderRadius: 4, textDecoration: 'none', fontSize: 12, fontWeight: 600, display: 'block', textAlign: 'center' }}>
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
