import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { ok, fail } from '@/lib/utils/api'

/**
 * POST /api/admin/courses/delete
 * Delete a course (admin-only) - HARD DELETE
 */
export async function POST(request: NextRequest) {
	try {
		const adminCheck = await requireAdmin()
		if (adminCheck instanceof NextResponse) return adminCheck
		const userId = adminCheck.id

		// Content-Type guard
		const contentType = request.headers.get('content-type') || ''
		if (!contentType.includes('application/json')) {
			return fail({ code: 'UNSUPPORTED_MEDIA_TYPE', message: 'Unsupported content type' }, { status: 415 })
		}

		let parsed: unknown
		try {
			parsed = await request.json()
		} catch {
			return fail({ code: 'BAD_REQUEST', message: 'Invalid JSON body' }, { status: 400 })
		}

		const { courseId } = (parsed as { courseId?: unknown })
		if (typeof courseId !== 'string' || courseId.trim().length === 0) {
			return fail({ code: 'BAD_REQUEST', message: 'courseId must be a non-empty string' }, { status: 400 })
		}

		if (!courseId) {
			return fail({ code: 'BAD_REQUEST', message: 'courseId is required' }, { status: 400 })
		}

		// Verify course exists
		const course = await db.course.findUnique({
			where: { id: courseId },
			include: { _count: { select: { enrollments: true } } }
		})

		if (!course) {
			return fail({ code: 'NOT_FOUND', message: 'Course not found' }, { status: 404 })
		}

		// Log admin action before deletion
		await db.userAction.create({
			data: {
				id: `action_${userId}_${Date.now()}`,
				userId: userId,
				actionType: 'DELETE_COURSE',
				metadata: {
					courseId: courseId,
					courseTitle: course.title,
					enrollmentCount: course._count.enrollments
				}
			}
		})

		// Delete course (cascade delete via foreign keys)
		await db.course.delete({
			where: { id: courseId }
		})

		return ok({
			message: `Course "${course.title}" deleted (${course._count.enrollments} enrollments removed)`
		})
	} catch (error) {
		console.error('Delete course error:', error)
		return fail({ code: 'SERVER_ERROR', message: 'Internal server error' }, { status: 500 })
	}
}
