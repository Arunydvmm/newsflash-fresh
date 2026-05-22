import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Article from '@/models/Article'
import AdminShell from '@/components/admin/AdminShell'
import { format } from 'date-fns'

export default async function ArticlesListPage() {
  const auth = getAuth()
  if (!auth) redirect('/admin')

  await connectDB()
  const articles = await Article.find({}).sort({ createdAt:-1 }).lean() as any[]

  return (
    <AdminShell>
      <div style={{ background:'white', borderBottom:'1px solid #E0DDD5', padding:'16px 28px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:22, fontWeight:700 }}>All Articles ({articles.length})</h1>
        <Link href="/admin/articles/new" style={{ background:'#C62828', color:'white', padding:'9px 18px', fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textDecoration:'none', borderRadius:2, textTransform:'uppercase' }}>
          + New Article
        </Link>
      </div>
      <div style={{ padding:28 }}>
        <table style={{ width:'100%', borderCollapse:'collapse', background:'white', border:'1.5px solid #E0DDD5', borderRadius:4, overflow:'hidden' }}>
          <thead>
            <tr>
              {['Title','Category','Status','Views','Date','Actions'].map(h => (
                <th key={h} style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#aaa', padding:'10px 14px', textAlign:'left', borderBottom:'1px solid #E0DDD5', background:'#FAFAF8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {articles.map((a: any) => (
              <tr key={String(a._id)} style={{ borderBottom:'1px solid #E0DDD5' }}>
                <td style={{ padding:'12px 14px', fontWeight:600, fontSize:13 }}>
                  <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:260 }}>{a.title}</div>
                  <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#aaa', marginTop:2 }}>{a.slug}</div>
                </td>
                <td style={{ padding:'12px 14px' }}>
                  <span style={{ background:'#C62828', color:'white', fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:1, textTransform:'uppercase', padding:'2px 7px' }}>{a.category}</span>
                </td>
                <td style={{ padding:'12px 14px' }}>
                  <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:1, textTransform:'uppercase', padding:'3px 8px', borderRadius:2, background: a.status==='published' ? '#E8F5E9':'#F0EFE8', color: a.status==='published' ? '#2E7D32':'#888' }}>{a.status}</span>
                </td>
                <td style={{ padding:'12px 14px', fontFamily:'JetBrains Mono, monospace', fontSize:11 }}>{(a.views||0).toLocaleString('en-IN')}</td>
                <td style={{ padding:'12px 14px', fontFamily:'JetBrains Mono, monospace', fontSize:11, color:'#aaa' }}>{format(new Date(a.createdAt),'d MMM yy')}</td>
                <td style={{ padding:'12px 14px' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    <Link href={`/admin/articles/${String(a._id)}`}
                      style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:0.5, textTransform:'uppercase', padding:'5px 10px', border:'1.5px solid #E0DDD5', color:'#6B6B6B', textDecoration:'none', borderRadius:2 }}>
                      Edit
                    </Link>
                    <Link href={`/article/${a.slug}`} target="_blank"
                      style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:0.5, textTransform:'uppercase', padding:'5px 10px', border:'1.5px solid #E0DDD5', color:'#6B6B6B', textDecoration:'none', borderRadius:2 }}>
                      View
                    </Link>
                    <DeleteButton id={String(a._id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}

function DeleteButton({ id }: { id: string }) {
  return (
    <form action={`/api/articles/${id}/delete`} method="POST" style={{ display:'inline' }}>
      <button type="submit"
        onClick={e => { if (!confirm('Delete this article?')) e.preventDefault() }}
        style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:0.5, textTransform:'uppercase', padding:'5px 10px', border:'1.5px solid #E0DDD5', background:'transparent', color:'#C62828', cursor:'pointer', borderRadius:2 }}>
        Delete
      </button>
    </form>
  )
}
