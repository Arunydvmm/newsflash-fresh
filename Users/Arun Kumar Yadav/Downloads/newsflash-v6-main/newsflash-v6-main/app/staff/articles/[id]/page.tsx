'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import StaffShell from '../../../components/staff/StaffShell'
import ArticleForm from '../../../components/admin/ArticleForm'

export default function StaffEditArticlePage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/articles/${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setArticle(d); setLoading(false) })
  }, [id])

  return (
    <StaffShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Edit Article</h1>
          <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>Changes will be submitted for review</p>
        </div>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Loading...</div>
        ) : (
          <ArticleForm article={article} isEmployee={true} />
        )}
      </div>
    </StaffShell>
  )
}
