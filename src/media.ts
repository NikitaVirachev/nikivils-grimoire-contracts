import { z } from 'zod';

import { objectIdSchema } from './common';

export const mediaSchema = z
  .object({
    id: objectIdSchema,

    filename: z.string(),

    mimeType: z.string(),

    size: z.number().int().nonnegative(),

    width: z.number().int().positive(),

    height: z.number().int().positive(),

    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict();

export type MediaDto = z.infer<typeof mediaSchema>;
