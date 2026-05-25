// @ts-nocheck
import AdminShell from '../../../components/admin/AdminShell'
import ArticleForm from '../../../components/admin/ArticleForm'
import Link from 'next/link'

export default function NewArticlePage() {
  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>New Article</h1>
            <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>Create and publish a new article</p>
          </div>
          <Link href="/admin/articles" style={{ background: '#F0F0EC', color: '#444', padding: '8px 14px', borderRadius: 4, textDecoration: 'none', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
            ← All Articles
          </Link>
        </div>
        <ArticleForm />
      </div>
    </AdminShell>
  )
}
