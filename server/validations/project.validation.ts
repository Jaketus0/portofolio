import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(200).optional(),
  category: z.string().min(1, 'Category is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  fullDescription: z.string().min(1, 'Full description is required'),
  techStack: z.union([z.string(), z.array(z.string())]),
  githubUrl: z.string().url().nullish().or(z.literal('')),
  liveUrl: z.string().url().nullish().or(z.literal('')),
  featured: z.boolean().optional().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional().default('DRAFT'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortOrder: z.number().optional().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
