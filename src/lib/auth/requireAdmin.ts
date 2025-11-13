import { requireRole } from '@/lib/auth/guards'
import { UserRole } from '@/types/globals'

export async function requireAdmin() {
  return requireRole('ADMIN' as UserRole)
}
