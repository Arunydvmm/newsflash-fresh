'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['India','World','Business','Technology','Sports','Science','Health','Entertainment','Opinion']

const inp: React.CSSProperties = { width:'100%', padding:'10px 14px', border:'1.5px solid #E0DDD5', borderRadius:3, fontSize:15, outline:'none', fontFamily:'inherit', background:'white' }
const lbl: React.CSSProperties = { display:'block', fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#6B6B6B', marginBottom:6 }

export default function ArticleForm({ initial = null, articleId = null }: { initial?: any; articleId?: string | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState('')

  const [title, setTitle]         = useState(initial?.title || '')
  const [summary, setSummary]     = useState(initial?.summary || '')
  const [content, setContent]     = useState(initial?.content || '')
  const [category, setCategory]   = useState(initial?.category || 'India')
  const [status, setStatus]       = useState(initial?.status || 'draft')
  const [author, setAuthor]       = useState(initial?.author || '')
  const [videoUrl, setVideoUrl]   = useState(initial?.videoUrl || '')
  const [imageUrl, setImageUrl]   = useState(initial?.featuredImage || '')
  const [tagsRaw, setTagsRaw]     = useState((initial?.tags || []).join(', '))
  const [highlights, setHighlights] = useState((initial?.keyHighlights || []).join('\n'))
  const [refs, setRefs]           = useState<{sourceName:string;url:string}[]>(initial?.referenceLinks || [{ sourceName:'', url:'' }])
  const [uploading, setUploading] = useState(false)

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('image', file)
    const res = await fetch('/api/upload', { method:'POST', body:fd, credentials:'include' })
    const data = await res.json()
    if (data.url) setImageUrl(data.url)
    else setMsg('Image upload failed — check Cloudinary env vars')
    setUploading(false)
  }

  async function save(statusOverride?: string) {
    setSaving(true); setMsg('')
    const payload = {
      title, summary, content, category,
      status: statusOverride || status,
      author,
      videoUrl,
      featuredImage: imageUrl,
      tags: tagsRaw.split(',').map(t => t.trim()).filter(Boolean),
      keyHighlights: highlights.split('\n').map(h => h.trim()).filter(Boolean),
      referenceLinks: refs.filter(r => r.sourceName && r.url),
    }
    const url = articleId ? `/api/articles/${articleId}` : '/api/articles'
    const method = articleId ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method, headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(payload), credentials:'include',
    })
    const data = await res.json()
    if (res.ok) {
      setMsg(statusOverride === 'published' ? '✓ Published!' : '✓ Saved!')
      if (!articleId) router.push(`/admin/articles/${data._id}`)
    } else {
      setMsg(data.error || 'Save failed')
    }
    setSaving(false)
  }

  return (
    <div style={{ padding:28, maxWidth:900 }}>
      {msg && (
        <div style={{ background: msg.startsWith('✓') ? '#E8F5E9' : '#FFEBEE', borderLeft:`3px solid ${msg.startsWith('✓')?'#2E7D32':'#C62828'}`, padding:'10px 14px', fontFamily:'JetBrains Mono, monospace', fontSize:11, color: msg.startsWith('✓') ? '#2E7D32':'#C62828', marginBottom:20, borderRadius:'0 3px 3px 0' }}>
          {msg}
        </div>
      )}

      {/* Title */}
      <div style={{ marginBottom:20 }}>
        <label style={lbl}>Article Title *</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a compelling headline..."
          style={{ ...inp, fontSize:20, fontFamily:'Playfair Display, serif', fontWeight:700 }} />
      </div>

      {/* Summary */}
      <div style={{ marginBottom:20 }}>
        <label style={lbl}>Summary / Excerpt *</label>
        <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={3} placeholder="Brief summary shown on homepage and SEO..."
          style={{ ...inp, resize:'vertical', lineHeight:1.7 }} />
      </div>

      {/* Category + Status + Author */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:20 }}>
        <div>
          <label style={lbl}>Category *</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={inp}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={inp}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label style={lbl}>Author</label>
          <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="NewsFlash Desk" style={inp} />
        </div>
      </div>

      {/* Featured Image */}
      <div style={{ marginBottom:20 }}>
        <label style={lbl}>Featured Image</label>
        <input type="file" accept="image/*" onChange={uploadImage} style={{ display:'none' }} id="img-upload" />
        <label htmlFor="img-upload"
          style={{ display:'block', border:'2px dashed #E0DDD5', padding:24, textAlign:'center', cursor:'pointer', borderRadius:4, background:'#FAFAF8', fontFamily:'JetBrains Mono, monospace', fontSize:11, color:'#aaa', letterSpacing:1, textTransform:'uppercase' }}>
          {uploading ? 'Uploading...' : imageUrl ? '✓ Image uploaded — click to replace' : '📁 Click to upload image (JPG, PNG, WebP)'}
        </label>
        {imageUrl && <img src={imageUrl} alt="preview" style={{ width:'100%', maxHeight:200, objectFit:'cover', borderRadius:3, marginTop:8 }} />}
        <div style={{ marginTop:6 }}>
          <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Or paste image URL directly..."
            style={{ ...inp, fontSize:13, color:'#aaa' }} />
        </div>
      </div>

      {/* Article Body */}
      <div style={{ marginBottom:20 }}>
        <label style={lbl}>Article Body * (HTML supported)</label>
        <div style={{ border:'1.5px solid #E0DDD5', borderRadius:3, overflow:'hidden' }}>
          <div style={{ background:'#F0EFE8', padding:'8px 10px', display:'flex', gap:6, flexWrap:'wrap', borderBottom:'1px solid #E0DDD5' }}>
            {[
              ['B', () => setContent(c => c + '<strong></strong>')],
              ['I', () => setContent(c => c + '<em></em>')],
              ['H2', () => setContent(c => c + '\n<h2></h2>\n')],
              ['¶', () => setContent(c => c + '\n<p></p>\n')],
              ['" "', () => setContent(c => c + '\n<blockquote></blockquote>\n')],
              ['• List', () => setContent(c => c + '\n<ul>\n  <li></li>\n</ul>\n')],
            ].map(([label, fn]: any) => (
              <button key={label} onClick={fn}
                style={{ background:'transparent', border:'none', padding:'4px 8px', fontSize:12, cursor:'pointer', color:'#6B6B6B', fontFamily:'JetBrains Mono, monospace', borderRadius:2 }}>
                {label}
              </button>
            ))}
          </div>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={14}
            placeholder="Write article body here. Use HTML tags or just plain text. Example:&#10;<p>Your paragraph here.</p>&#10;<h2>Subheading</h2>&#10;<p>More content...</p>"
            style={{ ...inp, border:'none', minHeight:280, lineHeight:1.7, fontFamily:'JetBrains Mono, monospace', fontSize:13 }} />
        </div>
      </div>

      {/* Key Highlights */}
      <div style={{ marginBottom:20 }}>
        <label style={lbl}>Key Highlights (one per line)</label>
        <textarea value={highlights} onChange={e => setHighlights(e.target.value)} rows={4}
          placeholder="Data protection board can impose fines up to ₹250 crore&#10;Citizens gain right to access and erase personal data&#10;Parental consent required for children's data"
          style={{ ...inp, resize:'vertical', fontFamily:'JetBrains Mono, monospace', fontSize:13, lineHeight:1.7 }} />
      </div>

      {/* Video URL */}
      <div style={{ marginBottom:20 }}>
        <label style={lbl}>Video URL (YouTube / Vimeo — Optional)</label>
        <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." style={inp} />
      </div>

      {/* Tags */}
      <div style={{ marginBottom:20 }}>
        <label style={lbl}>Tags (comma separated)</label>
        <input value={tagsRaw} onChange={e => setTagsRaw(e.target.value)} placeholder="parliament, data privacy, technology, india" style={inp} />
      </div>

      {/* Reference Links */}
      <div style={{ marginBottom:28 }}>
        <label style={lbl}>Sources & Reference Links</label>
        {refs.map((r, i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 2fr auto', gap:8, marginBottom:8 }}>
            <input value={r.sourceName} onChange={e => { const n=[...refs]; n[i].sourceName=e.target.value; setRefs(n) }}
              placeholder="Source name (e.g. Reuters)" style={inp} />
            <input value={r.url} onChange={e => { const n=[...refs]; n[i].url=e.target.value; setRefs(n) }}
              placeholder="https://..." style={inp} />
            <button onClick={() => setRefs(refs.filter((_,j)=>j!==i))}
              style={{ border:'1.5px solid #E0DDD5', background:'transparent', width:36, cursor:'pointer', color:'#ccc', borderRadius:2, fontSize:16 }}>×</button>
          </div>
        ))}
        <button onClick={() => setRefs([...refs, { sourceName:'', url:'' }])}
          style={{ border:'1.5px dashed #E0DDD5', background:'transparent', padding:'8px 16px', fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:1, textTransform:'uppercase', cursor:'pointer', color:'#6B6B6B', borderRadius:2, marginTop:4 }}>
          + Add Source
        </button>
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:10, paddingTop:20, borderTop:'1px solid #E0DDD5' }}>
        <button onClick={() => save('published')} disabled={saving}
          style={{ background:'#C62828', color:'white', border:'none', padding:'12px 24px', fontFamily:'JetBrains Mono, monospace', fontSize:11, letterSpacing:1.5, textTransform:'uppercase', cursor:'pointer', borderRadius:2 }}>
          {saving ? 'Saving...' : '🚀 Publish'}
        </button>
        <button onClick={() => save('draft')} disabled={saving}
          style={{ background:'#1A1A1A', color:'white', border:'none', padding:'12px 24px', fontFamily:'JetBrains Mono, monospace', fontSize:11, letterSpacing:1.5, textTransform:'uppercase', cursor:'pointer', borderRadius:2 }}>
          Save Draft
        </button>
        <a href="/admin/articles"
          style={{ border:'1.5px solid #E0DDD5', background:'transparent', padding:'11px 24px', fontFamily:'JetBrains Mono, monospace', fontSize:11, letterSpacing:1.5, textTransform:'uppercase', cursor:'pointer', borderRadius:2, color:'#6B6B6B', textDecoration:'none' }}>
          Cancel
        </a>
      </div>
    </div>
  )
}
