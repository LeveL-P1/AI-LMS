import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma/prisma'

export async function GET() {
	try {
		const courses = await db.course.findMany({
			where: { isPublished: true },
			select: { id: true, title: true, description: true, imageUrl: true, price: true, categoryId: true }
		})
		return NextResponse.json({ courses })
	} catch (error) {
		console.error('Error fetching courses:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

