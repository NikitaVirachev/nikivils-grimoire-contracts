import { z } from 'zod';

export const createCommentSchema = z
  .object({
    authorName: z.string().trim().min(2).max(50).optional(),

    text: z.string().trim().min(1).max(5000),
  })
  .strict();

export type CreateCommentRequest = z.infer<typeof createCommentSchema>;

export const commentSchema = z.object({
  _id: z.string(),
  postId: z.string(),

  authorName: z.string(),
  text: z.string(),

  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CommentDto = z.infer<typeof commentSchema>;
