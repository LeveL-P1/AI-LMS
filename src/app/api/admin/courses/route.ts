import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { ok, fail } from '@/lib/utils/api'

/**
 * GET /api/admin/courses
 * Fetch all courses with details (admin-only)
 */
export async function GET() {
	try {
		const adminCheck = await requireAdmin()
		if (!('ok' in adminCheck) || adminCheck.ok === false) return adminCheck.response

		// Fetch all courses with instructor and enrollment info
		const courses = await db.course.findMany({
			select: {
				id: true,
				title: true,
				description: true,
				instructorId: true,
				instructor: {
					select: { firstName: true, lastName: true, email: true }
				},
				_count: {
					select: { enrollments: true }
				},
				createdAt: true
			},
			orderBy: { createdAt: 'desc' }
		})

		return ok(
			courses.map((c) => ({
				id: c.id,
				title: c.title,
				description: c.description,
				instructorId: c.instructorId,
				instructorName: c.instructor ? `${c.instructor.firstName || ''} ${c.instructor.lastName || ''}`.trim() || 'Unassigned' : 'Unassigned',
				enrollmentCount: c._count.enrollments,
				// status removed until supported in schema
				createdAt: c.createdAt
			}))
		)
	} catch (error) {
		console.error('Fetch courses error:', error)
		return fail({ code: 'SERVER_ERROR', message: 'Internal server error' }, { status: 500 })
	}
}
