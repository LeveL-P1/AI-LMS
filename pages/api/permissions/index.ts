import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getUserFromClerk } from '../../../lib/auth';

// API to get user permissions based on role
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromClerk(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const permissions = await prisma.rolePermission.findMany({
      where: { role: user.role },
    });
    res.status(200).json(permissions.map(p => p.permission));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch permissions.' });
  }
}
