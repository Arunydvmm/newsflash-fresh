import { redirect, notFound } from 'next/navigation'
import { getAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Article from '@/models/Article'
import AdminShell from '@/components/admin/AdminShell'
import ArticleForm from '@/components/admin/ArticleForm'

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const auth = getAuth()
  if (!auth) redirect('/admin')

  await connectDB()
  const article = await Article.findById(params.id).lean() as any
  if (!article) notFound()

  const safe = JSON.parse(JSON.stringify(article))

  return (
    <AdminShell>
      <div style={{ background:'white', borderBottom:'1px solid #E0DDD5', padding:'16px 28px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:22, fontWeight:700 }}>Edit Article</h1>
        <div style={{ display:'flex', gap:10 }}>
          <a href={`/article/${safe.slug}`} target="_blank"
            style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, color:'#6B6B6B', textDecoration:'none', border:'1.5px solid #E0DDD5', padding:'7px 14px', borderRadius:2, textTransform:'uppercase' }}>
            View Live ↗
          </a>
          <a href="/admin/articles"
            style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, color:'#6B6B6B', textDecoration:'none', border:'1.5px solid #E0DDD5', padding:'7px 14px', borderRadius:2, textTransform:'uppercase' }}>
            ← All Articles
          </a>
        </div>
      </div>
      <ArticleForm initial={safe} articleId={params.id} />
    </AdminShell>
  )
}
