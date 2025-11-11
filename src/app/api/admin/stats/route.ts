import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma/prisma'

/**
 * GET /api/admin/stats
 * Admin-only endpoint to fetch platform statistics
 */
export async function GET() {
	try {
		const { userId } = await auth()

		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Verify admin role
		const user = await db.user.findUnique({
			where: { id: userId }
		})

		if (user?.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
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
					include: { user: { select: { name: true } } }
				}),
				db.user.count({ where: { role: 'INSTRUCTOR' } }),
				db.user.count({ where: { role: 'STUDENT' } })
			])

		return NextResponse.json({
			totalUsers,
			totalInstructors: instructors,
			totalStudents: students,
			totalCourses,
			totalEnrollments,
			recentActions: recentActions.map((action) => ({
				id: action.id,
				userId: action.userId,
				userName: action.user.name || 'Unknown',
				actionType: action.actionType,
				timestamp: action.createdAt
			}))
		})
	} catch (error) {
		console.error('Admin stats error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
