// src/middleware.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const supabase = createClient()
  
  // Get the session
  const { data: { session } } = await supabase.auth.getSession()
  
  // Public routes
  const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password']
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    if (session) {
      // If user is logged in, redirect to dashboard
      const url = new URL('/dashboard', request.url)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!session) {
    // Redirect to sign-in if not authenticated
    const url = new URL('/sign-in', request.url)
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  // Get user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  // Role-based access control
  if (pathname.startsWith('/admin') && profile?.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  if (pathname.startsWith('/instructor') && !['admin', 'instructor'].includes(profile?.role || '')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}