'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { getAuthenticatedUser } from '@/lib/auth/core'
import { UserRole, Permission } from '@/types/globals'

interface UseAuthReturn {
  user: any
  loading: boolean
  error: string | null
  hasRole: (role: UserRole) => boolean
  hasPermission: (permission: Permission) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
}

/**
 * Enhanced useAuth hook with role and permission checking
 */
export function useAuth(): UseAuthReturn {
  const { user: clerkUser, isLoaded } = useUser()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      if (!isLoaded || !clerkUser) {
        setLoading(false)
        return
      }

      try {
        const authenticatedUser = await getAuthenticatedUser()
        setUser(authenticatedUser)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [clerkUser, isLoaded])

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role
  }

  const hasPermission = (permission: Permission): boolean => {
    return user?.permissions?.includes(permission) ?? false
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false
  }

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return user ? permissions.some(p => user.permissions.includes(p)) : false
  }

  return {
    user,
    loading,
    error,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission
  }
}