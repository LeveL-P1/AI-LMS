import { db } from "@/lib/prisma/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/types";
import type { Prisma } from "@prisma/client";

export async function syncUser() {
  const user = await currentUser();

  if (!user) return null;

  console.log("🔄 Syncing user:", user.id);

  const role = (user.publicMetadata?.role as UserRole) || UserRole.STUDENT;

  const existingUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });

  const userData: Prisma.UserCreateInput = {
    clerkId: user.id,
    email: user.emailAddresses[0].emailAddress,
    firstName: user.firstName || null,
    lastName: user.lastName || null,
    imageUrl: user.imageUrl || null,
    userRole: UserRole,
    };

  if (!existingUser) {
    return await db.user.create({ data: userData });
  }

  return await db.user.update({
    where: { clerkId: user.id },
    data: userData,
  });
}
