import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma/prisma'

export async function POST(req: NextRequest) {
	try {
		const user = await currentUser()
		if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

		const { courseId } = await req.json()
		if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 })

		// Find local user
		const student = await db.user.findUnique({ where: { clerkId: user.id } })
		if (!student) return NextResponse.json({ error: 'User not found' }, { status: 404 })

		const enrollment = await db.enrollment.upsert({
			where: { userId_courseId: { userId: student.id, courseId } },
			update: {},
			create: { userId: student.id, courseId }
		})

		return NextResponse.json({ enrollment })
	} catch (error) {
		console.error('Error creating enrollment:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

