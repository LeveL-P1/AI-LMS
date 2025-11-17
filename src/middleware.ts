import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/onboarding',
  '/api/webhooks/clerk',
  '/unauthorized',
  '/404',
  '/_next',
  '/favicon.ico',
  '/public',
  '/api/trpc/(.*)'
];

// Define protected routes and their required roles
const protectedRoutes = [
  { path: '/dashboard/admin', roles: ['admin'] },
  { path: '/dashboard/instructor', roles: ['admin', 'instructor'] },
  { path: '/dashboard/student', roles: ['admin', 'instructor', 'student'] },
  { path: '/api/admin', roles: ['admin'] },
  { path: '/api/instructor', roles: ['admin', 'instructor'] },
  { path: '/api/student', roles: ['admin', 'instructor', 'student'] },
  { path: '/courses', roles: ['admin', 'instructor', 'student'] },
  { path: '/courses/create', roles: ['admin', 'instructor'] },
  { path: '/settings', roles: ['admin', 'instructor', 'student'] }
];

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims: sessionClaims } = await auth();
  const { pathname } = req.nextUrl;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || 
    pathname.startsWith(route.replace(/\*$/, ''))
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If user is not signed in, redirect to sign-in
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // If user is signed in and on the sign-in or sign-up page, redirect to dashboard
  if (pathname === '/sign-in' || pathname === '/sign-up') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Check if user has access to the requested route
  const userRole = sessionClaims?.metadata?.role?.toLowerCase() || 'student';
  const routeConfig = protectedRoutes.find(route => 
    pathname.startsWith(route.path)
  );

  // If no role is found, redirect to onboarding
  if (!sessionClaims?.metadata?.role && !pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // Check role-based access for protected routes
  if (routeConfig && !routeConfig.roles.includes(userRole)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/(api|trpc)(.*)'
  ],
};
