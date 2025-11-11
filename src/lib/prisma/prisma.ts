import { PrismaClient } from '@prisma/client'


declare global {
  var __db: PrismaClient | undefined
}

export const db: PrismaClient = (global.__db ?? new PrismaClient()) as PrismaClient

if (process.env.NODE_ENV !== 'production') global.__db = db

export default db
