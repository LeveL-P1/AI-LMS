import { db } from '@/lib/prisma/prisma'
import { ok, fail } from '@/lib/utils/api'
import { logger } from '@/lib/errors'

export async function GET() {
	try {
		const courses = await db.course.findMany({
			where: { isPublished: true },
			select: { 
				id: true, 
				title: true, 
				description: true, 
				thumbnail: true,
				price: true, 
				createdAt: true,
				updatedAt: true
			}
		})
		logger.info('Courses fetched', { count: courses.length })
		return ok(courses)
	} catch (error) {
		logger.error('Error fetching courses', error)
		return fail({ code: 'SERVER_ERROR', message: 'Internal server error' }, { status: 500 })
	}
}


