import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma/prisma'
import { UserRole } from '@/types/globals'

// Define role-based route access
const roleRoutes: Record<string, UserRole[]> = {
  '/admin': ['ADMIN'],
  '/instructor': ['ADMIN', 'INSTRUCTOR'],
  '/student': ['ADMIN', 'INSTRUCTOR', 'STUDENT'],
  '/dashboard/admin': ['ADMIN'],
  '/dashboard/instructor': ['ADMIN', 'INSTRUCTOR'],
  '/dashboard/student': ['ADMIN', 'INSTRUCTOR', 'STUDENT'],
  '/api/admin': ['ADMIN'],
  '/api/instructor': ['ADMIN', 'INSTRUCTOR'],
  '/api/student': ['ADMIN', 'INSTRUCTOR', 'STUDENT']
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  const publicRoutes = ['/', '/sign-in', '/sign-up', '/api/webhooks', '/unauthorized']
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check if route requires authentication
  const requiresAuth = Object.keys(roleRoutes).some(route => pathname.startsWith(route))
  
  if (!requiresAuth) {
    return NextResponse.next()
  }

  // Get authenticated user from Clerk
  const { userId: clerkId } = await auth()
  
  if (!clerkId) {
    // Redirect to sign-in if not authenticated
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Get user from database
  const user = await db.user.findUnique({
    where: { clerkId }
  })
  
  if (!user) {
    // Redirect to sign-in if user not found in database
    const signInUrl = new URL('/sign-in', request.url)
    return NextResponse.redirect(signInUrl)
  }

  // Check role-based access
  const allowedRoles = Object.entries(roleRoutes).find(([route]) => pathname.startsWith(route))?.[1]
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page if role doesn't match
    const unauthorizedUrl = new URL('/unauthorized', request.url)
    return NextResponse.redirect(unauthorizedUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (favicon file)
     * - public (public files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}