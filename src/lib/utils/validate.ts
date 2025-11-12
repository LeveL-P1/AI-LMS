import { z, ZodSchema } from 'zod'
import { fail } from './api'

/**
 * Validates a payload against a zod schema.
 * Returns a standardized BAD_REQUEST error response on validation failure.
 * Returns the parsed data on success.
 */
export function validatePayload<T>(
  payload: unknown,
  schema: ZodSchema
): { ok: true; data: T } | { ok: false; response: ReturnType<typeof fail> } {
  try {
    const parsed = schema.parse(payload) as T
    return { ok: true, data: parsed }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
      return {
        ok: false,
        response: fail({ code: 'BAD_REQUEST', message: `Validation failed: ${message}` }, { status: 400 })
      }
    }
    return {
      ok: false,
      response: fail({ code: 'BAD_REQUEST', message: 'Invalid payload' }, { status: 400 })
    }
  }
}

/**
 * Common zod schemas for reuse across routes
 */
export const schemas = {
  courseId: z.object({
    courseId: z.string().min(1, 'courseId must be a non-empty string')
  }),
  userId: z.object({
    userId: z.string().min(1, 'userId must be a non-empty string')
  }),
  settingsUpdate: z.object({
    section: z.enum(['general', 'security', 'maintenance']),
    platformName: z.string().optional(),
    supportEmail: z.string().email().optional(),
    maxEnrollmentPerCourse: z.number().positive().optional(),
    requireMFA: z.boolean().optional(),
    sessionTimeout: z.number().positive().optional(),
    passwordMinLength: z.number().positive().optional(),
    maintenanceMode: z.boolean().optional(),
    maintenanceMessage: z.string().optional()
  }).strict()
}
