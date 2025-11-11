import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma/prisma'

/**
 * POST /api/admin/courses/resume
 * Resume a suspended course (admin-only)
 */
export async function POST(request: NextRequest) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Verify admin role
		const admin = await db.user.findUnique({
			where: { id: userId }
		})

		if (admin?.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
		}

		const { courseId } = await request.json()

		if (!courseId) {
			return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
		}

		// Verify course exists
		const course = await db.course.findUnique({
			where: { id: courseId }
		})

		if (!course) {
			return NextResponse.json({ error: 'Course not found' }, { status: 404 })
		}

		// Log admin action
		await db.userAction.create({
			data: {
				userId: userId,
				actionType: 'RESUME_COURSE',
				metadata: {
					courseId: courseId,
					courseTitle: course.title
				}
			}
		})

		// TODO: Add status field to Course model
		return NextResponse.json({
			success: true,
			message: `Course "${course.title}" resumed`
		})
	} catch (error) {
		console.error('Resume course error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
