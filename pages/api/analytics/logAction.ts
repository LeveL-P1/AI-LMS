import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getUserFromClerk } from '../../../lib/auth';

// API to log user actions for analytics
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromClerk(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    try {
      const { actionType, metadata } = req.body;
      await prisma.userAction.create({
        data: {
          userId: user.id,
          actionType,
          metadata,
        },
      });
      res.status(201).json({ message: 'Action logged successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to log action' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
