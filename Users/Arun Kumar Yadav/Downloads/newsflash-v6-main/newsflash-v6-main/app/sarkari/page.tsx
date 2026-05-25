// @ts-nocheck
import { connectDB } from '../lib/db'
import SarkariJob from '../models/SarkariJob'
import Link from 'next/link'
import { format } from 'date-fns'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Sarkari Naukri 2026 — Latest Government Jobs',
  description: 'Latest Sarkari Naukri 2026 — Railway, SSC, UPSC, Bank, Police, Defence, Teaching jobs. Check eligibility, salary, last date and apply online.',
  keywords: ['sarkari naukri', 'government jobs', 'sarkari result', 'latest jobs 2026', 'SSC', 'UPSC', 'Railway jobs'],
}

const CAT_ICONS: Record<string, string> = {
  Railway: '🚂', SSC: '📋', UPSC: '🏛', Police: '👮', Defence: '🎖',
  Bank: '🏦', Teaching: '📚', State: '🗺', PSU: '🏭', Internship: '💼', Private: '🏢', Other: '📌',
}
const CAT_COLORS: Record<string, string> = {
  Railway: '#1565C0', SSC: '#6A1B9A', UPSC: '#C62828', Police: '#1B5E20',
  Defence: '#0D1B2A', Bank: '#D4A017', Teaching: '#E65100', State: '#2E7D32',
  PSU: '#1565C0', Internship: '#00838F', Private: '#555', Other: '#888',
}

