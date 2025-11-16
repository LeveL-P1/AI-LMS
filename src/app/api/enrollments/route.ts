import { NextRequest } from 'next/server'
import { db } from '@/lib/prisma/prisma'
import { successResponse, errorResponse, serverErrorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'
import { enrollmentSchema, paginationSchema } from '@/lib/validations'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return unauthorizedResponse()
		}

		// Get user from database
		const user = await db.user.findUnique({
			where: { clerkId: userId },
		})

		if (!user) {
			return errorResponse('USER_NOT_FOUND', 'User not found', 404)
		}

		// Parse pagination
		const { searchParams } = new URL(request.url)
		const paginationResult = paginationSchema.safeParse({
			page: searchParams.get('page'),
			limit: searchParams.get('limit'),
		})

		if (!paginationResult.success) {
			return validationErrorResponse(paginationResult.error.errors)
		}

		const { page, limit } = paginationResult.data
		const skip = (page - 1) * limit

		// Get total count
		const total = await db.enrollment.count({
			where: { userId: user.id },
		})

		// Get enrollments
		const enrollments = await db.enrollment.findMany({
			where: { userId: user.id },
			include: {
				course: {
					select: {
						id: true,
						title: true,
						description: true,
						thumbnail: true,
						instructor: {
							select: {
								name: true,
								imageUrl: true,
							},
						},
					},
				},
			},
			skip,
			take: limit,
			orderBy: { createdAt: 'desc' },
		})

		return successResponse({
			enrollments,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		})
	} catch (error) {
		console.error('Error fetching enrollments:', error)
		return serverErrorResponse('Failed to fetch enrollments')
	}
}

export async function POST(request: NextRequest) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return unauthorizedResponse()
		}

		// Get user from database
		const user = await db.user.findUnique({
			where: { clerkId: userId },
		})

		if (!user) {
			return errorResponse('USER_NOT_FOUND', 'User not found', 404)
		}

		// Parse and validate request body
		const body = await request.json()
		const validationResult = enrollmentSchema.safeParse(body)

		if (!validationResult.success) {
			return validationErrorResponse(validationResult.error.errors)
		}

		const { courseId } = validationResult.data

		// Check if course exists
		const course = await db.course.findUnique({
			where: { id: courseId },
		})

		if (!course) {
			return errorResponse('COURSE_NOT_FOUND', 'Course not found', 404)
		}

		// Check if already enrolled
		const existingEnrollment = await db.enrollment.findUnique({
			where: {
				userId_courseId: {
					userId: user.id,
					courseId,
				},
			},
		})

		if (existingEnrollment) {
			return errorResponse('ALREADY_ENROLLED', 'You are already enrolled in this course', 400)
		}

		// Create enrollment
		const enrollment = await db.enrollment.create({
			data: {
				userId: user.id,
				courseId,
				status: 'ACTIVE',
			},
			include: {
				course: {
					select: {
						id: true,
						title: true,
						description: true,
					},
				},
			},
		})

		return successResponse(enrollment, 201)
	} catch (error) {
		console.error('Error creating enrollment:', error)
		return serverErrorResponse('Failed to enroll in course')
	}
}
