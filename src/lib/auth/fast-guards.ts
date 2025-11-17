/**
 * Fast, Production-Ready API Guards
 * Optimized for performance with minimal database queries
 */

import { NextResponse } from 'next/server'
import { getSession, SessionUser } from '@/lib/auth/session'
import { UserRole, Permission } from '@/types/globals'

// Response builders for consistency
const createErrorResponse = (code: string, message: string, status: number) =>
  NextResponse.json(
    {
      error: {
        code,
        message,
        timestamp: new Date().toISOString()
      }
    },
    { status }
  )

const createSuccessResponse = (data: any) =>
  NextResponse.json(data)

/**
 * Guard: Ensure user is authenticated
 * Returns: SessionUser or NextResponse error
 */
export async function requireAuth(): Promise<SessionUser | NextResponse> {
  const session = await getSession()
  if (!session) {
    return createErrorResponse('UNAUTHORIZED', 'Authentication required', 401)
  }
  return session
}

/**
 * Guard: Ensure user has specific role
 */
export async function requireRole(
  role: UserRole
): Promise<SessionUser | NextResponse> {
  const session = await getSession()
  if (!session) {
    return createErrorResponse('UNAUTHORIZED', 'Authentication required', 401)
  }
  if (session.role !== role) {
    return createErrorResponse(
      'FORBIDDEN',
      `Access denied. Required role: ${role}`,
      403
    )
  }
  return session
}

/**
 * Guard: Ensure user has any of the specified roles
 */
export async function requireAnyRole(
  roles: UserRole[]
): Promise<SessionUser | NextResponse> {
  const session = await getSession()
  if (!session) {
    return createErrorResponse('UNAUTHORIZED', 'Authentication required', 401)
  }
  if (!roles.includes(session.role)) {
    return createErrorResponse(
      'FORBIDDEN',
      `Access denied. Required roles: ${roles.join(', ')}`,
      403
    )
  }
  return session
}

/**
 * Guard: Ensure user has specific permission
 */
export async function requirePermission(
  permission: Permission
): Promise<SessionUser | NextResponse> {
  const session = await getSession()
  if (!session) {
    return createErrorResponse('UNAUTHORIZED', 'Authentication required', 401)
  }
  if (!session.permissions.includes(permission)) {
    return createErrorResponse(
      'FORBIDDEN',
      `Access denied. Required permission: ${permission}`,
      403
    )
  }
  return session
}

/**
 * Guard: Ensure user has any of the specified permissions
 */
export async function requireAnyPermission(
  permissions: Permission[]
): Promise<SessionUser | NextResponse> {
  const session = await getSession()
  if (!session) {
    return createErrorResponse('UNAUTHORIZED', 'Authentication required', 401)
  }
  const hasPermission = permissions.some(p => session.permissions.includes(p))
  if (!hasPermission) {
    return createErrorResponse(
      'FORBIDDEN',
      `Access denied. Required permissions: ${permissions.join(', ')}`,
      403
    )
  }
  return session
}

/**
 * Guard: Ensure user has all specified permissions
 */
export async function requireAllPermissions(
  permissions: Permission[]
): Promise<SessionUser | NextResponse> {
  const session = await getSession()
  if (!session) {
    return createErrorResponse('UNAUTHORIZED', 'Authentication required', 401)
  }
  const hasAllPermissions = permissions.every(p =>
    session.permissions.includes(p)
  )
  if (!hasAllPermissions) {
    return createErrorResponse(
      'FORBIDDEN',
      `Access denied. Required all permissions: ${permissions.join(', ')}`,
      403
    )
  }
  return session
}

/**
 * Type guard to check if result is NextResponse (error)
 */
export function isErrorResponse(
  result: SessionUser | NextResponse
): result is NextResponse {
  return result instanceof NextResponse
}

/**
 * Type guard to check if result is SessionUser (success)
 */
export function isSessionUser(
  result: SessionUser | NextResponse
): result is SessionUser {
  return !(result instanceof NextResponse)
}
