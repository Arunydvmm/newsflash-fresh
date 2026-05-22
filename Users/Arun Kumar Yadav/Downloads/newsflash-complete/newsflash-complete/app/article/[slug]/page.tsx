import { notFound } from 'next/navigation'
import Link from 'next/link'
import { connectDB } from '@/lib/db'
import Article from '@/models/Article'
import { format } from 'date-fns'
import type { Metadata } from 'next'

export const revalidate = 120

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB()
  const a = await Article.findOne({ slug: params.slug, status: 'published' }).lean() as any
  if (!a) return { title: 'Not Found' }
  return {
    title: a.title,
    description: a.summary,
    openGraph: { title: a.title, description: a.summary, images: a.featuredImage ? [a.featuredImage] : [] },
  }
}

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : null
    }
    if (u.hostname === 'youtu.be') return `https://www.youtube.com/embed${u.pathname}?rel=0`
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
  } catch {}
  return null
}

export default async function ArticlePage({ params }: Props) {
  await connectDB()
  const article = await Article.findOneAndUpdate(
    { slug: params.slug, status: 'published' },
    { $inc: { views: 1 } },
    { new: true }
  ).lean() as any

  if (!article) notFound()

  const related = await Article.find({ status:'published', category: article.category, slug:{ $ne: article.slug } })
    .sort({ createdAt:-1 }).limit(3).lean() as any[]

  const embedUrl = article.videoUrl ? getEmbedUrl(article.videoUrl) : null
  const date = format(new Date(article.createdAt), "d MMMM yyyy 'at' h:mm a")
  const initials = article.author.split(' ').map((w: string) => w[0]).join('').slice(0,2).toUpperCase()
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/article/${article.slug}`

  return (
    <div style={{ fontFamily:"'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{ background:'white', borderBottom:'3px solid #1A1A1A', padding:'0 20px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 0' }}>
          <Link href="/" style={{ fontFamily:'Playfair Display, serif', fontSize:32, fontWeight:900, color:'#1A1A1A', textDecoration:'none' }}>
            NEWS<span style={{ color:'#C62828' }}>FLASH</span>
          </Link>
          <Link href="/admin" style={{ background:'#C62828', color:'white', padding:'7px 14px', fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textDecoration:'none', borderRadius:2, textTransform:'uppercase' }}>⚙ Admin</Link>
        </div>
      </header>

      <article style={{ maxWidth:780, margin:'0 auto', padding:'32px 20px' }}>
        {/* Breadcrumb */}
        <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#6B6B6B', letterSpacing:1, textTransform:'uppercase', marginBottom:20 }}>
          <Link href="/" style={{ color:'#6B6B6B', textDecoration:'none' }}>Home</Link>
          {' / '}
          <Link href={`/?category=${article.category}`} style={{ color:'#6B6B6B', textDecoration:'none' }}>{article.category}</Link>
        </div>

        <span style={{ display:'inline-block', background:'#C62828', color:'white', fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', padding:'3px 8px', marginBottom:12 }}>{article.category}</span>
        <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:40, fontWeight:900, lineHeight:1.15, color:'#1A1A1A', marginBottom:20, letterSpacing:-0.5 }}>{article.title}</h1>

        {/* Byline */}
        <div style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 0', borderTop:'1px solid #E0DDD5', borderBottom:'1px solid #E0DDD5', marginBottom:24 }}>
          <div style={{ width:38, height:38, borderRadius:'50%', background:'#1A1A1A', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'JetBrains Mono, monospace', fontSize:12, fontWeight:600, flexShrink:0 }}>{initials}</div>
          <div style={{ flex:1, fontFamily:'JetBrains Mono, monospace', fontSize:11 }}>
            <div style={{ fontWeight:600, color:'#1A1A1A' }}>{article.author}</div>
            <div style={{ color:'#aaa', marginTop:2 }}>{date} · {article.readTime} min read</div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {[
              { label:'WhatsApp', href:`https://wa.me/?text=${encodeURIComponent(article.title+' '+shareUrl)}` },
              { label:'𝕏 Share', href:`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}` },
              { label:'Facebook', href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:1, textTransform:'uppercase', padding:'6px 10px', border:'1.5px solid #E0DDD5', background:'transparent', textDecoration:'none', color:'#6B6B6B', borderRadius:2 }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div style={{ width:'100%', aspectRatio:'16/8', background:'#D0CCC0', borderRadius:3, overflow:'hidden', marginBottom:24 }}>
            <img src={article.featuredImage} alt={article.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </div>
        )}

        {/* Key Highlights */}
        {article.keyHighlights?.length > 0 && (
          <div style={{ background:'#F0EFE8', borderLeft:'4px solid #C62828', padding:'16px 20px', marginBottom:24, borderRadius:'0 4px 4px 0' }}>
            <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#C62828', marginBottom:10, fontWeight:600 }}>Key Highlights</div>
            <ul style={{ listStyle:'none', padding:0 }}>
              {article.keyHighlights.map((h: string, i: number) => (
                <li key={i} style={{ fontSize:14, color:'#1A1A1A', paddingLeft:16, position:'relative', lineHeight:1.6, marginBottom:4 }}>
                  <span style={{ position:'absolute', left:0, color:'#C62828', fontSize:11 }}>▸</span>{h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Video Embed */}
        {embedUrl && (
          <div style={{ background:'#1A1A1A', borderRadius:4, padding:14, marginBottom:24 }}>
            <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, color:'#666', textTransform:'uppercase', marginBottom:8 }}>Watch Video</div>
            <div style={{ aspectRatio:'16/9', width:'100%', borderRadius:3, overflow:'hidden' }}>
              <iframe src={embedUrl} style={{ width:'100%', height:'100%', border:'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen title="Embedded video" />
            </div>
          </div>
        )}

        {/* Mid-article ad */}
        <div style={{ background:'#F0EFE8', border:'1px dashed #E0DDD5', height:80, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'#bbb', letterSpacing:2, textTransform:'uppercase', margin:'24px 0' }}>
          728 × 90 — Mid-Article Ad
        </div>

        {/* Article Body */}
        <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />

        {/* References */}
        {article.referenceLinks?.length > 0 && (
          <div style={{ background:'#F0EFE8', border:'1px solid #E0DDD5', borderRadius:4, padding:20, marginTop:32 }}>
            <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6B6B6B', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:16, height:2, background:'#C62828', display:'inline-block' }} />
              Sources & References
            </div>
            <ul style={{ listStyle:'none', padding:0 }}>
              {article.referenceLinks.map((r: any, i: number) => (
                <li key={i} style={{ marginBottom:10 }}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    style={{ color:'#C62828', fontFamily:'JetBrains Mono, monospace', fontSize:12, textDecoration:'none', display:'flex', alignItems:'center', gap:6 }}>
                    🔗 {r.sourceName}
                  </a>
                  <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:11, color:'#6B6B6B', marginTop:2, paddingLeft:20 }}>{r.url}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:32, paddingTop:24, borderTop:'1px solid #E0DDD5' }}>
            <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'#6B6B6B' }}>Tags:</span>
            {article.tags.map((tag: string) => (
              <Link key={tag} href={`/?search=${encodeURIComponent(tag)}`}
                style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, textTransform:'uppercase', padding:'4px 10px', border:'1.5px solid #E0DDD5', color:'#6B6B6B', textDecoration:'none', borderRadius:2 }}>
                {tag}
              </Link>
            ))}
          </div>
        )}
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section style={{ maxWidth:780, margin:'0 auto', padding:'0 20px 48px' }}>
          <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'#6B6B6B', borderBottom:'2px solid #1A1A1A', paddingBottom:6, marginBottom:20 }}>
            More in {article.category}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
            {related.map((a: any) => (
              <Link key={String(a._id)} href={`/article/${a.slug}`} style={{ textDecoration:'none', color:'inherit' }}>
                <div style={{ aspectRatio:'16/10', background:'linear-gradient(135deg,#CCC8BE,#B8B2A6)', borderRadius:2, marginBottom:8, overflow:'hidden' }}>
                  {a.featuredImage && <img src={a.featuredImage} alt={a.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
                </div>
                <h4 style={{ fontFamily:'Playfair Display, serif', fontSize:15, fontWeight:700, lineHeight:1.3, color:'#1A1A1A' }}>{a.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer style={{ background:'#1A1A1A', color:'#888', padding:'24px 20px', textAlign:'center', fontFamily:'JetBrains Mono, monospace', fontSize:10 }}>
        © {new Date().getFullYear()} NewsFlash Media Pvt. Ltd. · <Link href="/" style={{ color:'#888' }}>Home</Link>
      </footer>
    </div>
  )
}
