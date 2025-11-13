import { db } from "@/lib/prisma/prisma";
import { currentUser } from "@clerk/nextjs/server";
import type { UserRole } from "@prisma/client";

export async function syncUser() {
  const user = await currentUser();
  if (!user) return null;

  // Normalize role from Clerk metadata (stored as lowercase) to Prisma enum (UPPERCASE)
  const roleString = (user.publicMetadata?.role as string) || "student";
  const normalizedRole = roleString.toUpperCase();
  
  // Validate that the normalized role is a valid enum value
  const validRoles: UserRole[] = ["ADMIN", "INSTRUCTOR", "STUDENT"];
  const role: UserRole = (validRoles.includes(normalizedRole as UserRole) 
    ? normalizedRole as UserRole 
    : "STUDENT");

  // Use upsert to handle both create and update cases using email as the unique identifier
  // Let Prisma auto-generate updatedAt and createdAt
  return await db.user.upsert({
    where: { email: user.emailAddresses[0]?.emailAddress || "" },
    update: {
      name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      role,
    },
    create: {
      id: user.id, // Use Clerk user ID as the primary key
      email: user.emailAddresses[0]?.emailAddress || "",
      name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      role,
    },
  });
}
