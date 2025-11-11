import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma/prisma'

/**
 * POST /api/admin/users/promote
 * Promote a user to INSTRUCTOR role (admin-only)
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

		const { userId: targetUserId } = await request.json()

		if (!targetUserId) {
			return NextResponse.json({ error: 'userId is required' }, { status: 400 })
		}

		// Prevent promoting admins
		const targetUser = await db.user.findUnique({
			where: { id: targetUserId }
		})

		if (!targetUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		if (targetUser.role === 'ADMIN') {
			return NextResponse.json({ error: 'Cannot promote admin users' }, { status: 400 })
		}

		// Update user role to INSTRUCTOR
		const updatedUser = await db.user.update({
			where: { id: targetUserId },
			data: { role: 'INSTRUCTOR' }
		})

		// Log admin action
		await db.userAction.create({
			data: {
				userId: userId,
				actionType: 'PROMOTE_TO_INSTRUCTOR',
				metadata: {
					targetUserId: targetUserId,
					targetEmail: targetUser.email
				}
			}
		})

		return NextResponse.json({
			success: true,
			message: `User ${targetUser.email} promoted to INSTRUCTOR`,
			user: updatedUser
		})
	} catch (error) {
		console.error('Promote user error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
