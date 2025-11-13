

"use client"

import { useUser as useClerkUser } from "@clerk/nextjs";
import { UserRole } from "@/types";
import { ClerkProvider } from '@clerk/nextjs'

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
    id: user?.id,
    email: user?.emailAddresses[0]?.emailAddress,
    name: user?.fullName,
    role: user?.publicMetadata?.role,
    imageUrl: user?.imageUrl,
  };
}

