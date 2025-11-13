import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma/prisma'
import { UserRole, Permission } from '@/types/globals'
import { logger } from '@/lib/errors'

export interface AuthenticatedUser {
  id: string
  clerkId: string
  email: string
  name?: string
  role: UserRole
  permissions: Permission[]
}

/**
 * Get authenticated user with role and permissions from database
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return null

    const user = await db.user.findUnique({
      where: { clerkId }
    })

    if (!user) return null

    // Get permissions for user's role
    const rolePermissions = await db.rolePermission.findMany({
      where: { role: user.role },
      select: { permission: true }
    })

    const permissions = rolePermissions.map(rp => rp.permission)

    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name || undefined,
      role: user.role,
      permissions
    }
  } catch (error) {
    logger.error('getAuthenticatedUser failed', error)
    return null
  }
}

/**
 * Require authentication - returns user or throws error
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser()
  if (!user) {
    throw new Error('UNAUTHORIZED')
  }
  return user
}

/**
 * Check if user has specific role
 */
export function hasRole(user: AuthenticatedUser | null, role: UserRole): boolean {
  return user?.role === role
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: AuthenticatedUser | null, roles: UserRole[]): boolean {
  return user ? roles.includes(user.role) : false
}

/**
 * Check if user has specific permission
 */
export function hasPermission(user: AuthenticatedUser | null, permission: Permission): boolean {
  return user?.permissions.includes(permission) ?? false
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: AuthenticatedUser | null, permissions: Permission[]): boolean {
  return user ? permissions.some(p => user.permissions.includes(p)) : false
}

/**
 * Check if user has all specified permissions
 */
export function hasAllPermissions(user: AuthenticatedUser | null, permissions: Permission[]): boolean {
  return user ? permissions.every(p => user.permissions.includes(p)) : false
}