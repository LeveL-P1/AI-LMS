import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface ClerkPublicMetadata {
  role?: string;
  onboardingCompleted?: boolean;
}

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  // Expose public course pages and the public courses API for unauthenticated smoke tests
  "/courses(.*)",
  "/api/courses(.*)",
  // Allow quiz pages and enrollments API to be reachable for local smoke tests
  // NOTE: This is intended for short-lived local testing. Remove before production.
  "/courses(.*)/quiz(.*)",
  "/api/enrollments(.*)",
]);

// Helper function to safely extract and normalize role from Clerk's publicMetadata
function getUserRole(sessionClaims: Record<string, unknown> | null): string {
  const metadata = sessionClaims?.publicMetadata as ClerkPublicMetadata | undefined;
  const roleValue = metadata?.role as string | undefined;
  return (roleValue || "student").toLowerCase();
}

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;

  // Protect all routes except public ones.
  // For API routes prefer returning 401 instead of redirecting to a sign-in page.
  if (!isPublicRoute(request)) {
    if (pathname.startsWith("/api")) {
      const { sessionClaims } = await auth();
      if (!sessionClaims) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    } else {
      await auth.protect();
    }
  }

  // Lazily fetch sessionClaims when role checks are needed
  let sessionClaims: Record<string, unknown> | null = null;
  if (
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/admin") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/")
  ) {
    const res = await auth();
    sessionClaims = res.sessionClaims as Record<string, unknown> | null;
  }

  // API admin protection: return 401 for non-admins
  if (pathname.startsWith("/api/admin")) {
    const userRole = getUserRole(sessionClaims);
    if (userRole !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  // UI admin protection: redirect non-admins away from /admin pages
  if (pathname.startsWith("/admin")) {
    const userRole = getUserRole(sessionClaims);
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Handle dashboard routing based on user role
  if (pathname === "/dashboard") {
    const userRole = getUserRole(sessionClaims);
    const validRoles = ["student", "instructor", "admin"];
    if (!validRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/dashboard/student", request.url));
    }

    return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
  }

  // Protect role-specific dashboard routes
  if (pathname.startsWith("/dashboard/")) {
    const userRole = getUserRole(sessionClaims);
    const pathSegments = pathname.split("/");
    const requestedRole = pathSegments[2];

    if (requestedRole === userRole) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}; 

