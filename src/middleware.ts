import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Public routes - no auth required
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/courses',
  '/courses/(.*)',
  '/api/courses',
])

// Admin routes - admin role required
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

// Instructor routes - instructor or admin role required
const isInstructorRoute = createRouteMatcher([
  '/instructor(.*)',
  '/dashboard/instructor(.*)',
])

// Student routes - student, instructor, or admin role required
const isStudentRoute = createRouteMatcher([
  '/student(.*)',
  '/dashboard/student(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Protect all other routes - require authentication
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  // Get user role from Clerk metadata
  const userRole = ((sessionClaims?.metadata as Record<string, unknown>)?.role as string || 'STUDENT').toUpperCase()

  // Check admin routes
  if (isAdminRoute(req)) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // Check instructor routes
  if (isInstructorRoute(req)) {
    if (userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // Check student routes
  if (isStudentRoute(req)) {
    if (!['STUDENT', 'INSTRUCTOR', 'ADMIN'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest))(?:.*)|api|trpc)(.*)',
  ],
}
