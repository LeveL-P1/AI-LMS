import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/errors';
import { ok, fail } from '@/lib/utils/api';

/**
 * GET /api/permissions
 * Returns user permissions based on their role
 */
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return fail({ code: 'UNAUTHORIZED', message: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database by clerkId (when schema is updated)
    // For now, we'll search by any available field
    // Prefer matching by clerkId; ensure prisma schema has a unique index on clerkId
    const user = await db.user.findFirst({
      where: { 
        clerkId: userId,
      },
    });

    if (!user) {
      logger.warn('User not found for permissions check', { userId });
      // Return default student permissions if user not yet in database
      const rolePermissions = await db.rolePermission.findMany({
        where: { role: 'STUDENT' },
        select: { permission: true },
      });
      const permissions = rolePermissions.map(rp => rp.permission);
      return ok(permissions);
    }

    // Get permissions for user's role
    const rolePermissions = await db.rolePermission.findMany({
      where: { role: user.role },
      select: { permission: true },
    });

    const permissions = rolePermissions.map(rp => rp.permission);
    logger.info('Permissions retrieved', { userId, role: user.role, permissionCount: permissions.length });
    return ok(permissions);
  } catch (error) {
    logger.error('Failed to fetch permissions', error);
    return fail({ code: 'SERVER_ERROR', message: 'Failed to fetch permissions' }, { status: 500 });
  }
}
