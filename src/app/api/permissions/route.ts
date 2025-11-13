import { getAuthenticatedUser } from '@/lib/auth/core'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/errors'

/**
 * GET /api/permissions
 * Returns user permissions based on their role
 */
export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    
    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      )
    }

    logger.info('Permissions retrieved', { 
      userId: user.id, 
      role: user.role, 
      permissionCount: user.permissions.length 
    })
    
    return NextResponse.json(user.permissions)
  } catch (error) {
    logger.error('Failed to fetch permissions', error)
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Failed to fetch permissions' } },
      { status: 500 }
    )
  }
}
