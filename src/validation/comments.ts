import { z } from 'zod';

export const addCommentSchema = z.object({
  ideaId: z.string(),
  content: z.string().nonempty(),
  parentId: z.string().optional()
});
