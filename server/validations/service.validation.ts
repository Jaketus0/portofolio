import { z } from 'zod';

export const createServiceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120),
  shortDesc: z.string().min(1, 'Description is required').max(1000),
  icon: z.string().min(1).max(60).optional(),
  sortOrder: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;