import { z } from 'zod';

export const updateUserStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean().optional(),
    role: z.enum(['USER', 'ADMIN']).optional(),
  }),
});

export const adminQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    role: z.enum(['USER', 'ADMIN']).optional(),
    isActive: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
