'use client'
// @ts-nocheck
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminShell from '../../../components/admin/AdminShell'
import ArticleForm from '../../../components/admin/ArticleForm'
import Link from 'next/link'

export default function EditArticlePage() {
  const { id } = useParams()
  const [article, setArticle]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/articles/${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (!data || data.error) setNotFound(true)
        else setArticle(data)
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [id])

  if (loading) return (
    <AdminShell>
      <div style={{ padding: 60, textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', color: '#aaa', fontSize: 12 }}>Loading...</div>
    </AdminShell>
  )

  if (notFound) return (
    <AdminShell>
      <div style={{ padding: 60, textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
        <div style={{ color: '#aaa', fontSize: 12, marginBottom: 16 }}>Article not found</div>
        <Link href="/admin/articles" style={{ color: '#C62828', fontSize: 12 }}>← Back to Articles</Link>
      </div>
    </AdminShell>
  )

  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Edit Article</h1>
            <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>{article?.title}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {article?.slug && (
              <Link href={`/article/${article.slug}`} target="_blank" style={{ background: '#F0F0EC', color: '#444', padding: '8px 14px', borderRadius: 4, textDecoration: 'none', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                View Live ↗
              </Link>
            )}
            <Link href="/admin/articles" style={{ background: '#F0F0EC', color: '#444', padding: '8px 14px', borderRadius: 4, textDecoration: 'none', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
              ← All Articles
            </Link>
          </div>
        </div>
        <ArticleForm article={article} />
      </div>
    </AdminShell>
  )
}
