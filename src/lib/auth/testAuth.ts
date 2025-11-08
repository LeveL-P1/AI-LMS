import { auth } from '@clerk/nextjs/server'
import { headers } from 'next/headers'

/**
 * When TEST_BYPASS_AUTH=1, allow overriding the authenticated user with the
 * `x-bypass-auth` header. The header value should be the Clerk `clerkId` of a
 * seeded test user. This is intended for local/CI testing only.
 */
export async function getTestBypassUserId(): Promise<string | null> {
  if (process.env.TEST_BYPASS_AUTH !== '1') return null
  try {
    // `headers()` may be a Promise depending on Next version/types
    const h = await headers()
    const bypass = (h.get && (h.get('x-bypass-auth') || h.get('x-test-user'))) ?? null
    return bypass || null
  } catch {
    return null
  }
}

export async function getUserIdOrBypass(): Promise<string | null> {
  try {
    const { userId } = await auth()
    if (userId) return userId
  } catch {
    // ignore
  }

  return getTestBypassUserId()
}

export default getUserIdOrBypass

