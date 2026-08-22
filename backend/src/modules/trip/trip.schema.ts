import { z } from 'zod';
import { TripStatus, ActivityCategory } from '../../types/enums';

export const createTripSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Trip title is required'),
    destinationId: z.string().optional(),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Valid start date required'),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Valid end date required'),
    totalBudget: z.number().min(0).optional(),
    coverImage: z.string().url().optional().or(z.literal('')),
    notes: z.string().optional(),
  }),
});

export const updateTripSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    destinationId: z.string().optional(),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Valid start date required').optional(),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Valid end date required').optional(),
    status: z.nativeEnum(TripStatus).optional(),
    totalBudget: z.number().min(0).optional(),
    coverImage: z.string().url().optional().or(z.literal('')),
    notes: z.string().optional(),
  }),
});

export const createSectionSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Section title is required'),
    description: z.string().optional(),
    sectionOrder: z.number().int().min(1).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    allocatedBudget: z.number().min(0).optional(),
  }),
});

export const createItemSchema = z.object({
  body: z.object({
    activityId: z.string().optional(),
    title: z.string().min(1, 'Item title is required'),
    category: z.nativeEnum(ActivityCategory).optional(),
    dayNumber: z.number().int().min(1).optional(),
    itemOrder: z.number().int().min(1).optional(),
    expense: z.number().min(0).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    location: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const tripQuerySchema = z.object({
  query: z.object({
    status: z.nativeEnum(TripStatus).optional(),
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.enum(['startDate', 'endDate', 'title', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
