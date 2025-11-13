import { db } from "@/lib/prisma/prisma";
import { currentUser } from "@clerk/nextjs/server";
import type { UserRole } from "@prisma/client";
import { ClerkProvider } from '@clerk/nextjs'

export async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Normalize role from Clerk metadata (stored as lowercase) to Prisma enum (UPPERCASE)
  const roleString = (clerkUser.publicMetadata?.role as string) || "student";
  const normalizedRole = roleString.toUpperCase();
  
  // Validate that the normalized role is a valid enum value
  const validRoles: UserRole[] = ["ADMIN", "INSTRUCTOR", "STUDENT"];
  const role: UserRole = (validRoles.includes(normalizedRole as UserRole) 
    ? normalizedRole as UserRole 
    : "STUDENT");

  // Use upsert to handle both create and update cases using clerkId as the unique identifier
  return await db.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      role,
    },
    create: {
      id: `user_${clerkUser.id}`, // Generate ID if not provided
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      role,
    },
  });
}
