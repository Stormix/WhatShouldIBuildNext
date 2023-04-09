import { prisma } from '@/server/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  console.log('Cron job ran at: ', new Date().toISOString());

  const users = await prisma.user.updateMany({
    where: {
      sessions: {
        some: {
          expires: {
            gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
          }
        }
      }
    },
    data: {
      credits: {
        increment: 1
      }
    }
  });

  return response.status(200).json({
    message: 'Cron job ran successfully',
    users: users.count
  });
}
