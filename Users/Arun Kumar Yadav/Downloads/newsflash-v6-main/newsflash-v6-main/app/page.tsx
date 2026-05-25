// @ts-nocheck
import Link from 'next/link'
import { connectDB } from './lib/db'
import Article from './models/Article'
import { format } from 'date-fns'

export const revalidate = 60

export default async function HomePage({ searchParams }) {
  await connectDB()

  const category = searchParams?.category || ''
  const search   = searchParams?.search   || ''

  const query: any = { status: 'published' }
  if (category) query.category = category
  if (search)   query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { summary: { $regex: search, $options: 'i' } },
    { tags: { $regex: search, $options: 'i' } },
  ]

  const articles = await Article.find(query).sort({ createdAt: -1 }).limit(12).lean()
  const allPublished = await Article.find({ status: 'published' }).sort({ createdAt: -1 }).limit(20).lean()

  const hero     = articles[0]
  const featured = articles.slice(1, 4)
  const rest     = articles.slice(4, 10)
  const trending = [...allPublished].sort((a, b) => (b.views||0) - (a.views||0)).slice(0, 5)

  // Ticker from real article titles (fallback to static if none)
  const tickerItems = allPublished.length > 0
    ? allPublished.slice(0, 6).map(a => a.title)
    : ['Welcome to NewsFlash — India\'s Digital Newsroom', 'Breaking news updated 24/7', 'Stay informed with the latest stories']

  const fmt = (d) => format(new Date(d), 'd MMM yyyy')

  return (
    <div style={{ fontFamily:"'Inter', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .topbar-cats { display: flex; gap: 16px; }
        .header-inner { display: flex; align-items: center; justify-content: space-between; padding: 14px 0 10px; gap: 10px; flex-wrap: wrap; }
        .search-form { display: flex; border: 1.5px solid #E0DDD5; border-radius: 3px; overflow: hidden; }
        .search-input { border: none; background: #FAFAF8; padding: 7px 12px; font-size: 13px; width: 160px; outline: none; }
        .nav-scroll { display: flex; overflow-x: auto; scrollbar-width: none; }
        .nav-scroll::-webkit-scrollbar { display: none; }
        .ticker-wrap { display: flex; overflow: hidden; align-items: center; }
        .ticker-anim { animation: ticker 40s linear infinite; display: flex; gap: 48px; white-space: nowrap; padding: 8px 20px; font-size: 13px; }
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .main-grid { display: grid; grid-template-columns: 1fr 300px; gap: 24px; }
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding-bottom: 20px; margin-bottom: 20px; border-bottom: 2px solid #1A1A1A; }
        .featured-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #E0DDD5; }
        .rest-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 32px; }
        .footer-link { font-size: 12px; padding-bottom: 6px; color: #888; text-decoration: none; display: block; transition: color 0.2s; }
        .footer-link:hover { color: #C62828; }
        .ad-leaderboard { background: #F0EFE8; border: 1px dashed #E0DDD5; height: 60px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #bbb; letter-spacing: 2px; text-transform: uppercase; }
        .ad-sidebar { background: #F0EFE8; border: 1px dashed #E0DDD5; height: 250px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #bbb; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px; }
        .cat-badge { display: inline-block; background: #C62828; color: white; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; padding: 2px 8px; margin-bottom: 6px; }
        .meta { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #aaa; }
        .art-card:hover h3 { color: #C62828; }
        .art-card h3 { transition: color 0.2s; }
        @media (max-width: 768px) {
          .topbar-cats { display: none; }
          .topbar { font-size: 10px; padding: 5px 14px !important; }
          .logo { font-size: 26px !important; }
          .search-input { width: 100px; font-size: 12px; }
          .header-inner { padding: 10px 0 8px; }
          .ad-leaderboard { height: 50px; font-size: 9px; }
          .main-grid { grid-template-columns: 1fr !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .featured-grid { grid-template-columns: 1fr 1fr !important; }
          .rest-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
          .sidebar-col { display: none; }
          .hero-h1 { font-size: 22px !important; }
          .hero-summary { font-size: 13px !important; }
          .main-pad { padding: 16px 14px !important; }
          .header-pad { padding: 0 14px !important; }
          .footer-inner { padding: 24px 14px !important; }
          .footer-bottom { padding: 12px 14px !important; flex-direction: column !important; gap: 6px; text-align: center; }
        }
        @media (max-width: 480px) {
          .featured-grid { grid-template-columns: 1fr !important; }
          .rest-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .search-input { width: 80px; }
        }
      `}</style>

      {/* TOP BAR */}
      <div className="topbar" style={{ background:'#1A1A1A', color:'#999', fontSize:11, padding:'6px 20px', display:'flex', justifyContent:'space-between', fontFamily:'JetBrains Mono, monospace' }}>
        <span>{new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })} · IST</span>
        <div className="topbar-cats">
          {['India','World','Business','Tech','Sports'].map(c => (
            <Link key={c} href={`/?category=${c}`} style={{ color:'#999', textDecoration:'none' }}>{c}</Link>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <header style={{ background:'white', borderBottom:'3px solid #1A1A1A' }} className="header-pad">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div className="header-inner">
            <Link href="/" className="logo" style={{ fontFamily:'Playfair Display, serif', fontSize:38, fontWeight:900, color:'#1A1A1A', textDecoration:'none', letterSpacing:-1 }}>
              NEWS<span style={{ color:'#C62828' }}>FLASH</span>
            </Link>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <form action="/" method="get" className="search-form">
                <input name="search" defaultValue={search} placeholder="Search..." className="search-input" />
                <button type="submit" style={{ background:'#1A1A1A', color:'white', border:'none', padding:'7px 12px', cursor:'pointer', fontSize:13 }}>🔍</button>
              </form>
              <Link href="/admin" style={{ background:'#C62828', color:'white', padding:'8px 14px', fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textDecoration:'none', borderRadius:2, textTransform:'uppercase', whiteSpace:'nowrap' }}>
                ⚙ Admin
              </Link>
            </div>
          </div>
          <div style={{ paddingBottom:10 }}>
            <div className="ad-leaderboard">728 × 90 — Leaderboard Ad</div>
          </div>
        </div>
      </header>

      {/* NAV */}
      <nav style={{ background:'white', borderBottom:'1px solid #E0DDD5' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div className="nav-scroll">
            {['India','World','Business','Technology','Sports','Science','Health','Entertainment','Opinion'].map(c => (
              <Link key={c} href={`/?category=${c}`} style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textTransform:'uppercase', padding:'10px 14px', color: category===c ? '#C62828' : '#6B6B6B', textDecoration:'none', whiteSpace:'nowrap', borderBottom: category===c ? '3px solid #C62828' : '3px solid transparent', flexShrink:0 }}>
                {c}
              </Link>
            ))}
            <Link href="/cricket" style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textTransform:'uppercase', padding:'10px 14px', color:'#1B5E20', textDecoration:'none', whiteSpace:'nowrap', borderBottom:'3px solid transparent', flexShrink:0, fontWeight:700 }}>
              🏏 Cricket Live
            </Link>
            <Link href="/sarkari" style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textTransform:'uppercase', padding:'10px 14px', color:'#E65100', textDecoration:'none', whiteSpace:'nowrap', borderBottom:'3px solid transparent', flexShrink:0, fontWeight:700 }}>
              🏛 Sarkari Naukri
            </Link>
          </div>
        </div>
      </nav>

      {/* BREAKING TICKER — real articles */}
      <div className="ticker-wrap" style={{ background:'#C62828', color:'white' }}>
        <div style={{ background:'#7B1919', fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', padding:'8px 14px', whiteSpace:'nowrap', flexShrink:0 }}>
          ⚡ Breaking
        </div>
        <div style={{ overflow:'hidden', flex:1 }}>
          <div className="ticker-anim">
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i}>{t}{i < tickerItems.length * 2 - 1 ? <span style={{ opacity:0.4, margin:'0 20px' }}>·</span> : null}</span>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH RESULTS HEADER */}
      {(search || category) && (
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'16px 20px 0', fontFamily:'JetBrains Mono, monospace', fontSize:11, color:'#6B6B6B' }}>
          {search && <span>Search results for "<strong>{search}</strong>" — {articles.length} found · <Link href="/" style={{ color:'#C62828' }}>Clear</Link></span>}
          {category && !search && <span>Category: <strong>{category}</strong> — {articles.length} articles · <Link href="/" style={{ color:'#C62828' }}>All</Link></span>}
        </div>
      )}

      {/* MAIN */}
      <main style={{ maxWidth:1200, margin:'0 auto' }} className="main-pad">
        {articles.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px', fontFamily:'JetBrains Mono, monospace', color:'#aaa' }}>
            <div style={{ fontSize:40, marginBottom:16 }}>📰</div>
            <div style={{ fontSize:13, letterSpacing:1 }}>No articles found{search ? ` for "${search}"` : ''}.</div>
            <Link href="/" style={{ display:'inline-block', marginTop:16, color:'#C62828', fontSize:11 }}>← Back to Home</Link>
          </div>
        ) : (
          <div className="main-grid" style={{ paddingTop:24 }}>
            {/* LEFT */}
            <div>
              {hero && (
                <Link href={`/article/${hero.slug}`} className="hero-grid art-card" style={{ textDecoration:'none', color:'inherit', display:'grid' }}>
                  <div style={{ aspectRatio:'16/9', background:'linear-gradient(135deg,#D0CCC0,#AEA89C)', borderRadius:3, overflow:'hidden' }}>
                    {hero.featuredImage && <img src={hero.featuredImage} alt={hero.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" />}
                  </div>
                  <div>
                    <span className="cat-badge">{hero.category}</span>
                    <h1 className="hero-h1" style={{ fontFamily:'Playfair Display, serif', fontSize:28, fontWeight:700, lineHeight:1.2, color:'#1A1A1A', marginBottom:10, marginTop:4 }}>{hero.title}</h1>
                    <p className="hero-summary" style={{ fontSize:14, color:'#6B6B6B', lineHeight:1.7, marginBottom:12 }}>{hero.summary}</p>
                    <div className="meta">{hero.author || 'NewsFlash'} · {fmt(hero.createdAt)} · {hero.readTime || 1} min read</div>
                  </div>
                </Link>
              )}

              {featured.length > 0 && (
                <div className="featured-grid">
                  {featured.map((a) => (
                    <Link key={String(a._id)} href={`/article/${a.slug}`} style={{ textDecoration:'none', color:'inherit' }} className="art-card">
                      <div style={{ aspectRatio:'16/10', background:'linear-gradient(135deg,#CCC8BE,#B8B2A6)', borderRadius:2, marginBottom:10, overflow:'hidden' }}>
                        {a.featuredImage && <img src={a.featuredImage} alt={a.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" />}
                      </div>
                      <span className="cat-badge">{a.category}</span>
                      <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:16, fontWeight:700, lineHeight:1.3, color:'#1A1A1A', marginBottom:6 }}>{a.title}</h3>
                      <div className="meta">{fmt(a.createdAt)} · {a.readTime || 1} min</div>
                    </Link>
                  ))}
                </div>
              )}

              {rest.length > 0 && (
                <div className="rest-grid">
                  {rest.map((a) => (
                    <Link key={String(a._id)} href={`/article/${a.slug}`} style={{ textDecoration:'none', color:'inherit', borderTop:'1px solid #E0DDD5', paddingTop:12 }} className="art-card">
                      <div style={{ aspectRatio:'16/10', background:'linear-gradient(135deg,#CCC8BE,#B8B2A6)', borderRadius:2, marginBottom:8, overflow:'hidden' }}>
                        {a.featuredImage && <img src={a.featuredImage} alt={a.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" />}
                      </div>
                      <span className="cat-badge">{a.category}</span>
                      <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:15, fontWeight:700, lineHeight:1.3, color:'#1A1A1A' }}>{a.title}</h3>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <aside className="sidebar-col">
              <div className="ad-sidebar">300 × 250 — Sidebar Ad</div>
              {trending.length > 0 && (
                <div>
                  <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'#6B6B6B', borderBottom:'2px solid #1A1A1A', paddingBottom:6, marginBottom:12 }}>Trending Now</div>
                  {trending.map((a, i) => (
                    <Link key={String(a._id)} href={`/article/${a.slug}`} style={{ display:'flex', gap:10, padding:'10px 0', borderBottom:'1px solid #E0DDD5', textDecoration:'none', color:'inherit' }}>
                      <span style={{ fontFamily:'Playfair Display, serif', fontSize:28, fontWeight:900, color:'#E0DDD5', lineHeight:1, width:32, flexShrink:0 }}>{i+1}</span>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, lineHeight:1.4, color:'#1A1A1A' }}>{a.title}</div>
                        <div className="meta" style={{ marginTop:3 }}>{(a.views||0).toLocaleString('en-IN')} reads</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </aside>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ background:'#1A1A1A', color:'#888', marginTop:48 }}>
        <div className="footer-inner" style={{ maxWidth:1200, margin:'0 auto', padding:'32px 20px' }}>
          <div className="footer-grid">
            <div>
              <div style={{ fontFamily:'Playfair Display, serif', fontSize:26, fontWeight:900, color:'white', marginBottom:8 }}>NEWS<span style={{ color:'#C62828' }}>FLASH</span></div>
              <p style={{ fontSize:13, lineHeight:1.7, marginBottom:12 }}>India's trusted digital newsroom — delivering breaking stories with accuracy and integrity. Content is sourced from reputable online sources and enhanced using AI.</p>
              <a href="mailto:65arunyadav65@gmail.com" style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#555', textDecoration:'none' }}>📧 65arunyadav65@gmail.com</a>
            </div>
            <div>
              <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'white', marginBottom:10 }}>Sections</div>
              {['India','World','Business','Technology','Sports','Science','Health'].map(c => (
                <Link key={c} href={`/?category=${c}`} className="footer-link">{c}</Link>
              ))}
              <Link href="/cricket" className="footer-link">🏏 Cricket Live</Link>
              <Link href="/sarkari" className="footer-link">🏛 Sarkari Naukri</Link>
            </div>
            <div>
              <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'white', marginBottom:10 }}>Company</div>
              <Link href="/about" className="footer-link">About Us</Link>
              <Link href="/contact" className="footer-link">Contact Us</Link>
              <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
              <Link href="/terms" className="footer-link">Terms of Service</Link>
            </div>
            <div>
              <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'white', marginBottom:10 }}>More</div>
              <Link href="/sitemap.xml" className="footer-link">Sitemap</Link>
              <a href="mailto:65arunyadav65@gmail.com" className="footer-link">Advertise</a>
              <a href="mailto:65arunyadav65@gmail.com?subject=News Tip" className="footer-link">Submit News Tip</a>
              <a href="mailto:65arunyadav65@gmail.com?subject=Partnership" className="footer-link">Partnership</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom" style={{ maxWidth:1200, margin:'0 auto', padding:'16px 20px', borderTop:'1px solid #333', fontFamily:'JetBrains Mono, monospace', fontSize:9, color:'#555', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <span>© {new Date().getFullYear()} NewsFlash Media. All rights reserved. · India</span>
          <span>
            <Link href="/privacy-policy" style={{ color:'#555', textDecoration:'none' }}>Privacy Policy</Link>
            {' · '}
            <Link href="/terms" style={{ color:'#555', textDecoration:'none' }}>Terms of Use</Link>
            {' · '}
            <Link href="/about" style={{ color:'#555', textDecoration:'none' }}>About</Link>
            {' · '}
            <Link href="/contact" style={{ color:'#555', textDecoration:'none' }}>Contact</Link>
          </span>
        </div>
      </footer>
    </div>
  )
}
