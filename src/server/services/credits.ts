import type { User } from '@prisma/client';
import { prisma } from '../db';

export default class CreditsService {
  static async balance(userId: User['id']) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.credits ?? 0;
  }

  static async reward(userId: User['id'], amount: number) {
    const credits = await CreditsService.balance(userId);

    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        credits: credits + amount
      }
    });
  }

  static async deduct(userId: User['id'], amount: number) {
    const credits = await CreditsService.balance(userId);

    if (credits < amount) {
      throw new Error('Not enough credits');
    }

    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        credits: credits - amount
      }
    });
  }
}
