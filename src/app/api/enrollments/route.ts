import { NextRequest } from 'next/server'
import { db } from '@/lib/prisma/prisma'
import { successResponse, errorResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api-response'
import { enrollmentSchema, paginationSchema } from '@/lib/validations'

interface EnrollmentResponse {
  id: string
  courseId: string
  userId: string
  progress: number
  completed: boolean
  enrolledAt: Date
  course: {
    id: string
    title: string
    description: string | null
    thumbnail: string | null
    instructor: {
      name: string | null
      imageUrl: string | null
    } | null
  }
}

export async function GET(request: NextRequest) {
  try {
    // Parse pagination
    const { searchParams } = new URL(request.url)
    const paginationResult = paginationSchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      userId: searchParams.get('userId') // Optional: Filter by user ID if needed
    })

    if (!paginationResult.success) {
      return validationErrorResponse(paginationResult.error.issues)
    }

    const { page, limit, userId } = paginationResult.data
    const skip = (page - 1) * limit

    // Build where clause
    const where = userId ? { userId } : {}

    // Get total count and enrollments in parallel
    const [total, enrollments] = await Promise.all([
      db.enrollment.count({ where }),
      db.enrollment.findMany({
        where,
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
        orderBy: { enrolledAt: 'desc' },
      }),
    ])

    return successResponse<{
      enrollments: EnrollmentResponse[]
      pagination: {
        page: number
        limit: number
        total: number
        pages: number
      }
    }>({
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
    // Parse and validate request body
    const body = await request.json()
    const validationResult = enrollmentSchema.safeParse(body)

		if (!validationResult.success) {
			return validationErrorResponse(validationResult.error.issues)
		}

    const { courseId } = validationResult.data

    // Check if course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return errorResponse('COURSE_NOT_FOUND', 'Course not found', 404)
    }

    // Get userId from request body (temporary until we have proper auth)
    const { userId } = body
    
    if (!userId) {
      return errorResponse('USER_ID_REQUIRED', 'User ID is required', 400)
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return errorResponse('USER_NOT_FOUND', 'User not found', 404)
    }

    // Check if user is already enrolled
    const existingEnrollment = await db.enrollment.findFirst({
      where: {
        userId,
        courseId,
      },
    })

    if (existingEnrollment) {
      return errorResponse(
        'ALREADY_ENROLLED',
        'User is already enrolled in this course',
        400
      )
    }

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        user: { connect: { id: userId } },
        course: { connect: { id: courseId } },
        progress: 0,
        completed: false,
        enrolledAt: new Date(),
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return successResponse(
      { enrollment },
      { 
        status: 201,
        message: 'Successfully enrolled in course' 
      }
    )
  } catch (error) {
    console.error('Error creating enrollment:', error)
    return serverErrorResponse('Failed to create enrollment')
  }
}
