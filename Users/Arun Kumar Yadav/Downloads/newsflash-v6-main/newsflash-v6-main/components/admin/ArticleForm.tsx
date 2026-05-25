'use client'
// @ts-nocheck
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['India','World','Business','Technology','Sports','Science','Health','Entertainment','Opinion','Cricket','Sarkari']

const inp = {
  width: '100%', padding: '9px 12px', border: '1px solid #E0DDD5', borderRadius: 4,
  fontFamily: 'Inter, sans-serif', fontSize: 13, outline: 'none', background: 'white',
}
const lbl = { display: 'block', marginBottom: 5, fontSize: 12, fontWeight: 600, color: '#444', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.5, textTransform: 'uppercase' as const }

export default function ArticleForm({ article = null, isEmployee = false }) {
  const router  = useRouter()
  const [loading, setLoading]   = useState(false)
  const [imgUploading, setImgUploading] = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title:          article?.title          || '',
    slug:           article?.slug           || '',
    category:       article?.category       || 'India',
    summary:        article?.summary        || '',
    content:        article?.content        || '',
    author:         article?.author         || '',
    featuredImage:  article?.featuredImage  || '',
    videoUrl:       article?.videoUrl       || '',
    tags:           article?.tags?.join(', ') || '',
    readTime:       article?.readTime       || 3,
    status:         article?.status         || 'draft',
    isBreaking:     article?.isBreaking     || false,
    isFeatured:     article?.isFeatured     || false,
    keyHighlights:  article?.keyHighlights?.join('\n') || '',
  })

  const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const set = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const onTitleChange = (e: any) => {
    const t = e.target.value
    setForm(p => ({ ...p, title: t, slug: article ? p.slug : slug(t) }))
  }

  async function uploadImage(file: File) {
    setImgUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' })
      const data = await res.json()
      if (data.url) setForm(p => ({ ...p, featuredImage: data.url }))
      else setError('Image upload failed')
    } catch {
      setError('Image upload failed')
    } finally {
      setImgUploading(false)
    }
  }

  async function handleSubmit(e: any, forceDraft = false) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const payload = {
      ...form,
      tags:          form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      keyHighlights: form.keyHighlights.split('\n').map((t: string) => t.trim()).filter(Boolean),
      status:        forceDraft ? 'draft' : isEmployee ? 'pending_review' : form.status,
    }

    try {
      const url    = article ? `/api/articles/${article._id}` : '/api/articles'
      const method = article ? 'PATCH' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Failed to save article')
        return
      }
      setSuccess(article ? 'Article updated!' : 'Article saved!')
      setTimeout(() => router.push(isEmployee ? '/staff/articles' : '/admin/articles'), 800)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: 'white', padding: 28, borderRadius: 6 }}>
      {error   && <div style={{ background: '#FFF3F3', border: '1px solid #FFCDD2', color: '#C62828', padding: '10px 14px', borderRadius: 4, marginBottom: 16, fontSize: 13 }}>{error}</div>}
      {success && <div style={{ background: '#F1F8E9', border: '1px solid #C5E1A5', color: '#2E7D32', padding: '10px 14px', borderRadius: 4, marginBottom: 16, fontSize: 13 }}>{success}</div>}

      {/* Title */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>Title *</label>
        <input name="title" value={form.title} onChange={onTitleChange} required placeholder="Article headline" style={inp} />
      </div>

      {/* Slug */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>URL Slug *</label>
        <input name="slug" value={form.slug} onChange={set} required placeholder="article-url-slug" style={{ ...inp, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
      </div>

      {/* Category + Author */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
        <div>
          <label style={lbl}>Category *</label>
          <select name="category" value={form.category} onChange={set} required style={inp}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Author</label>
          <input name="author" value={form.author} onChange={set} placeholder="Author name" style={inp} />
        </div>
      </div>

      {/* Summary */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>Summary *</label>
        <textarea name="summary" value={form.summary} onChange={set} required placeholder="Brief summary (shown in cards)" rows={3} style={{ ...inp, resize: 'vertical' }} />
      </div>

      {/* Content */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>Content * <span style={{ color: '#aaa', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(HTML supported)</span></label>
        <textarea name="content" value={form.content} onChange={set} required placeholder="<p>Full article content...</p>" rows={16} style={{ ...inp, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, resize: 'vertical' }} />
      </div>

      {/* Key Highlights */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>Key Highlights <span style={{ color: '#aaa', fontWeight: 400, textTransform: 'none' }}>(one per line)</span></label>
        <textarea name="keyHighlights" value={form.keyHighlights} onChange={set} placeholder="First highlight&#10;Second highlight&#10;Third highlight" rows={4} style={{ ...inp, resize: 'vertical' }} />
      </div>

      {/* Featured Image */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>Featured Image</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input name="featuredImage" value={form.featuredImage} onChange={set} placeholder="https://... or upload below" style={{ ...inp, flex: 1 }} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={imgUploading}
            style={{ background: '#0D1B2A', color: 'white', border: 'none', padding: '9px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap', opacity: imgUploading ? 0.6 : 1 }}>
            {imgUploading ? 'Uploading...' : '⬆ Upload'}
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
        {form.featuredImage && (
          <img src={form.featuredImage} alt="preview" style={{ marginTop: 8, height: 80, borderRadius: 4, objectFit: 'cover', border: '1px solid #E0DDD5' }} />
        )}
      </div>

      {/* Video URL */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>YouTube Video URL</label>
        <input name="videoUrl" value={form.videoUrl} onChange={set} placeholder="https://youtube.com/watch?v=..." style={inp} />
      </div>

      {/* Tags + Read Time */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 16, marginBottom: 18 }}>
        <div>
          <label style={lbl}>Tags (comma-separated)</label>
          <input name="tags" value={form.tags} onChange={set} placeholder="India, economy, markets" style={inp} />
        </div>
        <div>
          <label style={lbl}>Read Time (min)</label>
          <input name="readTime" type="number" value={form.readTime} onChange={set} min={1} style={inp} />
        </div>
      </div>

      {/* Status + Flags — SuperAdmin only */}
      {!isEmployee && (
        <div style={{ marginBottom: 18, padding: 16, background: '#F8F8F6', borderRadius: 4, border: '1px solid #E0DDD5' }}>
          <label style={{ ...lbl, marginBottom: 12 }}>Publish Settings</label>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ ...lbl, marginBottom: 4 }}>Status</label>
              <select name="status" value={form.status} onChange={set} style={{ ...inp, width: 'auto' }}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="pending_review">Pending Review</option>
              </select>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" name="isBreaking" checked={form.isBreaking} onChange={set} />
              ⚡ Breaking News
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={set} />
              ⭐ Featured
            </label>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="submit" disabled={loading}
          style={{ background: '#C62828', color: 'white', padding: '11px 24px', border: 'none', borderRadius: 4, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving...' : isEmployee ? 'Submit for Review' : article ? 'Update Article' : 'Publish Article'}
        </button>
        {!isEmployee && (
          <button type="button" disabled={loading} onClick={(e) => handleSubmit(e, true)}
            style={{ background: 'white', color: '#444', padding: '11px 20px', border: '1px solid #E0DDD5', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
            Save as Draft
          </button>
        )}
        <button type="button" onClick={() => router.back()}
          style={{ background: 'white', color: '#888', padding: '11px 20px', border: '1px solid #E0DDD5', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
          Cancel
        </button>
      </div>
    </form>
  )
}
