import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma/prisma'
import { logger } from '@/lib/errors'

export async function requireAdmin() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { ok: false as const, response: NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 }) }
    }

    const user = await db.user.findFirst({ where: { email: userId } })
    if (!user || user.role !== 'ADMIN') {
      return { ok: false as const, response: NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Admin access required' } }, { status: 403 }) }
    }
    return { ok: true as const, user }
  } catch (error) {
    logger.error('requireAdmin failed', error)
    return { ok: false as const, response: NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } }, { status: 500 }) }
  }
}
