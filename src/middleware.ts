import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface SessionMetadata {
  role?: string;
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

export default clerkMiddleware(async (auth, request) => {
  // Protect all routes except public ones
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  const pathname = request.nextUrl.pathname;

  // Handle dashboard routing based on user role
  if (pathname === "/dashboard") {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as SessionMetadata)?.role as string | undefined;
    const userRole = role || "student";
    
    const validRoles = ["student", "instructor", "admin"];
    if (!validRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/dashboard/student", request.url));
    }

    return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
  }

  // Protect role-specific dashboard routes
  if (pathname.startsWith("/dashboard/")) {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as SessionMetadata)?.role as string | undefined;
    const userRole = role || "student";
    
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
// fixed and changes the routes and 