/**
 * Session Management with In-Memory Caching
 * Optimized for fast role-based authentication
 * Production-ready with TTL and memory management
 */

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma/prisma'
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

interface CachedSession {
  user: SessionUser
  timestamp: number
}

// In-memory cache with TTL (5 minutes)
const SESSION_CACHE = new Map<string, CachedSession>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Role-to-permissions mapping (cached at startup)
const ROLE_PERMISSIONS_CACHE = new Map<UserRole, Permission[]>()
let permissionsCacheLoaded = false

/**
 * Clear expired sessions from cache
 */
function cleanupExpiredSessions() {
  const now = Date.now()
  for (const [key, session] of SESSION_CACHE.entries()) {
    if (now - session.timestamp > CACHE_TTL) {
      SESSION_CACHE.delete(key)
    }
  }
}

/**
 * Load role-permission mappings into cache
 */
async function loadPermissionsCache() {
  if (permissionsCacheLoaded) return

  try {
    const rolePermissions = await db.rolePermission.findMany({
      select: { role: true, permission: true }
    })

    // Group permissions by role
    const grouped = new Map<UserRole, Permission[]>()
    for (const rp of rolePermissions) {
      if (!grouped.has(rp.role)) {
        grouped.set(rp.role, [])
      }
      grouped.get(rp.role)!.push(rp.permission as Permission)
    }

    ROLE_PERMISSIONS_CACHE.clear()
    for (const [role, permissions] of grouped) {
      ROLE_PERMISSIONS_CACHE.set(role, permissions)
    }

    permissionsCacheLoaded = true
  } catch (error) {
    console.error('Failed to load permissions cache:', error)
  }
}

/**
 * Get cached permissions for a role
 */
function getCachedPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS_CACHE.get(role) || []
}

/**
 * Get current authenticated session
 * Uses in-memory cache for performance
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return null

    // Check cache first
    const cached = SESSION_CACHE.get(clerkId)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.user
    }

    // Cleanup expired sessions periodically
    if (Math.random() < 0.1) {
      cleanupExpiredSessions()
    }

    // Fetch from database
    const user = await db.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        role: true,
        imageUrl: true,
        createdAt: true
      }
    })

    if (!user) return null

    // Ensure permissions cache is loaded
    await loadPermissionsCache()

    // Get permissions from cache
    const permissions = getCachedPermissions(user.role)

    const sessionUser: SessionUser = {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      permissions,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt
    }

    // Cache the session
    SESSION_CACHE.set(clerkId, {
      user: sessionUser,
      timestamp: Date.now()
    })

    return sessionUser
  } catch (error) {
    console.error('Failed to get session:', error)
    return null
  }
}

/**
 * Invalidate session cache for a user
 * Called after role changes
 */
export function invalidateSessionCache(clerkId: string) {
  SESSION_CACHE.delete(clerkId)
}

/**
 * Invalidate all session caches
 * Called after permission updates
 */
export function invalidateAllSessionCaches() {
  SESSION_CACHE.clear()
  ROLE_PERMISSIONS_CACHE.clear()
  permissionsCacheLoaded = false
}

/**
 * Get cache statistics (for monitoring)
 */
export function getCacheStats() {
  return {
    sessionCacheSize: SESSION_CACHE.size,
    permissionsCacheLoaded,
    permissionsCacheSize: ROLE_PERMISSIONS_CACHE.size
  }
}
