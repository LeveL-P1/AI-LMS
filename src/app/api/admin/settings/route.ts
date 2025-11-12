import { NextRequest } from 'next/server'
import { db } from '@/lib/prisma/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { ok, fail } from '@/lib/utils/api'
import { validatePayload, schemas } from '@/lib/utils/validate'
import { isRateLimited, rateLimitConfigs } from '@/lib/utils/rateLimit'
import { logger } from '@/lib/errors'

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
		const adminCheck = await requireAdmin()
		if (!('ok' in adminCheck) || adminCheck.ok === false) return adminCheck.response

		logger.info('Settings fetched', { adminId: adminCheck.user.id })
		return ok(platformSettingsStore)
	} catch (error) {
		logger.error('Fetch settings error', error)
		return fail({ code: 'SERVER_ERROR', message: 'Internal server error' }, { status: 500 })
	}
}

/**
 * POST /api/admin/settings
 * Update platform settings (admin-only)
 *
 * TODO: Once settings are moved to database, update this endpoint to:
 * - Store settings in a PlatformSettings table
 * - Add audit trail for all changes
 * - Support partial updates with proper validation
 */
export async function POST(request: NextRequest) {
	try {
		const adminCheck = await requireAdmin()
		if (!('ok' in adminCheck) || adminCheck.ok === false) return adminCheck.response

		const userId = adminCheck.user.id

		// Rate limiting for settings updates
		if (isRateLimited(`admin:settings:${userId}`, rateLimitConfigs.adminGeneral.limit, rateLimitConfigs.adminGeneral.windowMs)) {
			return fail({ code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' }, { status: 429 })
		}

		// Content-Type guard
		const contentType = request.headers.get('content-type') || ''
		if (!contentType.includes('application/json')) {
			return fail({ code: 'UNSUPPORTED_MEDIA_TYPE', message: 'Unsupported content type' }, { status: 415 })
		}

		// Parse and validate JSON
		let parsed: unknown
		try {
			parsed = await request.json()
		} catch {
			return fail({ code: 'BAD_REQUEST', message: 'Invalid JSON body' }, { status: 400 })
		}

		// Validate payload
		const validation = validatePayload<{
			section: 'general' | 'security' | 'maintenance'
			platformName?: string
			supportEmail?: string
			maxEnrollmentPerCourse?: number
			requireMFA?: boolean
			sessionTimeout?: number
			passwordMinLength?: number
			maintenanceMode?: boolean
			maintenanceMessage?: string
		}>(parsed, schemas.settingsUpdate)
		if (!validation.ok) return validation.response

		const { section, ...settings } = validation.data

		// Update settings
		if (section === 'general') {
			platformSettingsStore.general = { ...platformSettingsStore.general, ...settings as Partial<typeof platformSettingsStore.general> }
		} else if (section === 'security') {
			platformSettingsStore.security = { ...platformSettingsStore.security, ...settings as Partial<typeof platformSettingsStore.security> }
		} else if (section === 'maintenance') {
			platformSettingsStore.maintenance = { ...platformSettingsStore.maintenance, ...settings as Partial<typeof platformSettingsStore.maintenance> }
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

		logger.info('Settings updated', { section, adminId: userId })

		return ok({
			message: `${section} settings updated`,
			settings: platformSettingsStore
		})
	} catch (error) {
		logger.error('Update settings error', error)
		return fail({ code: 'SERVER_ERROR', message: 'Internal server error' }, { status: 500 })
	}
}
