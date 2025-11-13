import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/core'
import { UserRole, Permission } from '@/types/globals'

/**
 * API Route Guard - Ensures user is authenticated
 */
export async function requireAuth() {
  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }
  return user
}

/**
 * Role-based API Guard - Ensures user has specific role
 */
export async function requireRole(role: UserRole) {
  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }
  
  if (user.role !== role) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: `Role '${role}' required` } },
      { status: 403 }
    )
  }
  
  return user
}

/**
 * Multiple Role Guard - Ensures user has any of the specified roles
 */
export async function requireAnyRole(roles: UserRole[]) {
  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }
  
  if (!roles.includes(user.role)) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: `One of roles [${roles.join(', ')}] required` } },
      { status: 403 }
    )
  }
  
  return user
}

/**
 * Permission-based API Guard - Ensures user has specific permission
 */
export async function requirePermission(permission: Permission) {
  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }
  
  if (!user.permissions.includes(permission)) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: `Permission '${permission}' required` } },
      { status: 403 }
    )
  }
  
  return user
}

/**
 * Multiple Permission Guard - Ensures user has any of the specified permissions
 */
export async function requireAnyPermission(permissions: Permission[]) {
  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }
  
  const hasPermission = permissions.some(p => user.permissions.includes(p))
  if (!hasPermission) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: `One of permissions [${permissions.join(', ')}] required` } },
      { status: 403 }
    )
  }
  
  return user
}

/**
 * All Permissions Guard - Ensures user has all specified permissions
 */
export async function requireAllPermissions(permissions: Permission[]) {
  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }
  
  const hasAllPermissions = permissions.every(p => user.permissions.includes(p))
  if (!hasAllPermissions) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: `All permissions [${permissions.join(', ')}] required` } },
      { status: 403 }
    )
  }
  
  return user
}