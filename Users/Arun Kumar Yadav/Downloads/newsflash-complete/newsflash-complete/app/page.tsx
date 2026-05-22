import Link from 'next/link'
import { connectDB } from '@/lib/db'
import Article from '@/models/Article'
import { format } from 'date-fns'

export const revalidate = 60

export default async function HomePage() {
  await connectDB()
  const articles = await Article.find({ status: 'published' })
    .sort({ createdAt: -1 }).limit(12).lean()

  const hero     = articles[0]
  const featured = articles.slice(1, 4)
  const rest     = articles.slice(4, 10)
  const trending = [...articles].sort((a: any, b: any) => b.views - a.views).slice(0, 5)

  const fmt = (d: any) => format(new Date(d), 'd MMM yyyy')

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── TOP BAR ── */}
      <div style={{ background: '#1A1A1A', color: '#999', fontSize: 11, padding: '6px 20px', display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace' }}>
        <span>{new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })} · IST</span>
        <div style={{ display:'flex', gap:16 }}>
          {['India','World','Business','Tech','Sports'].map(c => (
            <Link key={c} href={`/?category=${c}`} style={{ color:'#999', textDecoration:'none' }}>{c}</Link>
          ))}
        </div>
      </div>

      {/* ── HEADER ── */}
      <header style={{ background:'white', borderBottom:'3px solid #1A1A1A', padding:'0 20px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 0 12px' }}>
          <Link href="/" style={{ fontFamily:'Playfair Display, serif', fontSize:38, fontWeight:900, color:'#1A1A1A', textDecoration:'none', letterSpacing:-1 }}>
            NEWS<span style={{ color:'#C62828' }}>FLASH</span>
          </Link>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <form action="/" method="get" style={{ display:'flex', border:'1.5px solid #E0DDD5', borderRadius:3, overflow:'hidden' }}>
              <input name="search" placeholder="Search articles..." style={{ border:'none', background:'#FAFAF8', padding:'7px 12px', fontSize:13, width:180, outline:'none' }} />
              <button type="submit" style={{ background:'#1A1A1A', color:'white', border:'none', padding:'7px 12px', cursor:'pointer', fontSize:13 }}>🔍</button>
            </form>
            <Link href="/admin" style={{ background:'#C62828', color:'white', padding:'8px 16px', fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textDecoration:'none', borderRadius:2, textTransform:'uppercase' }}>
              ⚙ Admin
            </Link>
          </div>
        </div>
        {/* Leaderboard Ad */}
        <div style={{ paddingBottom:10 }}>
          <div style={{ background:'#F0EFE8', border:'1px dashed #E0DDD5', height:60, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#bbb', letterSpacing:2, textTransform:'uppercase' }}>
            728 × 90 — Leaderboard Ad
          </div>
        </div>
      </header>

      {/* ── NAV ── */}
      <nav style={{ background:'white', borderBottom:'1px solid #E0DDD5' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', overflowX:'auto' }}>
          {['India','World','Business','Technology','Sports','Science','Health','Entertainment','Opinion'].map(c => (
            <Link key={c} href={`/?category=${c}`} style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textTransform:'uppercase', padding:'10px 16px', color:'#6B6B6B', textDecoration:'none', whiteSpace:'nowrap', borderBottom:'3px solid transparent' }}>
              {c}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── BREAKING TICKER ── */}
      <div style={{ background:'#C62828', color:'white', display:'flex', overflow:'hidden', alignItems:'center' }}>
        <div style={{ background:'#7B1919', fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', padding:'8px 14px', whiteSpace:'nowrap', flexShrink:0 }}>
          ⚡ Breaking
        </div>
        <div style={{ overflow:'hidden', flex:1 }}>
          <div className="ticker-anim" style={{ display:'flex', gap:40, whiteSpace:'nowrap', padding:'8px 20px', fontSize:13 }}>
            {[...Array(2)].flatMap(() => [
              'RBI holds repo rate steady · MPC votes 4-2',
              '•',
              'India GDP grows 7.8% in Q4, beats all forecasts',
              '•',
              'Parliament passes Digital Data Protection Act',
              '•',
              'ISRO Chandrayaan-4 enters final assembly phase',
              '•',
            ]).map((t, i) => <span key={i} style={{ opacity: t==='•' ? 0.4 : 1 }}>{t}</span>)}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth:1200, margin:'0 auto', padding:'24px 20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:24 }}>

          {/* LEFT COLUMN */}
          <div>
            {/* HERO */}
            {hero && (
              <Link href={`/article/${hero.slug}`} style={{ textDecoration:'none', color:'inherit', display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, paddingBottom:20, marginBottom:20, borderBottom:'2px solid #1A1A1A' }}>
                <div style={{ aspectRatio:'16/9', background:'linear-gradient(135deg,#D0CCC0,#AEA89C)', borderRadius:3, overflow:'hidden', position:'relative' }}>
                  {hero.featuredImage && <img src={hero.featuredImage} alt={hero.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
                </div>
                <div>
                  <span style={{ display:'inline-block', background:'#C62828', color:'white', fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', padding:'2px 8px', marginBottom:8 }}>{(hero as any).category}</span>
                  <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:28, fontWeight:700, lineHeight:1.2, color:'#1A1A1A', marginBottom:10 }}>{hero.title}</h1>
                  <p style={{ fontSize:14, color:'#6B6B6B', lineHeight:1.7, marginBottom:12 }}>{(hero as any).summary}</p>
                  <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#aaa' }}>{(hero as any).author} · {fmt((hero as any).createdAt)} · {(hero as any).readTime} min read</div>
                </div>
              </Link>
            )}

            {/* FEATURED 3 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:24, paddingBottom:24, borderBottom:'1px solid #E0DDD5' }}>
              {featured.map((a: any) => (
                <Link key={String(a._id)} href={`/article/${a.slug}`} style={{ textDecoration:'none', color:'inherit' }}>
                  <div style={{ aspectRatio:'16/10', background:'linear-gradient(135deg,#CCC8BE,#B8B2A6)', borderRadius:2, marginBottom:10, overflow:'hidden' }}>
                    {a.featuredImage && <img src={a.featuredImage} alt={a.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
                  </div>
                  <span style={{ display:'inline-block', background:'#C62828', color:'white', fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', padding:'2px 8px', marginBottom:6 }}>{a.category}</span>
                  <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:16, fontWeight:700, lineHeight:1.3, color:'#1A1A1A', marginBottom:6 }}>{a.title}</h3>
                  <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#aaa' }}>{fmt(a.createdAt)} · {a.readTime} min</div>
                </Link>
              ))}
            </div>

            {/* MORE ARTICLES */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
              {rest.map((a: any) => (
                <Link key={String(a._id)} href={`/article/${a.slug}`} style={{ textDecoration:'none', color:'inherit', borderTop:'1px solid #E0DDD5', paddingTop:12 }}>
                  <div style={{ aspectRatio:'16/10', background:'linear-gradient(135deg,#CCC8BE,#B8B2A6)', borderRadius:2, marginBottom:8, overflow:'hidden' }}>
                    {a.featuredImage && <img src={a.featuredImage} alt={a.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
                  </div>
                  <span style={{ display:'inline-block', background:'#C62828', color:'white', fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', padding:'2px 8px', marginBottom:6 }}>{a.category}</span>
                  <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:15, fontWeight:700, lineHeight:1.3, color:'#1A1A1A' }}>{a.title}</h3>
                </Link>
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <aside>
            <div style={{ background:'#F0EFE8', border:'1px dashed #E0DDD5', height:250, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#bbb', textTransform:'uppercase', letterSpacing:2, marginBottom:24 }}>
              300 × 250 — Sidebar Ad
            </div>
            <div>
              <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'#6B6B6B', borderBottom:'2px solid #1A1A1A', paddingBottom:6, marginBottom:12 }}>
                Trending Now
              </div>
              {trending.map((a: any, i: number) => (
                <Link key={String(a._id)} href={`/article/${a.slug}`} style={{ display:'flex', gap:10, padding:'10px 0', borderBottom:'1px solid #E0DDD5', textDecoration:'none', color:'inherit' }}>
                  <span style={{ fontFamily:'Playfair Display, serif', fontSize:28, fontWeight:900, color:'#E0DDD5', lineHeight:1, width:32, flexShrink:0 }}>{i+1}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, lineHeight:1.4, color:'#1A1A1A' }}>{a.title}</div>
                    <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#aaa', marginTop:3 }}>{a.views?.toLocaleString('en-IN')} reads</div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#1A1A1A', color:'#888', marginTop:48 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 20px', display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:32 }}>
          <div>
            <div style={{ fontFamily:'Playfair Display, serif', fontSize:26, fontWeight:900, color:'white', marginBottom:8 }}>NEWS<span style={{ color:'#C62828' }}>FLASH</span></div>
            <p style={{ fontSize:13, lineHeight:1.7 }}>India's most trusted digital newsroom — delivering breaking stories with accuracy and integrity.</p>
          </div>
          {[['Sections',['India','World','Business','Technology','Sports']],['Company',['About Us','Advertise','Contact','Privacy Policy']],['Follow',['𝕏 Twitter','Facebook','Instagram','YouTube']]].map(([title, links]: any) => (
            <div key={title}>
              <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'white', marginBottom:10 }}>{title}</div>
              {links.map((l: string) => <div key={l} style={{ fontSize:12, paddingBottom:4 }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'16px 20px', borderTop:'1px solid #333', fontFamily:'JetBrains Mono, monospace', fontSize:9, color:'#555', display:'flex', justifyContent:'space-between' }}>
          <span>© {new Date().getFullYear()} NewsFlash Media Pvt. Ltd.</span>
          <span>Privacy Policy · Terms of Use</span>
        </div>
      </footer>
    </div>
  )
}
