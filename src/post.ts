import { z } from 'zod';

import { objectIdSchema } from './common';

export const postStatusSchema = z.enum(['draft', 'published']);

export type PostStatus = z.infer<typeof postStatusSchema>;

export const blockIdSchema = z.uuid('Invalid block ID');

export const paragraphBlockSchema = z
  .object({
    id: blockIdSchema,

    type: z.literal('paragraph'),

    text: z.string().max(50_000),
  })
  .strict();

export type ParagraphBlock = z.infer<typeof paragraphBlockSchema>;

export const headingBlockSchema = z
  .object({
    id: blockIdSchema,

    type: z.literal('heading'),

    text: z.string().max(1_000),

    level: z.union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
      z.literal(6),
    ]),
  })
  .strict();

export type HeadingBlock = z.infer<typeof headingBlockSchema>;

export const imageBlockSchema = z
  .object({
    id: blockIdSchema,

    type: z.literal('image'),

    imageId: objectIdSchema,

    alt: z.string().max(1_000).default(''),

    caption: z.string().max(2_000).default(''),
  })
  .strict();

export type ImageBlock = z.infer<typeof imageBlockSchema>;

export const quoteBlockSchema = z
  .object({
    id: blockIdSchema,

    type: z.literal('quote'),

    text: z.string().max(20_000),

    author: z.string().max(500).default(''),
  })
  .strict();

export type QuoteBlock = z.infer<typeof quoteBlockSchema>;

export const postBlockSchema = z.discriminatedUnion('type', [
  paragraphBlockSchema,
  headingBlockSchema,
  imageBlockSchema,
  quoteBlockSchema,
]);

export type PostBlock = z.infer<typeof postBlockSchema>;

export const postContentSchema = z
  .object({
    version: z.literal(1),

    blocks: z.array(postBlockSchema).max(1000),
  })
  .strict();

export type PostContent = z.infer<typeof postContentSchema>;

export const coverSchema = z
  .object({
    imageId: objectIdSchema,

    alt: z.string().max(1_000).default(''),
  })
  .strict();

export type PostCover = z.infer<typeof coverSchema>;

const postBaseSchema = z
  .object({
    title: z.string().trim().min(1).max(200),

    overview: z.string().trim().min(1).max(1000),

    cover: coverSchema.nullable(),

    content: postContentSchema,

    tags: z.array(z.string().trim().min(1).max(100)),

    status: postStatusSchema,
  })
  .strict();

export const createPostSchema = z
  .object({
    title: postBaseSchema.shape.title,

    overview: postBaseSchema.shape.overview,

    cover: postBaseSchema.shape.cover.optional(),

    content: postBaseSchema.shape.content.default({
      version: 1,
      blocks: [],
    }),

    tags: postBaseSchema.shape.tags.default([]),

    status: postBaseSchema.shape.status.default('draft'),
  })
  .strict();

export type CreatePostRequest = z.infer<typeof createPostSchema>;

export const updatePostSchema = postBaseSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export type UpdatePostRequest = z.infer<typeof updatePostSchema>;

const postBaseDtoSchema = z.object({
  _id: objectIdSchema,

  title: z.string(),

  overview: z.string(),

  cover: coverSchema.optional(),

  tags: z.array(z.string()),

  publishedAt: z.iso.datetime().nullable(),

  createdAt: z.iso.datetime(),
});

export const postDtoSchema = postBaseDtoSchema
  .extend({
    content: postContentSchema,

    status: postStatusSchema,

    updatedAt: z.iso.datetime(),
  })
  .strict();

export type PostDto = z.infer<typeof postDtoSchema>;

export const postSummaryDtoSchema = postBaseDtoSchema.strict();

export type PostSummaryDto = z.infer<typeof postSummaryDtoSchema>;
