/**
 * Simple in-memory rate limiter for development and testing.
 * TODO: Replace with Redis/Upstash for production deployments.
 *
 * This implementation tracks request counts per key (e.g., userId or IP)
 * within a time window and returns true if the limit is exceeded.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

/**
 * Check if a key has exceeded the rate limit.
 * @param key - Unique identifier (e.g., userId, IP address)
 * @param limit - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns true if limit exceeded, false otherwise
 */
export function isRateLimited(key: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    // Create new entry or reset expired one
    store.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  // Increment count
  entry.count++

  // Check if limit exceeded
  if (entry.count > limit) {
    return true
  }

  return false
}

/**
 * Reset rate limit for a specific key (useful for testing or manual resets).
 */
export function resetRateLimit(key: string): void {
  store.delete(key)
}

/**
 * Clear all rate limit entries (useful for testing).
 */
export function clearAllRateLimits(): void {
  store.clear()
}

/**
 * Get current rate limit status for a key (for debugging).
 */
export function getRateLimitStatus(key: string): { count: number; resetAt: number } | null {
  return store.get(key) || null
}

/**
 * Predefined rate limit configurations for common scenarios.
 */
export const rateLimitConfigs = {
  // Sensitive admin operations: 5 requests per minute
  adminSensitive: { limit: 5, windowMs: 60000 },
  // General admin operations: 20 requests per minute
  adminGeneral: { limit: 20, windowMs: 60000 },
  // API endpoints: 100 requests per minute
  api: { limit: 100, windowMs: 60000 },
  // Auth endpoints: 10 requests per minute
  auth: { limit: 10, windowMs: 60000 }
}
