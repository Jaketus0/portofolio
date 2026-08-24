import { z } from 'zod';

export const createSkillSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  icon: z.string().optional(),
  category: z.enum([
    'PROGRAMMING_LANGUAGE', 'FRAMEWORK', 'LIBRARY', 'DATABASE',
    'DEVOPS', 'CLOUD', 'CYBERSECURITY', 'TOOLS', 'OTHERS',
  ]),
  sortOrder: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateSkillSchema = createSkillSchema.partial();

export const reorderSkillsSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    sortOrder: z.number(),
  })),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
export type ReorderSkillsInput = z.infer<typeof reorderSkillsSchema>;
