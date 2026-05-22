import { redirect } from 'next/navigation'
import { getAuth } from '@/lib/auth'
import AdminShell from '@/components/admin/AdminShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Login page itself doesn't need auth check
  return <>{children}</>
}
