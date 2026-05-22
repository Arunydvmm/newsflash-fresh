import { redirect } from 'next/navigation'
import { getAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Article from '@/models/Article'
import AdminShell from '@/components/admin/AdminShell'
import { format } from 'date-fns'

export default async function DashboardPage() {
  const auth = getAuth()
  if (!auth) redirect('/admin')

  await connectDB()
  const [total, published, drafts, recentRaw] = await Promise.all([
    Article.countDocuments({}),
    Article.countDocuments({ status:'published' }),
    Article.countDocuments({ status:'draft' }),
    Article.find({}).sort({ createdAt:-1 }).limit(8).lean(),
  ])
  const totalViews = recentRaw.reduce((s: number, a: any) => s + (a.views || 0), 0)

  return (
    <AdminShell>
      <div style={{ background:'white', borderBottom:'1px solid #E0DDD5', padding:'16px 28px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:22, fontWeight:700 }}>Dashboard</h1>
        <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#aaa' }}>Welcome back, {auth.username}</span>
      </div>
      <div style={{ padding:28 }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:28 }}>
          {[
            { val: total,     label:'Total Articles', change:'' },
            { val: published, label:'Published',      change:'' },
            { val: drafts,    label:'Drafts',         change:'' },
            { val: totalViews.toLocaleString('en-IN'), label:'Total Views', change:'' },
          ].map(s => (
            <div key={s.label} style={{ background:'white', border:'1.5px solid #E0DDD5', borderRadius:4, padding:'16px 18px' }}>
              <div style={{ fontFamily:'Playfair Display, serif', fontSize:32, fontWeight:700, color:'#1A1A1A', lineHeight:1 }}>{s.val}</div>
              <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, color:'#aaa', textTransform:'uppercase', marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Articles */}
        <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'#aaa', marginBottom:14 }}>Recent Articles</div>
        <table style={{ width:'100%', borderCollapse:'collapse', background:'white', border:'1.5px solid #E0DDD5', borderRadius:4, overflow:'hidden' }}>
          <thead>
            <tr>
              {['Title','Category','Status','Views','Date'].map(h => (
                <th key={h} style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#aaa', padding:'10px 14px', textAlign:'left', borderBottom:'1px solid #E0DDD5', background:'#FAFAF8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentRaw.map((a: any) => (
              <tr key={String(a._id)} style={{ borderBottom:'1px solid #E0DDD5' }}>
                <td style={{ padding:'12px 14px', fontWeight:600, fontSize:13, maxWidth:300 }}><div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:280 }}>{a.title}</div></td>
                <td style={{ padding:'12px 14px' }}>
                  <span style={{ background:'#C62828', color:'white', fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:1, textTransform:'uppercase', padding:'2px 7px' }}>{a.category}</span>
                </td>
                <td style={{ padding:'12px 14px' }}>
                  <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:1, textTransform:'uppercase', padding:'3px 8px', borderRadius:2, background: a.status==='published' ? '#E8F5E9':'#F0EFE8', color: a.status==='published' ? '#2E7D32':'#888' }}>{a.status}</span>
                </td>
                <td style={{ padding:'12px 14px', fontFamily:'JetBrains Mono, monospace', fontSize:11 }}>{(a.views||0).toLocaleString('en-IN')}</td>
                <td style={{ padding:'12px 14px', fontFamily:'JetBrains Mono, monospace', fontSize:11, color:'#aaa' }}>{format(new Date(a.createdAt),'d MMM yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop:16 }}>
          <a href="/admin/articles/new" style={{ display:'inline-block', background:'#1A1A1A', color:'white', padding:'10px 20px', fontFamily:'JetBrains Mono, monospace', fontSize:11, letterSpacing:1.5, textTransform:'uppercase', textDecoration:'none', borderRadius:2 }}>
            + New Article
          </a>
        </div>
      </div>
    </AdminShell>
  )
}
