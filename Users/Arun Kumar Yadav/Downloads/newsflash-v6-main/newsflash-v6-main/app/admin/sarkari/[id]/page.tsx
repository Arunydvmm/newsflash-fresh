'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import AdminShell from '../../../components/admin/AdminShell'
import SarkariJobForm from '../../../components/admin/SarkariJobForm'

export default function EditSarkariJobPage() {
  const { id } = useParams()
  const [job, setJob]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/sarkari/${id}`)
      .then(r => r.json())
      .then(d => { setJob(d); setLoading(false) })
  }, [id])

  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Edit Job</h1>
        </div>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#aaa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Loading...</div>
        ) : (
          <SarkariJobForm job={job} />
        )}
      </div>
    </AdminShell>
  )
}
