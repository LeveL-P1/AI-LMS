

"use client"

import { useUser as useClerkUser } from "@clerk/nextjs";
import { UserRole } from "@/types";

export function useUser() {
  const { user, isLoaded, isSignedIn } = useClerkUser();

  // Get role from public metadata and normalize to uppercase
  const roleString = ((user?.publicMetadata?.role as string) || "STUDENT").toUpperCase();
  
  // Ensure it's a valid UserRole enum value
  const validRoles = Object.values(UserRole);
  const role = (validRoles.includes(roleString as UserRole) 
    ? roleString as UserRole 
    : UserRole.STUDENT);

  return {
    id: user?.id,
    email: user?.emailAddresses[0]?.emailAddress,
    fullName: user?.fullName,
    firstName: user?.firstName,
    lastName: user?.lastName,
    role,
    imageUrl: user?.imageUrl,
    isLoaded,
    isSignedIn,
  };
}

