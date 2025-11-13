import { requireRole } from '@/lib/auth/guards'
import { UserRole } from '@/types/globals'
import { ClerkProvider } from '@clerk/nextjs'

export async function requireAdmin() {
  return requireRole('ADMIN' as UserRole)
}
