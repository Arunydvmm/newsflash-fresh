// @ts-nocheck
import AdminShell from '../../../components/admin/AdminShell'
import SarkariJobForm from '../../../components/admin/SarkariJobForm'

export default function NewSarkariJobPage() {
  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>Post New Job</h1>
          <p style={{ color: '#888', fontSize: 12, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>Add a new Sarkari Naukri listing</p>
        </div>
        <SarkariJobForm />
      </div>
    </AdminShell>
  )
}
