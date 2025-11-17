/**
 * Production-Ready useSession Hook
 * Optimized for performance with client-side caching
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { UserRole, Permission } from '@/types/globals'

export interface SessionUser {
  id: string
  clerkId: string
  email: string
  name: string | null
  role: UserRole
  permissions: Permission[]
  imageUrl: string | null
  createdAt: Date
}

interface UseSessionReturn {
  user: SessionUser | null
  loading: boolean
  error: Error | null
  isAuthenticated: boolean
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
  refetch: () => Promise<void>
}

// Client-side cache
const sessionCache = new Map<string, { user: SessionUser; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch session from API
 */
async function fetchSession(): Promise<SessionUser | null> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      if (response.status === 401) {
        return null
      }
      throw new Error(`Failed to fetch session: ${response.statusText}`)
    }

    const data = await response.json()
    return data.user || null
  } catch (error) {
    console.error('Error fetching session:', error)
    return null
  }
}

/**
 * Production-ready useSession hook
 */
export function useSession(): UseSessionReturn {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const isMountedRef = useRef(true)

  // Fetch session
  const fetchAndSetSession = useCallback(async () => {
    if (!clerkLoaded || !clerkUser) {
      if (isMountedRef.current) {
        setUser(null)
        setLoading(false)
      }
      return
    }

    try {
      // Check cache first
      const cacheKey = clerkUser.id
      const cached = sessionCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        if (isMountedRef.current) {
          setUser(cached.user)
          setLoading(false)
        }
        return
      }

      // Fetch from API
      const sessionUser = await fetchSession()

      if (isMountedRef.current) {
        if (sessionUser) {
          sessionCache.set(cacheKey, {
            user: sessionUser,
            timestamp: Date.now()
          })
          setUser(sessionUser)
        } else {
          setUser(null)
        }
        setError(null)
        setLoading(false)
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setLoading(false)
      }
    }
  }, [clerkUser, clerkLoaded])

  // Setup effect
  useEffect(() => {
    isMountedRef.current = true
    fetchAndSetSession()

    return () => {
      isMountedRef.current = false
    }
  }, [fetchAndSetSession])

  // Helper functions
  const hasRole = useCallback(
    (role: UserRole): boolean => user?.role === role,
    [user]
  )

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => (user ? roles.includes(user.role) : false),
    [user]
  )

  const hasPermission = useCallback(
    (permission: Permission): boolean =>
      user?.permissions.includes(permission) ?? false,
    [user]
  )

  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean =>
      user ? permissions.some(p => user.permissions.includes(p)) : false,
    [user]
  )

  const hasAllPermissions = useCallback(
    (permissions: Permission[]): boolean =>
      user ? permissions.every(p => user.permissions.includes(p)) : false,
    [user]
  )

  const refetch = useCallback(async () => {
    if (clerkUser) {
      sessionCache.delete(clerkUser.id)
    }
    await fetchAndSetSession()
  }, [clerkUser, fetchAndSetSession])

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refetch
  }
}
