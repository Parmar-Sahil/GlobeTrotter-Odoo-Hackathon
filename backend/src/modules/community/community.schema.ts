import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    tripId: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    imageUrl: z.string().url().optional().or(z.literal('')),
    location: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const searchPostSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    groupBy: z.enum(['category', 'location']).optional(),
    sortBy: z.enum(['createdAt', 'likesCount', 'viewsCount']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Comment content is required'),
  }),
});
