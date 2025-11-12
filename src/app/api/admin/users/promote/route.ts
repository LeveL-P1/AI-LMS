import { NextRequest } from 'next/server'
import { db } from '@/lib/prisma/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { ok, fail } from '@/lib/utils/api'
import { validatePayload, schemas } from '@/lib/utils/validate'
import { isRateLimited, rateLimitConfigs } from '@/lib/utils/rateLimit'
import { logger } from '@/lib/errors'

/**
 * POST /api/admin/users/promote
 * Promote a user to INSTRUCTOR role (admin-only)
 */
export async function POST(request: NextRequest) {
	try {
		const adminCheck = await requireAdmin()
		if (!('ok' in adminCheck) || adminCheck.ok === false) return adminCheck.response

		const userId = adminCheck.user.id

		// Rate limiting for sensitive user operations
		if (isRateLimited(`admin:promote:${userId}`, rateLimitConfigs.adminSensitive.limit, rateLimitConfigs.adminSensitive.windowMs)) {
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
		const validation = validatePayload<{ userId: string }>(parsed, schemas.userId)
		if (!validation.ok) return validation.response

		const { userId: targetUserId } = validation.data

		// Prevent promoting admins
		const targetUser = await db.user.findUnique({
			where: { id: targetUserId }
		})

		if (!targetUser) {
			return fail({ code: 'NOT_FOUND', message: 'User not found' }, { status: 404 })
		}

		if (targetUser.role === 'ADMIN') {
			return fail({ code: 'BAD_REQUEST', message: 'Cannot promote admin users' }, { status: 400 })
		}

		// Update user role to INSTRUCTOR
		const updatedUser = await db.user.update({
			where: { id: targetUserId },
			data: { role: 'INSTRUCTOR' }
		})

		// Log admin action
		await db.userAction.create({
			data: {
				userId: userId,
				actionType: 'PROMOTE_TO_INSTRUCTOR',
				metadata: {
					targetUserId: targetUserId,
					targetEmail: targetUser.email
				}
			}
		})

		logger.info('User promoted to INSTRUCTOR', { targetUserId, adminId: userId })

		return ok({
			message: `User ${targetUser.email} promoted to INSTRUCTOR`,
			user: updatedUser
		})
	} catch (error) {
		logger.error('Promote user error', error)
		return fail({ code: 'SERVER_ERROR', message: 'Internal server error' }, { status: 500 })
	}
}
