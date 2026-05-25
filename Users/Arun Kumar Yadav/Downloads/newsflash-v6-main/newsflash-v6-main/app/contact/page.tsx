'use client'
// @ts-nocheck
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  const set = (e: any) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Failed to send message'); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  const inp = { width: '100%', padding: '11px 14px', border: '1.5px solid #E0DDD5', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none', background: 'white', boxSizing: 'border-box' as const }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#FAFAF8', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '3px solid #1A1A1A', padding: '14px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 900, color: '#1A1A1A', textDecoration: 'none' }}>
            NEWS<span style={{ color: '#C62828' }}>FLASH</span>
          </Link>
          <Link href="/" style={{ fontSize: 12, color: '#888', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}>← Back to Home</Link>
        </div>
      </header>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '48px 20px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 700, color: '#1A1A1A', margin: '0 0 8px' }}>Contact Us</h1>
          <p style={{ fontSize: 15, color: '#6B6B6B', lineHeight: 1.7 }}>Have a news tip, feedback, or partnership inquiry? We'd love to hear from you.</p>
        </div>

        {sent ? (
          <div style={{ background: '#E8F5E9', border: '1px solid #C5E1A5', borderRadius: 8, padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#1B5E20', marginBottom: 8 }}>Message Sent!</h2>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              Thank you for reaching out. We've received your message and sent a confirmation to <strong>{form.email}</strong>. We'll get back to you within 24–48 hours.
            </p>
            <Link href="/" style={{ background: '#C62828', color: 'white', padding: '10px 24px', borderRadius: 4, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Back to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} style={{ background: 'white', borderRadius: 8, padding: 32, border: '1px solid #E0DDD5' }}>
            {error && <div style={{ background: '#FFEBEE', color: '#C62828', padding: '10px 14px', borderRadius: 4, marginBottom: 20, fontSize: 13 }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#444', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.5, textTransform: 'uppercase' }}>Name *</label>
                <input name="name" value={form.name} onChange={set} required placeholder="Your full name" style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#444', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.5, textTransform: 'uppercase' }}>Email *</label>
                <input name="email" type="email" value={form.email} onChange={set} required placeholder="your@email.com" style={inp} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#444', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.5, textTransform: 'uppercase' }}>Subject *</label>
              <input name="subject" value={form.subject} onChange={set} required placeholder="What's this about?" style={inp} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#444', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.5, textTransform: 'uppercase' }}>Message *</label>
              <textarea name="message" value={form.message} onChange={set} required placeholder="Your message..." rows={6} style={{ ...inp, resize: 'vertical' }} />
            </div>

            <button type="submit" disabled={loading}
              style={{ background: '#C62828', color: 'white', padding: '12px 28px', border: 'none', borderRadius: 4, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}

        {/* Contact Info */}
        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { icon: '📧', label: 'Email', value: '65arunyadav65@gmail.com', href: 'mailto:65arunyadav65@gmail.com' },
            { icon: '📰', label: 'News Tips', value: 'Submit a news tip', href: 'mailto:65arunyadav65@gmail.com?subject=News Tip' },
          ].map(c => (
            <a key={c.label} href={c.href} style={{ background: 'white', borderRadius: 6, padding: '16px 20px', border: '1px solid #E0DDD5', textDecoration: 'none', display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 24 }}>{c.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: '#888', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: 1 }}>{c.label}</div>
                <div style={{ fontSize: 13, color: '#C62828', marginTop: 2 }}>{c.value}</div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
