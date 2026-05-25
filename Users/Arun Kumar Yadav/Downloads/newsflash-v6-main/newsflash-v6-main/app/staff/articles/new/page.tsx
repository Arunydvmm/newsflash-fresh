'use client'
// @ts-nocheck
import StaffShell from '../../../components/staff/StaffShell'
import ArticleForm from '../../../components/admin/ArticleForm'

export default function StaffNewArticlePage() {
  return (
    <StaffShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Write Article</h1>
          <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>Article will be submitted for review before publishing</p>
        </div>
        <ArticleForm isEmployee={true} />
      </div>
    </StaffShell>
  )
}
