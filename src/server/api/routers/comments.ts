import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { verifyCaptcha } from '@/utils/captcha';
import { addCommentSchema } from '@/validation/comments';
import { TRPCError } from '@trpc/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, '1 m'), // 2 requests per minute
  analytics: true
});

/**
 * Comments router
 *
 * @remarks
 * Comments only suppert 1 level of replies (no replies to replies, they are just appended to the parent comment)
 */
export const commentsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        ideaId: z.string().nullish()
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.ideaId) {
        return;
      }

      const comments = await ctx.prisma.comment.findMany({
        where: {
          ideaId: input.ideaId,
          parentId: null
        },
        include: {
          author: true,
          children: {
            include: {
              author: true,
              children: true
            }
          }
        }
      });

      return comments;
    }),

  addComment: protectedProcedure.input(addCommentSchema).mutation(async ({ ctx, input }) => {
    if (!input.captcha) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Captcha is required' });
    }

    await verifyCaptcha(input.captcha);

    // If parentId is provided, check if the parent comment exists and that it's not a reply
    if (input.parentId) {
      const parentComment = await ctx.prisma.comment.findUnique({
        where: {
          id: input.parentId
        }
      });

      if (!parentComment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Parent comment not found' });
      }

      if (parentComment.parentId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'You cannot reply to a reply' });
      }
    }

    const { success, reset } = await rateLimit.limit(ctx.session.user.id);
    const duration = Math.ceil((reset - Date.now()) / 1000);

    if (!success) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `You have exceeded the rate limit. Please try again in ${duration}s.`
      });
    }

    const comment = await ctx.prisma.comment.create({
      data: {
        content: input.content,
        idea: {
          connect: {
            id: input.ideaId
          }
        },
        author: {
          connect: {
            id: ctx.session?.user.id
          }
        },
        ...(input.parentId && {
          parent: {
            connect: {
              id: input.parentId
            }
          }
        })
      },
      include: {
        author: true,
        children: {
          include: {
            author: true
          }
        }
      }
    });

    return comment;
  }),

  deleteComment: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is the author of the comment
      const comment = await ctx.prisma.comment.findUnique({
        where: {
          id: input.id
        },
        include: {
          author: true
        }
      });

      if (!comment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' });
      }

      if (comment.author.id !== ctx.session?.user.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not authorized to delete this comment' });
      }

      await ctx.prisma.comment.delete({
        where: {
          id: input.id
        }
      });

      return true;
    }),

  editComment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is the author of the comment
      const comment = await ctx.prisma.comment.findUnique({
        where: {
          id: input.id
        },
        include: {
          author: true
        }
      });

      if (!comment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' });
      }

      if (comment.author.id !== ctx.session?.user.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not authorized to edit this comment' });
      }

      const updatedComment = await ctx.prisma.comment.update({
        where: {
          id: input.id
        },
        data: {
          content: input.content
        },
        include: {
          author: true
        }
      });

      return updatedComment;
    })
});
