// @ts-nocheck
import { connectDB } from '../../lib/db'
import SarkariJob from '../../models/SarkariJob'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 300

export async function generateMetadata({ params }: any): Promise<Metadata> {
  await connectDB()
  const job = await SarkariJob.findOne({ slug: params.slug }).lean()
  if (!job) return { title: 'Job Not Found' }
  return {
    title: `${job.title} — ${job.organization} | Sarkari Naukri`,
    description: `${job.title} recruitment 2026. Total vacancies: ${job.totalVacancy}. Last date: ${job.importantDates?.lastDate ? format(new Date(job.importantDates.lastDate), 'd MMM yyyy') : 'Check notification'}. Apply online at NewsFlash.`,
    keywords: [job.title, job.organization, job.category, 'sarkari naukri', 'government job 2026'],
  }
}

const CAT_COLORS: Record<string, string> = {
  Railway: '#1565C0', SSC: '#6A1B9A', UPSC: '#C62828', Police: '#1B5E20',
  Defence: '#0D1B2A', Bank: '#D4A017', Teaching: '#E65100', State: '#2E7D32',
  PSU: '#1565C0', Internship: '#00838F', Private: '#555', Other: '#888',
}

export default async function SarkariJobPage({ params }: any) {
  await connectDB()
  const job = await SarkariJob.findOne({ slug: params.slug }).lean()
  if (!job) notFound()

  // Increment views
  SarkariJob.findByIdAndUpdate(job._id, { $inc: { views: 1 } }).exec()

  const fmt = (d: any) => d ? format(new Date(d), 'd MMM yyyy') : '—'
  const daysLeft = job.importantDates?.lastDate
    ? Math.ceil((new Date(job.importantDates.lastDate).getTime() - Date.now()) / 86400000)
    : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    hiringOrganization: { '@type': 'Organization', name: job.organization },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: 'IN', addressRegion: job.state } },
    validThrough: job.importantDates?.lastDate,
    datePosted: job.createdAt,
    employmentType: 'FULL_TIME',
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#F4F4F0', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header style={{ background: '#1B5E20', color: 'white', padding: '14px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>NewsFlash</Link>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
          <Link href="/sarkari" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Sarkari Naukri</Link>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
          <span style={{ color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</span>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
          {/* Main Content */}
          <div>
            {/* Job Header */}
            <div style={{ background: 'white', borderRadius: 8, padding: 24, marginBottom: 16, border: '1px solid #E8E8E4', borderTop: `4px solid ${CAT_COLORS[job.category] || '#888'}` }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{ background: CAT_COLORS[job.category] || '#888', color: 'white', padding: '3px 10px', borderRadius: 3, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>{job.category}</span>
                {job.state !== 'All India' && <span style={{ background: '#F0F0EC', color: '#666', padding: '3px 10px', borderRadius: 3, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>{job.state}</span>}
                {job.isExpired && <span style={{ background: '#FFEBEE', color: '#C62828', padding: '3px 10px', borderRadius: 3, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>EXPIRED</span>}
              </div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#0D1B2A', marginBottom: 6, lineHeight: 1.3 }}>{job.title}</h1>
              <div style={{ fontSize: 15, color: '#555', marginBottom: 16 }}>{job.organization}</div>

              {/* Key Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                {[
                  { label: 'Total Vacancies', value: job.totalVacancy > 0 ? job.totalVacancy.toLocaleString('en-IN') : 'Various', icon: '📋' },
                  { label: 'Salary', value: job.salaryText || 'As per norms', icon: '💰' },
                  { label: 'Age Limit', value: `${job.ageMin}–${job.ageMax} years`, icon: '🎂' },
                  { label: 'Application Fee', value: job.applicationFee, icon: '💳' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#F8F8F6', borderRadius: 6, padding: '12px 14px', border: '1px solid #E8E8E4' }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1B2A' }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: '#888', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Dates */}
            <div style={{ background: 'white', borderRadius: 8, padding: 20, marginBottom: 16, border: '1px solid #E8E8E4' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#0D1B2A', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #1B5E20' }}>📅 Important Dates</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    { label: 'Notification Date', value: fmt(job.importantDates?.notificationDate) },
                    { label: 'Application Start Date', value: fmt(job.importantDates?.startDate) },
                    { label: 'Last Date to Apply', value: fmt(job.importantDates?.lastDate), highlight: true },
                    { label: 'Exam Date', value: fmt(job.importantDates?.examDate) },
                    { label: 'Result Date', value: fmt(job.importantDates?.resultDate) },
                  ].map(r => (
                    <tr key={r.label} style={{ borderBottom: '1px solid #F0F0EC' }}>
                      <td style={{ padding: '10px 0', fontSize: 13, color: '#555', width: '50%' }}>{r.label}</td>
                      <td style={{ padding: '10px 0', fontSize: 13, fontWeight: r.highlight ? 700 : 500, color: r.highlight ? '#C62828' : '#0D1B2A' }}>{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Description */}
            <div style={{ background: 'white', borderRadius: 8, padding: 20, marginBottom: 16, border: '1px solid #E8E8E4' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#0D1B2A', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #1B5E20' }}>📌 About This Recruitment</h2>
              <div style={{ fontSize: 14, color: '#444', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.description}</div>
            </div>

            {/* Eligibility */}
            {job.eligibility && (
              <div style={{ background: 'white', borderRadius: 8, padding: 20, marginBottom: 16, border: '1px solid #E8E8E4' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#0D1B2A', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #1B5E20' }}>✅ Eligibility Criteria</h2>
                <div style={{ fontSize: 14, color: '#444', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.eligibility}</div>
              </div>
            )}

            {/* Qualification */}
            {job.qualification?.length > 0 && (
              <div style={{ background: 'white', borderRadius: 8, padding: 20, marginBottom: 16, border: '1px solid #E8E8E4' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#0D1B2A', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #1B5E20' }}>🎓 Educational Qualification</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {job.qualification.map((q: string) => (
                    <span key={q} style={{ background: '#E8F5E9', color: '#1B5E20', padding: '5px 12px', borderRadius: 4, fontSize: 13, fontWeight: 500 }}>{q}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Selection Process */}
            {job.selectionProcess?.length > 0 && (
              <div style={{ background: 'white', borderRadius: 8, padding: 20, marginBottom: 16, border: '1px solid #E8E8E4' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#0D1B2A', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #1B5E20' }}>📊 Selection Process</h2>
                <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
                  {job.selectionProcess.map((s: string, i: number) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ background: '#1B5E20', color: 'white', padding: '8px 16px', borderRadius: 4, fontSize: 13, fontWeight: 500 }}>{i + 1}. {s}</div>
                      {i < job.selectionProcess.length - 1 && <span style={{ color: '#1B5E20', margin: '0 4px', fontSize: 18 }}>→</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to Apply */}
            {job.howToApply && (
              <div style={{ background: 'white', borderRadius: 8, padding: 20, marginBottom: 16, border: '1px solid #E8E8E4' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#0D1B2A', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #1B5E20' }}>📝 How to Apply</h2>
                <div style={{ fontSize: 14, color: '#444', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.howToApply}</div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Apply Box */}
            <div style={{ background: '#1B5E20', color: 'white', borderRadius: 8, padding: 20, marginBottom: 16, position: 'sticky', top: 20 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Apply Now</h3>
              {daysLeft !== null && (
                <div style={{ background: daysLeft <= 7 ? '#C62828' : 'rgba(255,255,255,0.1)', borderRadius: 4, padding: '8px 12px', marginBottom: 12, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }}>
                  {daysLeft < 0 ? '⚠ Application Closed' : daysLeft === 0 ? '⚡ Last Day to Apply' : `⏰ ${daysLeft} days remaining`}
                </div>
              )}
              {job.applyLink && !job.isExpired && (
                <a href={job.applyLink} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: 'white', color: '#1B5E20', padding: '12px', borderRadius: 4, textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
                  Apply Online →
                </a>
              )}
              {job.notificationPdf && (
                <a href={job.notificationPdf} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: 4, textAlign: 'center', textDecoration: 'none', fontSize: 13, marginBottom: 10 }}>
                  📄 Download Notification PDF
                </a>
              )}
              {job.officialWebsite && (
                <a href={job.officialWebsite} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: 4, textAlign: 'center', textDecoration: 'none', fontSize: 13 }}>
                  🌐 Official Website
                </a>
              )}
            </div>

            {/* Share */}
            <div style={{ background: 'white', borderRadius: 8, padding: 16, border: '1px solid #E8E8E4' }}>
              <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Share</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: 'WhatsApp', color: '#25D366', href: `https://wa.me/?text=${encodeURIComponent(`${job.title} — ${job.organization}\nLast Date: ${fmt(job.importantDates?.lastDate)}\n${process.env.NEXT_PUBLIC_SITE_URL}/sarkari/${job.slug}`)}` },
                  { label: 'Twitter', color: '#1DA1F2', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${job.title} — Apply before ${fmt(job.importantDates?.lastDate)}`)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/sarkari/${job.slug}`)}` },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, background: s.color, color: 'white', padding: '8px', borderRadius: 4, textAlign: 'center', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
