import type { generateOutputSchema } from '@/validation/generate';
import type { z } from 'zod';

export type GeneratedIdea = z.TypeOf<typeof generateOutputSchema>;
