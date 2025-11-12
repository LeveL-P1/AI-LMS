

"use client"

import { useUser as useClerkUser } from "@clerk/nextjs";
import { UserRole } from "@/types";

export function useUser() {
  const { user, isLoaded, isSignedIn } = useClerkUser();

  // Get role from public metadata and normalize to enum
  // Clerk stores role as lowercase string (e.g., "admin", "instructor", "student")
  const roleString = (user?.publicMetadata?.role as string) || "student";
  const normalizedRoleString = roleString.toUpperCase();
  
  // Ensure it's a valid UserRole enum value
  const validRoles = Object.values(UserRole);
  const role = (validRoles.includes(normalizedRoleString as UserRole) 
    ? normalizedRoleString as UserRole 
    : UserRole.STUDENT);

  return {
    user,
    isLoaded,
    isSignedIn,
    role,
    isStudent: role === UserRole.STUDENT,
    isInstructor: role === UserRole.INSTRUCTOR,
    isAdmin: role === UserRole.ADMIN,
    // Convenient user data access
    firstName: user?.firstName,
    lastName: user?.lastName,
    fullName: user?.fullName,
    email: user?.emailAddresses?.[0]?.emailAddress,
    imageUrl: user?.imageUrl,
    clerkId: user?.id,
  };
}

