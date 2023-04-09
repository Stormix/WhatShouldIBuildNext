import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { addCommentSchema } from '@/validation/comments';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const commentsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        ideaId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          ideaId: input.ideaId
        },
        include: {
          author: true
        }
      });

      return comments;
    }),

  addComment: protectedProcedure.input(addCommentSchema).mutation(async ({ ctx, input }) => {
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
        author: true
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
