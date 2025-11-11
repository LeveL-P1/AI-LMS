import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/errors';

/**
 * GET /api/permissions
 * Returns user permissions based on their role
 */
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database by clerkId (when schema is updated)
    // For now, we'll search by any available field
    const user = await db.user.findFirst({
      where: { 
        // Once Prisma is regenerated, use: clerkId: userId
        // For temporary compatibility:
        OR: [
          { id: userId }
        ]
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
      return NextResponse.json(permissions);
    }

    // Get permissions for user's role
    const rolePermissions = await db.rolePermission.findMany({
      where: { role: user.role },
      select: { permission: true },
    });

    const permissions = rolePermissions.map(rp => rp.permission);
    logger.info('Permissions retrieved', { userId, role: user.role, permissionCount: permissions.length });
    return NextResponse.json(permissions);
  } catch (error) {
    logger.error('Failed to fetch permissions', error);
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}
