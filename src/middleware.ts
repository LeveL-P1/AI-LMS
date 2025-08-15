
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define route matchers for different protection levels
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/courses(.*)',
  '/api/assignments(.*)',
  '/api/quizzes(.*)',
  '/api/progress(.*)',
  '/api/analytics(.*)'
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook(.*)', // For external webhooks
  '/pricing',
  '/features',
  '/about'
])

// API routes that need role-based access
const isInstructorRoute = createRouteMatcher([
  '/api/courses/create',
  '/api/courses/edit/(.*)',
  '/api/assignments/create',
  '/api/analytics/instructor(.*)',
  '/dashboard/instructor(.*)'
])

const isAdminRoute = createRouteMatcher([
  '/api/admin(.*)',
  '/dashboard/admin(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Redirect to sign-in if not authenticated on protected routes
  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  // Role-based protection
  if (userId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (sessionClaims?.metadata as any)?.role as string || 'student'

    // Protect instructor routes
    if (isInstructorRoute(req) && !['instructor', 'admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/dashboard/unauthorized', req.url))
    }

    // Protect admin routes  
    if (isAdminRoute(req) && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/unauthorized', req.url))
    }

    // Redirect users to appropriate dashboard based on role
    if (req.nextUrl.pathname === '/dashboard') {
      switch (userRole) {
        case 'admin':
          return NextResponse.redirect(new URL('/dashboard/admin', req.url))
        case 'instructor':
          return NextResponse.redirect(new URL('/dashboard/instructor', req.url))
        case 'student':
        default:
          return NextResponse.redirect(new URL('/dashboard/student', req.url))
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

