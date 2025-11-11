import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma/prisma'

/**
 * GET /api/admin/courses
 * Fetch all courses with details (admin-only)
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

		// Fetch all courses with instructor and enrollment info
		const courses = await db.course.findMany({
			select: {
				id: true,
				title: true,
				description: true,
				instructorId: true,
				instructor: {
					select: { name: true, email: true }
				},
				_count: {
					select: { enrollments: true }
				},
				createdAt: true
			},
			orderBy: { createdAt: 'desc' }
		})

		return NextResponse.json(
			courses.map((c) => ({
				id: c.id,
				title: c.title,
				description: c.description,
				instructorId: c.instructorId,
				instructorName: c.instructor?.name || 'Unassigned',
				enrollmentCount: c._count.enrollments,
				status: 'ACTIVE', // TODO: Add status field to Course model
				createdAt: c.createdAt
			}))
		)
	} catch (error) {
		console.error('Fetch courses error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
