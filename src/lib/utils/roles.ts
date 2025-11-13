import { UserRole } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'
import { ClerkProvider } from '@clerk/nextjs'

export const checkRole = async (role: UserRole) => {
  const { sessionClaims } = await auth()
  return sessionClaims?.metadata.role === role
}