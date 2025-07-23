import { mbToBytes } from '@shared/utils/mbToBytes';
import z from 'zod';

export const createMealSchema = z.object({
  file: z.object({
    type: z.enum(['audio/m4a', 'image/jpeg'], { message: '"file.type" must be either "audio/m4a" or "image/jpeg"' }),
    size: z.number()
      .min(1, '"file.size" must be greater than 0')
      .max(mbToBytes(10), '"file.size" must be less than or equal to 10MB'),
  }),
});

export type CreateMealBody = z.infer<typeof createMealSchema>;
