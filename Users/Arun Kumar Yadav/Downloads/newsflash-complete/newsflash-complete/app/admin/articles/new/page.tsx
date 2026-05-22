import { redirect } from 'next/navigation'
import { getAuth } from '@/lib/auth'
import AdminShell from '@/components/admin/AdminShell'
import ArticleForm from '@/components/admin/ArticleForm'

export default function NewArticlePage() {
  const auth = getAuth()
  if (!auth) redirect('/admin')

  return (
    <AdminShell>
      <div style={{ background:'white', borderBottom:'1px solid #E0DDD5', padding:'16px 28px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:22, fontWeight:700 }}>New Article</h1>
        <a href="/admin/articles" style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, color:'#6B6B6B', textDecoration:'none', border:'1.5px solid #E0DDD5', padding:'7px 14px', borderRadius:2, textTransform:'uppercase' }}>
          ← All Articles
        </a>
      </div>
      <ArticleForm />
    </AdminShell>
  )
}
