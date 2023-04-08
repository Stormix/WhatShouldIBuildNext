import { z } from 'zod';

export const generateInputSchema = z.object({
  what: z.string(),
  for: z.string(),
  using: z.string(),
  on: z.string(),
  but: z.string()
});

export const generateOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  difficulty: z.string(),
  timeToComplete: z.string(),
  description: z.string(),
  number: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  author: z.object({
    id: z.string(),
    name: z.string()
  }),
  keywords: z.array(z.string()),
  saved: z.boolean()
});
