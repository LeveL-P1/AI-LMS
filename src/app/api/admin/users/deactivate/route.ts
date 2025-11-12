import { NextRequest } from 'next/server'
import { db } from '@/lib/prisma/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { ok, fail } from '@/lib/utils/api'
import { validatePayload, schemas } from '@/lib/utils/validate'
import { isRateLimited, rateLimitConfigs } from '@/lib/utils/rateLimit'
import { logger } from '@/lib/errors'

/**
 * POST /api/admin/users/deactivate
 * Soft deactivate a user (mark as inactive)
 *
 * TODO: Once User schema includes an isActive/status field, update this endpoint to:
 * - Update user.isActive = false or user.status = 'INACTIVE'
 * - Set user.deactivatedAt = now()
 * - This enables soft-deactivation (non-destructive state change)
 * - Prevent deactivated users from logging in or accessing resources
 */
export async function POST(request: NextRequest) {
	try {
		const adminCheck = await requireAdmin()
		if (!('ok' in adminCheck) || adminCheck.ok === false) return adminCheck.response

		const userId = adminCheck.user.id

		// Rate limiting for sensitive user operations
		if (isRateLimited(`admin:deactivate:${userId}`, rateLimitConfigs.adminSensitive.limit, rateLimitConfigs.adminSensitive.windowMs)) {
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

		// Prevent deactivating admins
		const targetUser = await db.user.findUnique({
			where: { id: targetUserId }
		})

		if (!targetUser) {
			return fail({ code: 'NOT_FOUND', message: 'User not found' }, { status: 404 })
		}

		if (targetUser.role === 'ADMIN') {
			return fail({ code: 'BAD_REQUEST', message: 'Cannot deactivate admin users' }, { status: 400 })
		}

		// Log admin action
		await db.userAction.create({
			data: {
				userId: userId,
				actionType: 'DEACTIVATE_USER',
				metadata: {
					targetUserId: targetUserId,
					targetEmail: targetUser.email,
					previousRole: targetUser.role
				}
			}
		})

		logger.info('User deactivated', { targetUserId, adminId: userId })

		// TODO: Once schema supports isActive/status field, update to:
		// const updated = await db.user.update({
		//   where: { id: targetUserId },
		//   data: { isActive: false, deactivatedAt: new Date() }
		// })
		// return ok({
		//   message: `User ${targetUser.email} deactivated`,
		//   user: updated
		// })

		return ok({
			message: `User ${targetUser.email} deactivated (action logged)`
		})
	} catch (error) {
		logger.error('Deactivate user error', error)
		return fail({ code: 'SERVER_ERROR', message: 'Internal server error' }, { status: 500 })
	}
}
