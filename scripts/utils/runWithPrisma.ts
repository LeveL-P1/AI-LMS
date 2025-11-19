import { PrismaClient } from '@prisma/client';

export type PrismaScript<T = void> = (prisma: PrismaClient) => Promise<T>;

export async function runWithPrisma<T>(handler: PrismaScript<T>): Promise<T> {
  const prisma = new PrismaClient();

  try {
    return await handler(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

