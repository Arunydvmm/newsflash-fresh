// @ts-nocheck
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { connectDB } from '../../lib/db'
import Article from '../../models/Article'
import { format } from 'date-fns'
import type { Metadata } from 'next'

export const revalidate = 120

const SITE_URL = 'https://newsflash-v6.onrender.com'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB()
  const a = await Article.findOne({ slug: params.slug, status: 'published' }).lean() as any
  if (!a) return { title: 'Not Found' }
  const url = `${SITE_URL}/article/${a.slug}`
  const image = a.featuredImage || `${SITE_URL}/og-default.jpg`
  return {
    title: a.title,
    description: a.summary,
    keywords: [...(a.tags || []), a.category, 'India news', 'NewsFlash'],
    authors: [{ name: a.author || 'NewsFlash Editorial' }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: a.title,
      description: a.summary,
      images: [{ url: image, width: 1200, height: 630, alt: a.title }],
      publishedTime: a.createdAt,
      modifiedTime: a.updatedAt,
      authors: [a.author || 'NewsFlash Editorial'],
      section: a.category,
      tags: a.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: a.title,
      description: a.summary,
      images: [image],
    },
  }
}

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : null
    }
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}?rel=0`
    }
  } catch {}
  return null
}

export default async function ArticlePage({ params }: Props) {
  await connectDB()
  const a = await Article.findOne({ slug: params.slug, status: 'published' }).lean() as any
  if (!a) notFound()

  await Article.findByIdAndUpdate(a._id, { $inc: { views: 1 } })

  const related = await Article.find({
    status: 'published', category: a.category, _id: { $ne: a._id }
  }).sort({ createdAt: -1 }).limit(3).lean() as any[]

  const fmt = (d: any) => format(new Date(d), 'd MMM yyyy')
  const embedUrl = a.videoUrl ? getEmbedUrl(a.videoUrl) : null

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: a.title,
    description: a.summary,
    image: a.featuredImage ? [a.featuredImage] : [],
    datePublished: a.createdAt,
    dateModified: a.updatedAt || a.createdAt,
    author: [{ '@type': 'Person', name: a.author || 'NewsFlash Editorial' }],
    publisher: {
      '@type': 'Organization',
      name: 'NewsFlash',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/article/${a.slug}` },
    keywords: (a.tags || []).join(', '),
    articleSection: a.category,
    inLanguage: 'en-IN',
  }

  return (
    <div style={{ fontFamily:"'Inter', sans-serif", background:'#FAFAF8' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <style>{`
        * { box-sizing: border-box; }
        .art-grid { display: grid; grid-template-columns: 1fr 300px; gap: 32px; max-width: 1200px; margin: 0 auto; padding: 32px 20px; }
        .rel-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        @media (max-width: 768px) {
          .art-grid { grid-template-columns: 1fr !important; padding: 20px 14px !important; }
          .sidebar-col { display: none; }
          .rel-grid { grid-template-columns: 1fr 1fr !important; }
          .art-title { font-size: 26px !important; }
        }
        @media (max-width: 480px) {
          .rel-grid { grid-template-columns: 1fr !important; }
          .art-title { font-size: 22px !important; }
        }
      `}</style>

      {/* HEADER */}
      <header style={{ background:'white', borderBottom:'3px solid #1A1A1A', padding:'0 20px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0' }}>
          <Link href="/" style={{ fontFamily:'Playfair Display, serif', fontSize:28, fontWeight:900, color:'#1A1A1A', textDecoration:'none' }}>
            NEWS<span style={{ color:'#C62828' }}>FLASH</span>
          </Link>
          <nav style={{ display:'flex', gap:16, alignItems:'center' }}>
            {['India','World','Business','Technology','Sports'].map(c => (
              <Link key={c} href={`/?category=${c}`} style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'#6B6B6B', textDecoration:'none' }}>{c}</Link>
            ))}
          </nav>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div style={{ background:'white', borderBottom:'1px solid #E0DDD5', padding:'8px 20px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#aaa' }}>
          <Link href="/" style={{ color:'#aaa', textDecoration:'none' }}>Home</Link>
          {' › '}
          <Link href={`/?category=${a.category}`} style={{ color:'#aaa', textDecoration:'none' }}>{a.category}</Link>
          {' › '}
          <span style={{ color:'#6B6B6B' }}>{a.title.slice(0, 50)}{a.title.length > 50 ? '…' : ''}</span>
        </div>
      </div>

      <div className="art-grid">
        {/* ARTICLE */}
        <article>
          <span style={{ display:'inline-block', background:'#C62828', color:'white', fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', padding:'3px 10px', marginBottom:12 }}>{a.category}</span>
          <h1 className="art-title" style={{ fontFamily:'Playfair Display, serif', fontSize:34, fontWeight:700, lineHeight:1.2, color:'#1A1A1A', marginBottom:16 }}>{a.title}</h1>
          <p style={{ fontSize:17, color:'#444', lineHeight:1.7, borderLeft:'3px solid #C62828', paddingLeft:14, marginBottom:20, fontStyle:'italic' }}>{a.summary}</p>

          {/* META */}
          <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap', padding:'12px 0', borderTop:'1px solid #E0DDD5', borderBottom:'1px solid #E0DDD5', marginBottom:24, fontFamily:'JetBrains Mono, monospace', fontSize:11, color:'#888' }}>
            <span>✍ {a.author || 'NewsFlash Editorial'}</span>
            <span>📅 {fmt(a.createdAt)}</span>
            <span>⏱ {a.readTime || 3} min read</span>
            <span>👁 {(a.views || 0).toLocaleString('en-IN')} views</span>
          </div>

          {/* IMAGE */}
          {a.featuredImage && (
            <figure style={{ margin:'0 0 24px' }}>
              <img src={a.featuredImage} alt={a.title} style={{ width:'100%', borderRadius:4, objectFit:'cover', maxHeight:450 }} />
            </figure>
          )}

          {/* VIDEO */}
          {embedUrl && (
            <div style={{ position:'relative', paddingBottom:'56.25%', height:0, marginBottom:24, borderRadius:4, overflow:'hidden' }}>
              <iframe src={embedUrl} style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }} allowFullScreen title={a.title} />
            </div>
          )}

          {/* KEY HIGHLIGHTS */}
          {a.keyHighlights?.length > 0 && (
            <div style={{ background:'#FFF8F8', border:'1.5px solid #C62828', borderRadius:4, padding:20, marginBottom:24 }}>
              <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'#C62828', marginBottom:12 }}>⚡ Key Highlights</div>
              <ul style={{ paddingLeft:20, margin:0 }}>
                {a.keyHighlights.map((h, i) => <li key={i} style={{ fontSize:14, lineHeight:1.8, color:'#333', marginBottom:4 }}>{h}</li>)}
              </ul>
            </div>
          )}

          {/* CONTENT */}
          <div style={{ fontSize:16, lineHeight:1.85, color:'#2A2A2A' }} dangerouslySetInnerHTML={{ __html: a.content }} />

          {/* TAGS */}
          {a.tags?.length > 0 && (
            <div style={{ marginTop:28, paddingTop:20, borderTop:'1px solid #E0DDD5' }}>
              <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#888', marginRight:10 }}>Tags:</span>
              {a.tags.map(t => (
                <span key={t} style={{ display:'inline-block', background:'#F0EFE8', fontFamily:'JetBrains Mono, monospace', fontSize:10, padding:'3px 10px', borderRadius:2, marginRight:6, marginBottom:6, color:'#6B6B6B' }}>{t}</span>
              ))}
            </div>
          )}

          {/* SHARE */}
          <div style={{ marginTop:24, padding:20, background:'white', border:'1.5px solid #E0DDD5', borderRadius:4 }}>
            <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#888', marginBottom:12 }}>Share this article</div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {[
                { label:'𝕏 Twitter', color:'#1A1A1A', href:`https://twitter.com/intent/tweet?text=${encodeURIComponent(a.title)}&url=${encodeURIComponent(SITE_URL+'/article/'+a.slug)}` },
                { label:'WhatsApp', color:'#25D366', href:`https://wa.me/?text=${encodeURIComponent(a.title+' '+SITE_URL+'/article/'+a.slug)}` },
                { label:'Facebook', color:'#1877F2', href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL+'/article/'+a.slug)}` },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ background:s.color, color:'white', padding:'8px 16px', fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textDecoration:'none', borderRadius:2, textTransform:'uppercase' }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* REFERENCE LINKS */}
          {a.referenceLinks?.filter(r => r.url)?.length > 0 && (
            <div style={{ marginTop:24, padding:20, background:'#FAFAF8', border:'1px solid #E0DDD5', borderRadius:4 }}>
              <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#888', marginBottom:12 }}>Sources</div>
              {a.referenceLinks.filter(r => r.url).map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer nofollow"
                  style={{ display:'block', fontSize:13, color:'#C62828', marginBottom:6, textDecoration:'none', fontFamily:'JetBrains Mono, monospace' }}>
                  ↗ {r.sourceName || r.url}
                </a>
              ))}
            </div>
          )}

          {/* RELATED */}
          {related.length > 0 && (
            <div style={{ marginTop:36 }}>
              <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'#6B6B6B', borderBottom:'2px solid #1A1A1A', paddingBottom:6, marginBottom:16 }}>Related Articles</div>
              <div className="rel-grid">
                {related.map(r => (
                  <Link key={String(r._id)} href={`/article/${r.slug}`} style={{ textDecoration:'none', color:'inherit' }}>
                    <div style={{ aspectRatio:'16/9', background:'linear-gradient(135deg,#CCC8BE,#B8B2A6)', borderRadius:2, marginBottom:8, overflow:'hidden' }}>
                      {r.featuredImage && <img src={r.featuredImage} alt={r.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
                    </div>
                    <h4 style={{ fontFamily:'Playfair Display, serif', fontSize:14, fontWeight:700, lineHeight:1.4, color:'#1A1A1A' }}>{r.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* SIDEBAR */}
        <aside className="sidebar-col">
          <div style={{ position:'sticky', top:20 }}>
            <div style={{ background:'#F0EFE8', border:'1px dashed #E0DDD5', height:250, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#bbb', textTransform:'uppercase', letterSpacing:2, marginBottom:24 }}>
              300 × 250 — Sidebar Ad
            </div>
            <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'#6B6B6B', borderBottom:'2px solid #1A1A1A', paddingBottom:6, marginBottom:12 }}>More from {a.category}</div>
            {related.map(r => (
              <Link key={String(r._id)} href={`/article/${r.slug}`} style={{ display:'block', padding:'10px 0', borderBottom:'1px solid #E0DDD5', textDecoration:'none' }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#1A1A1A', lineHeight:1.4 }}>{r.title}</div>
                <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#aaa', marginTop:4 }}>{fmt(r.createdAt)}</div>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer style={{ background:'#1A1A1A', color:'#888', marginTop:48 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'24px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <Link href="/" style={{ fontFamily:'Playfair Display, serif', fontSize:22, fontWeight:900, color:'white', textDecoration:'none' }}>NEWS<span style={{ color:'#C62828' }}>FLASH</span></Link>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {[['About','/about'],['Contact','/contact'],['Privacy','/privacy-policy'],['Terms','/terms']].map(([l,h]) => (
              <Link key={l} href={h} style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#888', textDecoration:'none', letterSpacing:1 }}>{l}</Link>
            ))}
          </div>
          <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, color:'#555' }}>© {new Date().getFullYear()} NewsFlash Media</span>
        </div>
      </footer>
    </div>
  )
}
