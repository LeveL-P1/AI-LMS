'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { UserRole, Permission } from '@/types/globals'
import { ClerkProvider } from '@clerk/nextjs'

interface RoleGuardProps {
  children: ReactNode
  roles?: UserRole[]
  permissions?: Permission[]
  requireAll?: boolean // If true, user must have ALL specified roles/permissions
  fallback?: ReactNode
}

/**
 * RoleGuard - Conditionally renders children based on user roles/permissions
 */
export function RoleGuard({ 
  children, 
  roles = [], 
  permissions = [], 
  requireAll = false,
  fallback = null 
}: RoleGuardProps) {
  const { user, loading, hasRole, hasPermission, hasAnyRole, hasAnyPermission } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return fallback
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
 * AdminOnly - Renders children only for admin users
 */
export function AdminOnly({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <RoleGuard roles={['ADMIN']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

/**
 * InstructorOnly - Renders children only for instructors and admins
 */
export function InstructorOnly({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <RoleGuard roles={['ADMIN', 'INSTRUCTOR']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

/**
 * PermissionGuard - Renders children only if user has specific permission
 */
export function PermissionGuard({ 
  permission, 
  children, 
  fallback = null 
}: { 
  permission: Permission, 
  children: ReactNode, 
  fallback?: ReactNode 
}) {
  return (
    <RoleGuard permissions={[permission]} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}