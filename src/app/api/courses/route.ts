import { db } from '@/lib/prisma/prisma'
import { successResponse, errorResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api-response'
import { paginationSchema, createCourseSchema } from '@/lib/validations'
import { auth } from '@clerk/nextjs/server'
import { UserRole } from '@/types'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		
		// Parse pagination
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
		const total = await db.course.count({
			where: { isPublished: true },
		})

		// Get paginated courses
		const courses = await db.course.findMany({
			where: { isPublished: true },
			select: {
				id: true,
				title: true,
				description: true,
				thumbnail: true,
				createdAt: true,
				updatedAt: true,
				instructor: {
					select: {
						id: true,
						name: true,
						imageUrl: true,
					},
				},
				_count: {
					select: { enrollments: true },
				},
			},
			skip,
			take: limit,
			orderBy: { createdAt: 'desc' },
		})

		return successResponse({
			courses,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		})
	} catch (error) {
		console.error('Error fetching courses:', error)
		return serverErrorResponse('Failed to fetch courses')
	}
}

export async function POST(request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return errorResponse('UNAUTHORIZED', 'You must be logged in', 401)
		}

		// Get user from database
		const user = await db.user.findUnique({
			where: { clerkId: userId },
		})

		if (!user) {
			return errorResponse('USER_NOT_FOUND', 'User not found', 404)
		}

		// Check if user is instructor or admin
		if (user.role !== UserRole.INSTRUCTOR && user.role !== UserRole.ADMIN) {
			return errorResponse('FORBIDDEN', 'Only instructors can create courses', 403)
		}

		// Parse and validate request body
		const body = await request.json()
		const validationResult = createCourseSchema.safeParse(body)

		if (!validationResult.success) {
			return validationErrorResponse(validationResult.error.errors)
		}

		const { title, description, thumbnail } = validationResult.data

		// Create course
		const course = await db.course.create({
			data: {
				title,
				description,
				thumbnail,
				instructorId: user.id,
				isPublished: false,
			},
			include: {
				instructor: {
					select: {
						id: true,
						name: true,
						imageUrl: true,
					},
				},
			},
		})

		return successResponse(course, 201)
	} catch (error) {
		console.error('Error creating course:', error)
		return serverErrorResponse('Failed to create course')
	}
}


