import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromClerk } from '../../../lib/auth';

// Middleware for verifying user roles and permissions
export async function middleware(request: NextRequest) {
  const user = await getUserFromClerk(request);
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { pathname } = request.nextUrl;

  // Example: Protect API routes based on user role and permissions
  if (pathname.startsWith('/api/admin')) {
    if (user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  // You can add additional permission checks here

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
};

// lib/auth.ts helper example
import { clerkClient } from '@clerk/nextjs/server';

export async function getUserFromClerk(request: NextRequest) {
  const sessionId = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!sessionId) return null;

  const session = await clerkClient.sessions.getSession(sessionId);
  if (!session) return null;

  const userId = session.userId;

  // Fetch extended user info including role from your database (Prisma)
  // (Example assumes you have a User model with role field)
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) return null;

  return user;
}
