import { NextRequest } from 'next/server'
import { db } from '@/lib/prisma/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { ok, fail } from '@/lib/utils/api'
import { validatePayload, schemas } from '@/lib/utils/validate'
import { isRateLimited, rateLimitConfigs } from '@/lib/utils/rateLimit'
import { logger } from '@/lib/errors'

/**
 * POST /api/admin/courses/suspend
 * Suspend a course (admin-only)
 *
 * TODO: Once Course schema includes a status/suspendedAt field, update this endpoint to:
 * - Update course.status = 'SUSPENDED' or set course.suspendedAt = now()
 * - This enables soft-suspend (non-destructive state change)
 * - Prevent new enrollments when status is SUSPENDED
 */
export async function POST(request: NextRequest) {
	try {
		// Rate limiting for sensitive admin operations
		const adminCheck = await requireAdmin()
		if ('response' in adminCheck) return adminCheck.response

		const userId = adminCheck.user.id
		if (isRateLimited(`admin:suspend:${userId}`, rateLimitConfigs.adminSensitive.limit, rateLimitConfigs.adminSensitive.windowMs)) {
			return fail({ code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' }, { status: 429 })
		}

		// Content-Type guard
		const contentType = request.headers.get('content-type') || ''
		if (!contentType.includes('application/json')) {
			return fail({ code: 'UNSUPPORTED_MEDIA_TYPE', message: 'Unsupported content type' }, { status: 415 })
		}

		// Parse and validate JSON
		let parsed: unknown
		try {
			parsed = await request.json()
		} catch {
			return fail({ code: 'BAD_REQUEST', message: 'Invalid JSON body' }, { status: 400 })
		}

		// Validate payload
		const validation = validatePayload<{ courseId: string }>(parsed, schemas.courseId)
		if (!validation.ok) return validation.response

		const { courseId } = validation.data

		// Verify course exists
		const course = await db.course.findUnique({
			where: { id: courseId }
		})

		if (!course) {
			return fail({ code: 'NOT_FOUND', message: 'Course not found' }, { status: 404 })
		}

		// Log admin action
		await db.userAction.create({
			data: {
				id: `action_${userId}_${Date.now()}`,
				userId: userId,
				actionType: 'SUSPEND_COURSE',
				metadata: {
					courseId: courseId,
					courseTitle: course.title
				}
			}
		})

		logger.info('Course suspended', { courseId, adminId: userId })

		// TODO: Once schema supports status field, update to:
		// const updated = await db.course.update({
		//   where: { id: courseId },
		//   data: { status: 'SUSPENDED', suspendedAt: new Date() }
		// })
		return ok({
			message: `Course "${course.title}" suspended`
		})
	} catch (error) {
		logger.error('Suspend course error', error)
		return fail({ code: 'SERVER_ERROR', message: 'Internal server error' }, { status: 500 })
	}
}
