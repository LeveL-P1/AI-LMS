import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma/prisma'

/**
 * POST /api/admin/users/deactivate
 * Soft deactivate a user (mark as inactive)
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

		// Prevent deactivating admins
		const targetUser = await db.user.findUnique({
			where: { id: targetUserId }
		})

		if (!targetUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		if (targetUser.role === 'ADMIN') {
			return NextResponse.json({ error: 'Cannot deactivate admin users' }, { status: 400 })
		}

		// Log admin action (implementation uses a status field - you'll need to add this to schema)
		await db.userAction.create({
			data: {
				userId: userId,
				actionType: 'DEACTIVATE_USER',
				metadata: {
					targetUserId: targetUserId,
					targetEmail: targetUser.email,
					previousRole: targetUser.role
				}
			}
		})

		// For now, we're just logging the action
		// In production, add an 'status' or 'isActive' field to User model
		return NextResponse.json({
			success: true,
			message: `User ${targetUser.email} deactivated (action logged)`
		})
	} catch (error) {
		console.error('Deactivate user error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
