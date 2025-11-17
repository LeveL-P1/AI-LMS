
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma/prisma'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/sign-in',
  '/sign-up',
  '/onboarding',
  '/api/webhooks',
  '/api/webhooks/clerk',
  '/unauthorized',
  '/404',
  '/_next',
  '/favicon.ico',
  '/public'
]

// Role-based route access control
const ROLE_ROUTES: Record<string, string[]> = {
  // Dashboard routes
  '/dashboard/admin': ['ADMIN'],
  '/dashboard/instructor': ['ADMIN', 'INSTRUCTOR'],
  '/dashboard/student': ['ADMIN', 'INSTRUCTOR', 'STUDENT'],
  
  // API routes
  '/api/admin': ['ADMIN'],
  '/api/instructor': ['ADMIN', 'INSTRUCTOR'],
  '/api/student': ['ADMIN', 'INSTRUCTOR', 'STUDENT'],
  
  // Application routes
  '/courses': ['ADMIN', 'INSTRUCTOR', 'STUDENT'],
  '/courses/create': ['ADMIN', 'INSTRUCTOR'],
  '/settings': ['ADMIN', 'INSTRUCTOR', 'STUDENT'],
  
  // Onboarding routes (temporarily public during onboarding)
  '/onboarding': ['ADMIN', 'INSTRUCTOR', 'STUDENT']
}

// Cache configuration
const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 1000, // Max entries in cache
  CLEANUP_INTERVAL: 60 * 60 * 1000 // Cleanup every hour
}

// Cache for user roles with automatic cleanup
const roleCache = new Map<string, { role: string; timestamp: number }>()

// Cleanup expired cache entries
function cleanupCache() {
  const now = Date.now()
  let count = 0
  
  for (const [key, { timestamp }] of roleCache.entries()) {
    if (now - timestamp > CACHE_CONFIG.TTL) {
      roleCache.delete(key)
      count++
    }
  }
  
  if (count > 0) {
    console.log(`[CACHE] Cleaned up ${count} expired entries`)
  }
}

// Schedule periodic cleanup
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupCache, CACHE_CONFIG.CLEANUP_INTERVAL)
}

/**
 * Get user role from cache or database
 */
async function getUserRole(clerkId: string): Promise<string | null> {
  // Check cache first
  const cached = roleCache.get(clerkId)
  if (cached && Date.now() - cached.timestamp < CACHE_CONFIG.TTL) {
    return cached.role
  }

  // Fetch from database with error handling
  try {
    const user = await db.user.findUnique({
      where: { clerkId },
      select: { 
        role: true,
        status: true // Include status to check if user is active
      }
    })

    if (user) {
      // Check if user is active
      if (user.status !== 'ACTIVE') {
        console.warn(`[AUTH] Inactive user attempted access: ${clerkId}`)
        return null
      }

      // Update cache
      const roleData = {
        role: user.role,
        timestamp: Date.now()
      }
      
      // Enforce max cache size
      if (roleCache.size >= CACHE_CONFIG.MAX_SIZE) {
        // Remove oldest entries (first 10% of cache)
        const entries = Array.from(roleCache.entries())
          .sort((a, b) => a[1].timestamp - b[1].timestamp)
          .slice(0, Math.floor(CACHE_CONFIG.MAX_SIZE * 0.1))
        
        entries.forEach(([key]) => roleCache.delete(key))
        console.log(`[CACHE] Pruned ${entries.length} old entries`)
      }
      
      roleCache.set(clerkId, roleData)
      return user.role
    }
  } catch (error) {
    console.error('[AUTH] Error fetching user role:', error)
    // In case of database error, try to use cached value if available
    if (cached) {
      console.warn('[AUTH] Using cached role due to database error')
      return cached.role
    }
  }

  return null
}

/**
 * Invalidate role cache for a specific user
 */
export function invalidateRoleCache(clerkId: string) {
  return roleCache.delete(clerkId)
}

/**
 * Check if route is public
 */
function isPublicRoute(pathname: string): boolean {
  // Check exact matches first
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true
  }
  
  // Check path prefixes
  return PUBLIC_ROUTES.some(route => {
    // Handle API webhooks specially
    if (route.startsWith('/api/webhooks')) {
      return pathname.startsWith(route)
    }
    
    // For other routes, check if pathname starts with the route
    // but not if it's a partial match (e.g., '/api' shouldn't match '/api-key')
    return pathname === route || pathname.startsWith(`${route}/`)
  })
}

/**
 * Check if route requires authentication
 */
function requiresAuth(pathname: string): boolean {
  // Check if path matches any protected route
  return Object.keys(ROLE_ROUTES).some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
}

/**
 * Get required roles for a route
 */
function getRequiredRoles(pathname: string): string[] | null {
  // Find the most specific route match
  const matchedRoute = Object.entries(ROLE_ROUTES)
    .sort(([a], [b]) => b.length - a.length) // Sort by path length (longest first)
    .find(([route]) => pathname === route || pathname.startsWith(`${route}/`))
  
  return matchedRoute ? matchedRoute[1] : null
}

/**
 * Main proxy handler
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  try {
    // Check if route requires authentication
      if (!requiresAuth(pathname)) {
        return NextResponse.next()
      }

      // Get authenticated user from Clerk
      const { userId: clerkId } = await auth()

      // Handle unauthenticated users
      if (!clerkId) {
        console.log(`[AUTH] Unauthenticated access attempt to: ${pathname}`)
        const signInUrl = new URL('/sign-in', request.url)
        signInUrl.searchParams.set('redirect_url', pathname)
        return NextResponse.redirect(signInUrl)
      }

      // Get user role with caching
      const userRole = await getUserRole(clerkId)

      // Handle users not found in database
      if (!userRole) {
        console.warn(`[AUTH] User not found in database: ${clerkId}`)
        
        // Special handling for onboarding flow
        if (pathname.startsWith('/onboarding')) {
          return NextResponse.next()
        }
        
        // For other routes, redirect to sign-in
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }

      // Check role-based access
      const requiredRoles = getRequiredRoles(pathname)
      
      if (requiredRoles && !requiredRoles.includes(userRole)) {
        console.warn(`[AUTH] Unauthorized role access: ${userRole} to ${pathname}`)
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      // Add security headers
      const securityHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https:;"
      }

      // Add user info to headers for downstream use
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', clerkId)
      requestHeaders.set('x-user-role', userRole)
      
      // Add security headers
      Object.entries(securityHeaders).forEach(([key, value]) => {
        requestHeaders.set(key, value)
      })

      const response = NextResponse.next({
        request: {
          headers: requestHeaders
        }
      })
      
      // Add security headers to response
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      return response
    } catch (error) {
      console.error('[AUTH] Error in proxy middleware:', error)
      
      // In case of errors, allow access to error pages
      if (pathname.startsWith('/_error') || pathname.startsWith('/500')) {
        return NextResponse.next()
      }
      
      // Redirect to error page for other errors
      const errorUrl = new URL('/500', request.url)
      errorUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(errorUrl)
    }
  }

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

// Utility function to check if a user has required role
export async function checkUserRole(userId: string, requiredRole: string): Promise<boolean> {
  if (!userId) return false
  
  const userRole = await getUserRole(userId)
  if (!userRole) return false
  
  // Role hierarchy: ADMIN > INSTRUCTOR > STUDENT
  const roleHierarchy = {
    'ADMIN': 3,
    'INSTRUCTOR': 2,
    'STUDENT': 1
  }
  
  return (roleHierarchy[userRole as keyof typeof roleHierarchy] || 0) >= 
         (roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0)
}