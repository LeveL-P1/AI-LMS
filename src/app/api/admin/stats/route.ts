import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { ok, fail } from '@/lib/utils/api'
import { isRateLimited, rateLimitConfigs } from '@/lib/utils/rateLimit'
import { logger } from '@/lib/errors'

/**
 * GET /api/admin/stats
 * Admin-only endpoint to fetch platform statistics
 */
export async function GET() {
	try {
		const adminCheck = await requireAdmin()
		if (adminCheck instanceof NextResponse) return adminCheck

		const userId = adminCheck.id

		// Rate limiting for stats queries (general limit, not sensitive)
		if (isRateLimited(`admin:stats:${userId}`, rateLimitConfigs.adminGeneral.limit, rateLimitConfigs.adminGeneral.windowMs)) {
			return fail({ code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' }, { status: 429 })
		}

		// Fetch platform statistics
		const [totalUsers, totalCourses, totalEnrollments, recentActions, instructors, students] =
			await Promise.all([
				db.user.count(),
				db.course.count(),
				db.enrollment.count(),
				db.userAction.findMany({
					take: 10,
					orderBy: { createdAt: 'desc' },
					include: { User: { select: { name: true } } }
				}),
				db.user.count({ where: { role: 'INSTRUCTOR' } }),
				db.user.count({ where: { role: 'STUDENT' } })
			])

		logger.info('Admin stats fetched', { adminId: userId })

		return ok({
			totalUsers,
			totalInstructors: instructors,
			totalStudents: students,
			totalCourses,
			totalEnrollments,
			recentActions: recentActions.map((action) => ({
				id: action.id,
				userId: action.userId,
				userName: action.User.name || 'Unknown',
				actionType: action.actionType,
				timestamp: action.createdAt
			}))
		})
	} catch (error) {
		logger.error('Admin stats error', error)
		return fail({ code: 'SERVER_ERROR', message: 'Internal server error' }, { status: 500 })
	}
}
