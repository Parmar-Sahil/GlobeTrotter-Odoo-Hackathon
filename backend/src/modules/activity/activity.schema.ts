import { z } from 'zod';
import { ActivityCategory } from '../../types/enums';

export const searchActivitySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    destinationId: z.string().optional(),
    city: z.string().optional(),
    category: z.nativeEnum(ActivityCategory).optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    sortBy: z.enum(['popularityScore', 'estimatedCost', 'durationMinutes', 'name', 'createdAt', 'estimatedPrice', 'rating', 'estimatedDurationHours', 'title']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    groupBy: z.enum(['category', 'city']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const createActivitySchema = z.object({
  body: z.object({
    destinationId: z.string().min(1, 'Destination ID is required'),
    title: z.string().min(1, 'Title is required'),
    category: z.nativeEnum(ActivityCategory).optional(),
    description: z.string().min(1, 'Description is required'),
    imageUrl: z.string().url('Valid image URL is required'),
    estimatedPrice: z.number().min(0).optional(),
    estimatedDurationHours: z.number().min(0.1).optional(),
    rating: z.number().min(0).max(5).optional(),
    isPopular: z.boolean().optional(),
    locationAddress: z.string().optional(),
  }),
});
