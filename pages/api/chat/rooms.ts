import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getUserFromClerk } from '../../../lib/auth';

// API to create and manage chat rooms
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromClerk(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    try {
      const { courseId } = req.body;
      const existingRoom = await prisma.chatRoom.findFirst({
        where: { courseId },
      });
      if (existingRoom) {
        return res.status(200).json(existingRoom);
      }
      const chatRoom = await prisma.chatRoom.create({
        data: { courseId },
      });
      res.status(201).json(chatRoom);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create chat room' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
