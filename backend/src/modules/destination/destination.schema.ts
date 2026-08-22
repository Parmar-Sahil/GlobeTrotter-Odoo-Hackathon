import { z } from 'zod';

export const createDestinationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    country: z.string().min(1, 'Country is required'),
    region: z.string().min(1, 'Region is required'),
    description: z.string().min(1, 'Description is required'),
    imageUrl: z.string().url('Valid image URL is required'),
    bannerUrl: z.string().url().optional(),
    isPopular: z.boolean().optional(),
    rating: z.number().min(0).max(5).optional(),
  }),
});

export const searchDestinationSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    region: z.string().optional(),
    isPopular: z.string().optional(),
    sortBy: z.enum(['name', 'rating', 'visitCount', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
