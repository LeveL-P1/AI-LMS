import { requirePermission } from '@/lib/auth/guards'
import { db } from '@/lib/prisma/prisma'
import { NextResponse } from 'next/server'

/**
 * GET /api/admin/users
 * Fetch all users with their details (admin-only)
 */
export async function GET() {
	try {
		// Use new permission-based guard
		const authResult = await requirePermission('MANAGE_USERS')
		
		if (authResult instanceof Response) {
			return authResult // Return error response
		}

		// authResult is the authenticated user

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
