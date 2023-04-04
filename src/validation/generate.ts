import { z } from 'zod';

export interface GenerateSchema {
  what: string;
  for: string;
  using: string;
  on: string;
  but: string;
}

export const generateSchema = z.object({
  what: z.string(),
  for: z.string(),
  using: z.string(),
  on: z.string(),
  but: z.string()
});
