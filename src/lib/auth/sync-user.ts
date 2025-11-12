import { db } from "@/lib/prisma/prisma";
import { currentUser } from "@clerk/nextjs/server";
import type { UserRole } from "@prisma/client";
import type { Prisma } from "@prisma/client";

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

  const existingUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });

  const userData: Prisma.UserCreateInput = {
    clerkId: user.id,
    email: user.emailAddresses[0].emailAddress,
    firstName: user.firstName || null,
    lastName: user.lastName || null,
    imageUrl: user.imageUrl || null,
    role,
  };

  if (!existingUser) {
    return await db.user.create({ data: userData });
  }

  return await db.user.update({
    where: { clerkId: user.id },
    data: userData,
  });
}
