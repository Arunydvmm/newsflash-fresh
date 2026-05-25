'use client'
// @ts-nocheck
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['Railway','SSC','UPSC','Police','Defence','Bank','Teaching','State','PSU','Internship','Private','Other']
const STATES = ['All India','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh']
const QUALIFICATIONS = ['10th Pass','12th Pass','ITI','Diploma','Graduate','Post Graduate','B.Tech/B.E.','MBA','MBBS','LLB','CA','Any Graduate']

const inp = { width: '100%', padding: '9px 12px', border: '1px solid #E0DDD5', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: 13, outline: 'none', background: 'white' }
const lbl = { display: 'block', marginBottom: 5, fontSize: 11, fontWeight: 600, color: '#444', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.5, textTransform: 'uppercase' as const }

export default function SarkariJobForm({ job = null }) {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm] = useState({
    title:           job?.title           || '',
    organization:    job?.organization    || '',
    category:        job?.category        || 'SSC',
    state:           job?.state           || 'All India',
    totalVacancy:    job?.totalVacancy    || '',
    salaryText:      job?.salaryText      || '',
    ageMin:          job?.ageMin          || 18,
    ageMax:          job?.ageMax          || 35,
    applicationFee:  job?.applicationFee  || 'No Fee',
    description:     job?.description     || '',
    eligibility:     job?.eligibility     || '',
    howToApply:      job?.howToApply      || '',
    officialWebsite: job?.officialWebsite || '',
    applyLink:       job?.applyLink       || '',
    notificationPdf: job?.notificationPdf || '',
    tags:            job?.tags?.join(', ') || '',
    isFeatured:      job?.isFeatured      || false,
    notificationDate: job?.importantDates?.notificationDate?.split?.('T')?.[0] || '',
    startDate:        job?.importantDates?.startDate?.split?.('T')?.[0]        || '',
    lastDate:         job?.importantDates?.lastDate?.split?.('T')?.[0]         || '',
    examDate:         job?.importantDates?.examDate?.split?.('T')?.[0]         || '',
    qualification:    job?.qualification  || [],
    selectionProcess: job?.selectionProcess?.join(', ') || '',
  })

  const set = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const toggleQual = (q: string) => {
    setForm(p => ({
      ...p,
      qualification: p.qualification.includes(q) ? p.qualification.filter((x: string) => x !== q) : [...p.qualification, q],
    }))
  }

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const payload = {
      title: form.title,
      organization: form.organization,
      category: form.category,
      state: form.state,
      totalVacancy: Number(form.totalVacancy) || 0,
      salaryText: form.salaryText,
      ageMin: Number(form.ageMin),
      ageMax: Number(form.ageMax),
      applicationFee: form.applicationFee,
      description: form.description,
      eligibility: form.eligibility,
      howToApply: form.howToApply,
      officialWebsite: form.officialWebsite,
      applyLink: form.applyLink,
      notificationPdf: form.notificationPdf,
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      isFeatured: form.isFeatured,
      qualification: form.qualification,
      selectionProcess: form.selectionProcess.split(',').map((t: string) => t.trim()).filter(Boolean),
      importantDates: {
        notificationDate: form.notificationDate || undefined,
        startDate:        form.startDate        || undefined,
        lastDate:         form.lastDate         || undefined,
        examDate:         form.examDate         || undefined,
      },
    }
    const url    = job ? `/api/sarkari/${job._id}` : '/api/sarkari'
    const method = job ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Failed'); setLoading(false); return }
    router.push('/admin/sarkari')
  }

  return (
    <form onSubmit={submit} style={{ background: 'white', padding: 28, borderRadius: 6 }}>
      {error && <div style={{ background: '#FFEBEE', color: '#C62828', padding: '10px 14px', borderRadius: 4, marginBottom: 16, fontSize: 13 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div><label style={lbl}>Job Title *</label><input name="title" value={form.title} onChange={set} required style={inp} /></div>
        <div><label style={lbl}>Organization *</label><input name="organization" value={form.organization} onChange={set} required style={inp} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div><label style={lbl}>Category *</label>
          <select name="category" value={form.category} onChange={set} style={inp}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
        </div>
        <div><label style={lbl}>State</label>
          <select name="state" value={form.state} onChange={set} style={inp}>{STATES.map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div><label style={lbl}>Total Vacancy</label><input name="totalVacancy" type="number" value={form.totalVacancy} onChange={set} style={inp} /></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div><label style={lbl}>Salary / Pay Scale</label><input name="salaryText" value={form.salaryText} onChange={set} placeholder="₹35,400 - ₹1,12,400" style={inp} /></div>
        <div><label style={lbl}>Age Min</label><input name="ageMin" type="number" value={form.ageMin} onChange={set} style={inp} /></div>
        <div><label style={lbl}>Age Max</label><input name="ageMax" type="number" value={form.ageMax} onChange={set} style={inp} /></div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={lbl}>Application Fee</label>
        <input name="applicationFee" value={form.applicationFee} onChange={set} placeholder="No Fee / ₹100 (General), ₹0 (SC/ST)" style={inp} />
      </div>

      {/* Important Dates */}
      <div style={{ marginBottom: 16, padding: 16, background: '#F8F8F6', borderRadius: 4, border: '1px solid #E0DDD5' }}>
        <label style={{ ...lbl, marginBottom: 12 }}>Important Dates</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          <div><label style={lbl}>Notification Date</label><input name="notificationDate" type="date" value={form.notificationDate} onChange={set} style={inp} /></div>
          <div><label style={lbl}>Start Date</label><input name="startDate" type="date" value={form.startDate} onChange={set} style={inp} /></div>
          <div><label style={lbl}>Last Date *</label><input name="lastDate" type="date" value={form.lastDate} onChange={set} required style={inp} /></div>
          <div><label style={lbl}>Exam Date</label><input name="examDate" type="date" value={form.examDate} onChange={set} style={inp} /></div>
        </div>
      </div>

      {/* Qualification */}
      <div style={{ marginBottom: 16, padding: 16, background: '#F8F8F6', borderRadius: 4, border: '1px solid #E0DDD5' }}>
        <label style={{ ...lbl, marginBottom: 10 }}>Qualification Required</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {QUALIFICATIONS.map(q => (
            <label key={q} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, padding: '4px 10px', background: form.qualification.includes(q) ? '#0D1B2A' : 'white', color: form.qualification.includes(q) ? 'white' : '#444', borderRadius: 3, border: '1px solid #E0DDD5' }}>
              <input type="checkbox" checked={form.qualification.includes(q)} onChange={() => toggleQual(q)} style={{ display: 'none' }} />
              {q}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={lbl}>Description *</label>
        <textarea name="description" value={form.description} onChange={set} required rows={5} style={{ ...inp, resize: 'vertical' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={lbl}>Eligibility Criteria</label>
        <textarea name="eligibility" value={form.eligibility} onChange={set} rows={3} style={{ ...inp, resize: 'vertical' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={lbl}>How to Apply</label>
        <textarea name="howToApply" value={form.howToApply} onChange={set} rows={3} style={{ ...inp, resize: 'vertical' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={lbl}>Selection Process (comma-separated)</label>
        <input name="selectionProcess" value={form.selectionProcess} onChange={set} placeholder="Written Exam, Physical Test, Interview" style={inp} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div><label style={lbl}>Official Website</label><input name="officialWebsite" type="url" value={form.officialWebsite} onChange={set} placeholder="https://..." style={inp} /></div>
        <div><label style={lbl}>Apply Link</label><input name="applyLink" type="url" value={form.applyLink} onChange={set} placeholder="https://..." style={inp} /></div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={lbl}>Notification PDF URL</label>
        <input name="notificationPdf" type="url" value={form.notificationPdf} onChange={set} placeholder="https://..." style={inp} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={lbl}>Tags (comma-separated)</label>
        <input name="tags" value={form.tags} onChange={set} placeholder="SSC, CGL, Graduate" style={inp} />
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, marginBottom: 20 }}>
        <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={set} />
        ⭐ Feature this job (shown prominently)
      </label>

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" disabled={loading} style={{ background: '#1B5E20', color: 'white', padding: '11px 24px', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving...' : job ? 'Update Job' : 'Post Job'}
        </button>
        <button type="button" onClick={() => router.back()} style={{ background: 'white', color: '#888', padding: '11px 20px', border: '1px solid #E0DDD5', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
          Cancel
        </button>
      </div>
    </form>
  )
}
