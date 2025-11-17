/**
 * Production-Ready Protected Route Component
 * Fast role and permission-based access control
 */

'use client'

import { ReactNode } from 'react'
import { useSession } from '@/hooks/useSession'
import { UserRole, Permission } from '@/types/globals'

interface ProtectedRouteProps {
  children: ReactNode
  roles?: UserRole[]
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: ReactNode
  loadingFallback?: ReactNode
}

/**
 * ProtectedRoute - Conditionally renders based on role/permission
 */
export function ProtectedRoute({
  children,
  roles = [],
  permissions = [],
  requireAll = false,
  fallback = null,
  loadingFallback = <div>Loading...</div>
}: ProtectedRouteProps) {
  const { user, loading, hasRole, hasPermission, hasAnyRole, hasAnyPermission } = useSession()

  if (loading) {
    return <>{loadingFallback}</>
  }

  if (!user) {
    return <>{fallback}</>
  }

  let hasAccess = true

  // Check roles
  if (roles.length > 0) {
    if (requireAll) {
      hasAccess = roles.every(role => hasRole(role))
    } else {
      hasAccess = hasAnyRole(roles)
    }
  }

  // Check permissions
  if (hasAccess && permissions.length > 0) {
    if (requireAll) {
      hasAccess = permissions.every(permission => hasPermission(permission))
    } else {
      hasAccess = hasAnyPermission(permissions)
    }
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

/**
 * AdminOnly - Renders only for admin users
 */
export function AdminOnly({
  children,
  fallback = null,
  loadingFallback = <div>Loading...</div>
}: {
  children: ReactNode
  fallback?: ReactNode
  loadingFallback?: ReactNode
}) {
  return (
    <ProtectedRoute
      roles={['ADMIN']}
      fallback={fallback}
      loadingFallback={loadingFallback}
    >
      {children}
    </ProtectedRoute>
  )
}

/**
 * InstructorOnly - Renders for instructors and admins
 */
export function InstructorOnly({
  children,
  fallback = null,
  loadingFallback = <div>Loading...</div>
}: {
  children: ReactNode
  fallback?: ReactNode
  loadingFallback?: ReactNode
}) {
  return (
    <ProtectedRoute
      roles={['ADMIN', 'INSTRUCTOR']}
      fallback={fallback}
      loadingFallback={loadingFallback}
    >
      {children}
    </ProtectedRoute>
  )
}

/**
 * StudentOnly - Renders for all authenticated users
 */
export function StudentOnly({
  children,
  fallback = null,
  loadingFallback = <div>Loading...</div>
}: {
  children: ReactNode
  fallback?: ReactNode
  loadingFallback?: ReactNode
}) {
  return (
    <ProtectedRoute
      roles={['ADMIN', 'INSTRUCTOR', 'STUDENT']}
      fallback={fallback}
      loadingFallback={loadingFallback}
    >
      {children}
    </ProtectedRoute>
  )
}
