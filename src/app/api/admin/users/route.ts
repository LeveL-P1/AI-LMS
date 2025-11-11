import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma/prisma'

/**
 * GET /api/admin/users
 * Fetch all users with their details (admin-only)
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

		// Fetch all users with enrollment counts
		const users = await db.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				_count: {
					select: { enrollments: true }
				}
			},
			orderBy: { createdAt: 'desc' }
		})

		return NextResponse.json(
			users.map((u) => ({
				id: u.id,
				email: u.email,
				name: u.name,
				role: u.role,
				createdAt: u.createdAt,
				enrollmentCount: u._count.enrollments
			}))
		)
	} catch (error) {
		console.error('Fetch users error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
