import { z } from 'zod';

export const generateInputSchema = z.object({
  what: z.string().nonempty(),
  for: z.string().nonempty(),
  using: z.string().nonempty(),
  on: z.string().nonempty(),
  but: z.string().optional()
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
  saved: z.boolean(),
  rating: z.number().nullish(),
  ratingsCount: z.number(),
  ratedByThisUser: z.boolean(),
  saveCount: z.number()
});
