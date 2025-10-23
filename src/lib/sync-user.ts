/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "./db";
import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/types"

export async function syncUser() {
  const user = await currentUser();

  if (!user) return null;

  console.log("🔄 Syncing user:", user.id);

  // Get role from public metadata, default to STUDENT
  const role = (user.publicMetadata?.role as UserRole) || UserRole.STUDENT;

  // Check if user exists in database
  const existingUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });

  // If user doesn't exist, create them
  if (!existingUser) {
    return await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        imageUrl: user.imageUrl || null,
        role: (user.publicMetadata?.role as any) || "STUDENT",
      },
    });
  }

  // Update existing user
  return await db.user.update({
    where: { clerkId: user.id },
    data: {
      email: user.emailAddresses[0].emailAddress,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      imageUrl: user.imageUrl || null,
      role: (user.publicMetadata?.role as any) || "STUDENT",
    },
  });
}