export default async function SarkariPage({ searchParams }: any) {
  await connectDB()
  const category = searchParams?.category || ''
  const state    = searchParams?.state    || ''
  const search   = searchParams?.search   || ''

  const q: any = { isActive: true, isExpired: false }
  if (category) q.category = category
  if (state && state !== 'All India') q.state = { $in: [state, 'All India'] }
  if (search) q.$text = { $search: search }

  const [jobs, featured, counts] = await Promise.all([
    SarkariJob.find(q).sort({ isFeatured: -1, createdAt: -1 }).limit(30).lean(),
    SarkariJob.find({ isActive: true, isExpired: false, isFeatured: true }).sort({ createdAt: -1 }).limit(6).lean(),
    SarkariJob.aggregate([
      { $match: { isActive: true, isExpired: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ])

  const fmt = (d: any) => d ? format(new Date(d), 'd MMM yyyy') : '—'
  const daysLeft = (d: any) => {
    if (!d) return null
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)
    return diff
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#F4F4F0', minHeight: '100vh' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .job-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .job-card { transition: all 0.2s; }
        @media (max-width: 768px) {
          .sarkari-grid { grid-template-columns: 1fr !important; }
          .cat-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .main-pad { padding: 16px 14px !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{ background: '#1B5E20', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>← NewsFlash</Link>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 900, marginTop: 2 }}>
              Sarkari <span style={{ color: '#A5D6A7' }}>Naukri</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Latest Government Jobs 2026</div>
          </div>
          <form action="/sarkari" method="get" style={{ display: 'flex', gap: 8 }}>
            <input name="search" defaultValue={search} placeholder="Search jobs..." style={{ padding: '9px 14px', border: 'none', borderRadius: 4, fontSize: 13, outline: 'none', width: 220 }} />
            <button type="submit" style={{ background: '#C62828', color: 'white', border: 'none', padding: '9px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Search</button>
          </form>
        </div>
      </header>

      {/* Category Nav */}
      <div style={{ background: '#145214', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {[{ label: 'All Jobs', value: '' }, ...Object.keys(CAT_ICONS).map(c => ({ label: c, value: c }))].map(c => (
            <Link key={c.value} href={`/sarkari${c.value ? `?category=${c.value}` : ''}`}
              style={{ padding: '10px 14px', color: category === c.value ? 'white' : 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', borderBottom: category === c.value ? '3px solid #A5D6A7' : '3px solid transparent', flexShrink: 0 }}>
              {CAT_ICONS[c.value] || '📌'} {c.label}
            </Link>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 1200, margin: '0 auto' }} className="main-pad" style={{ padding: '24px 20px' }}>
        {/* Category Stats */}
        {!category && !search && (
          <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 24 }}>
            {counts.slice(0, 12).map((c: any) => (
              <Link key={c._id} href={`/sarkari?category=${c._id}`}
                style={{ background: 'white', borderRadius: 6, padding: '14px 12px', textAlign: 'center', textDecoration: 'none', border: '1px solid #E8E8E4', borderTop: `3px solid ${CAT_COLORS[c._id] || '#888'}` }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{CAT_ICONS[c._id] || '📌'}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0D1B2A' }}>{c._id}</div>
                <div style={{ fontSize: 11, color: '#888', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{c.count} jobs</div>
              </Link>
            ))}
          </div>
        )}

        {/* Featured Jobs */}
        {!category && !search && featured.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#888', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#E65100', color: 'white', padding: '2px 8px', borderRadius: 2, fontSize: 9 }}>FEATURED</span>
              Hot Jobs
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {featured.map((j: any) => {
                const dl = daysLeft(j.importantDates?.lastDate)
                return (
                  <Link key={String(j._id)} href={`/sarkari/${j.slug}`} className="job-card"
                    style={{ background: 'white', borderRadius: 6, padding: 16, textDecoration: 'none', border: '1px solid #E8E8E4', borderLeft: `4px solid ${CAT_COLORS[j.category] || '#888'}`, display: 'block' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <span style={{ background: CAT_COLORS[j.category] || '#888', color: 'white', padding: '2px 8px', borderRadius: 2, fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}>{j.category}</span>
                      {dl !== null && dl >= 0 && <span style={{ background: dl <= 7 ? '#FFEBEE' : '#E8F5E9', color: dl <= 7 ? '#C62828' : '#2E7D32', padding: '2px 8px', borderRadius: 2, fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}>{dl === 0 ? 'Last Day' : `${dl}d left`}</span>}
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0D1B2A', marginBottom: 4, lineHeight: 1.3, fontFamily: 'Playfair Display, serif' }}>{j.title}</h3>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{j.organization}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>
                      {j.totalVacancy > 0 && <span>📋 {j.totalVacancy} posts</span>}
                      {j.salaryText && <span>💰 {j.salaryText}</span>}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 11, color: '#C62828', fontFamily: 'JetBrains Mono, monospace' }}>Last Date: {fmt(j.importantDates?.lastDate)}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* All Jobs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#888' }}>
            {search ? `Results for "${search}"` : category ? `${category} Jobs` : 'Latest Jobs'} — {jobs.length} found
          </div>
          {(search || category) && (
            <Link href="/sarkari" style={{ fontSize: 11, color: '#C62828', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}>Clear Filter ×</Link>
          )}
        </div>

        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 6 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#aaa' }}>No jobs found</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {jobs.map((j: any) => {
              const dl = daysLeft(j.importantDates?.lastDate)
              return (
                <Link key={String(j._id)} href={`/sarkari/${j.slug}`} className="job-card"
                  style={{ background: 'white', borderRadius: 6, padding: '16px 20px', textDecoration: 'none', border: '1px solid #E8E8E4', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, background: CAT_COLORS[j.category] || '#888', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {CAT_ICONS[j.category] || '📌'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ background: CAT_COLORS[j.category] || '#888', color: 'white', padding: '2px 8px', borderRadius: 2, fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}>{j.category}</span>
                      {j.state !== 'All India' && <span style={{ background: '#F0F0EC', color: '#666', padding: '2px 8px', borderRadius: 2, fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}>{j.state}</span>}
                      {j.isFeatured && <span style={{ background: '#FFF8E1', color: '#E65100', padding: '2px 8px', borderRadius: 2, fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}>⭐ FEATURED</span>}
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0D1B2A', marginBottom: 2, fontFamily: 'Playfair Display, serif', lineHeight: 1.3 }}>{j.title}</h3>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>{j.organization}</div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#666', fontFamily: 'JetBrains Mono, monospace', flexWrap: 'wrap' }}>
                      {j.totalVacancy > 0 && <span>📋 {j.totalVacancy.toLocaleString('en-IN')} Vacancies</span>}
                      {j.salaryText && <span>💰 {j.salaryText}</span>}
                      {j.qualification?.length > 0 && <span>🎓 {j.qualification.slice(0, 2).join(', ')}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: '#C62828', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>Last Date</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1B2A', fontFamily: 'JetBrains Mono, monospace' }}>{fmt(j.importantDates?.lastDate)}</div>
                    {dl !== null && dl >= 0 && (
                      <div style={{ marginTop: 4, background: dl <= 7 ? '#FFEBEE' : '#E8F5E9', color: dl <= 7 ? '#C62828' : '#2E7D32', padding: '2px 8px', borderRadius: 2, fontSize: 9, fontFamily: 'JetBrains Mono, monospace', display: 'inline-block' }}>
                        {dl === 0 ? 'Last Day' : `${dl} days left`}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#1B5E20', color: 'rgba(255,255,255,0.6)', marginTop: 48, padding: '20px', textAlign: 'center', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>← Back to NewsFlash</Link>
        <span style={{ margin: '0 12px' }}>·</span>
        © {new Date().getFullYear()} NewsFlash Media
      </footer>
    </div>
  )
}
