import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma/prisma'

// In-memory settings store (replace with database in production)
interface PlatformSettings {
	general: { platformName: string; supportEmail: string; maxEnrollmentPerCourse: number }
	security: { requireMFA: boolean; sessionTimeout: number; passwordMinLength: number }
	maintenance: { maintenanceMode: boolean; maintenanceMessage: string }
}

const platformSettingsStore: PlatformSettings = {
	general: {
		platformName: 'AI-LMS',
		supportEmail: 'support@ai-lms.com',
		maxEnrollmentPerCourse: 100
	},
	security: {
		requireMFA: false,
		sessionTimeout: 30,
		passwordMinLength: 8
	},
	maintenance: {
		maintenanceMode: false,
		maintenanceMessage: 'System is under maintenance. Please try again later.'
	}
}

/**
 * GET /api/admin/settings
 * Fetch platform settings (admin-only)
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

		return NextResponse.json(platformSettingsStore)
	} catch (error) {
		console.error('Fetch settings error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

/**
 * POST /api/admin/settings
 * Update platform settings (admin-only)
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

		const body = await request.json()
		const { section, ...settings } = body

		if (!section) {
			return NextResponse.json({ error: 'section is required' }, { status: 400 })
		}

		// Update settings
		if (section === 'general') {
			platformSettingsStore.general = { ...platformSettingsStore.general, ...settings }
		} else if (section === 'security') {
			platformSettingsStore.security = { ...platformSettingsStore.security, ...settings }
		} else if (section === 'maintenance') {
			platformSettingsStore.maintenance = { ...platformSettingsStore.maintenance, ...settings }
		} else {
			return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
		}

		// Log admin action
		await db.userAction.create({
			data: {
				userId: userId,
				actionType: 'UPDATE_SETTINGS',
				metadata: {
					section: section,
					changes: settings
				}
			}
		})

		return NextResponse.json({
			success: true,
			message: `${section} settings updated`,
			settings: platformSettingsStore
		})
	} catch (error) {
		console.error('Update settings error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
