import { z } from 'zod';

const RESERVED_AUTHOR_NAMES = new Set(['admin', 'administrator', 'moderator', 'owner', 'nikivils']);

const authorNameSchema = z
  .string()
  .trim()
  .min(2, 'Author name must contain at least 2 characters')
  .max(50, 'Author name must contain at most 50 characters')
  .refine((value) => !RESERVED_AUTHOR_NAMES.has(value.toLowerCase()), {
    message: 'This author name is reserved',
  });

export const createCommentSchema = z
  .object({
    authorName: z.preprocess((value) => {
      if (typeof value === 'string' && value.trim() === '') {
        return undefined;
      }

      return value;
    }, authorNameSchema.optional()),

    text: z.string().trim().min(1, 'Comment cannot be empty').max(5000, 'Comment is too long'),
  })
  .strict();

export type CreateCommentRequest = z.infer<typeof createCommentSchema>;

export const commentSchema = z.object({
  id: z.string(),
  postId: z.string(),

  authorName: z.string(),
  text: z.string(),

  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CommentDto = z.infer<typeof commentSchema>;
