import { ComponentType } from '@prisma/client';
import { z } from 'zod';

export const generateOptionsSchema = z
  .object({
    temperature: z.number().optional(),
    presencePenalty: z.number().optional()
  })
  .optional();

export const generateInputSchema = z.object({
  what: z.string().nonempty(),
  for: z.string().nonempty(),
  using: z.string().nonempty(),
  on: z.string().nonempty(),
  but: z.string().optional(),
  options: generateOptionsSchema
});

export type GenerateInput = z.TypeOf<typeof generateInputSchema>;

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

export const generateSettingsSchema = z.object({
  ...Object.values(ComponentType).reduce((acc, curr) => {
    acc[curr] = z.array(z.object({ id: z.string(), value: z.string(), enabled: z.boolean() }));
    return acc;
  }, {} as Record<ComponentType, z.ZodArray<z.ZodObject<{ id: z.ZodString; value: z.ZodString; enabled: z.ZodBoolean }>>>),
  options: generateOptionsSchema
});
