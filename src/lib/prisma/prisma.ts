import { PrismaClient } from '@prisma/client'

declare global {
  var __db: PrismaClient | undefined
}

// Handle both Node.js and browser environments
const getGlobal = () => {
  if (typeof global !== 'undefined') return global
  if (typeof window !== 'undefined') return window as any
  return {} as any
}

const globalObj = getGlobal()

export const db: PrismaClient = (globalObj.__db ?? new PrismaClient()) as PrismaClient

if (process.env.NODE_ENV !== 'production') {
  globalObj.__db = db
}

export default db
