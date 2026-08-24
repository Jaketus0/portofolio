import { z } from 'zod';

export const updateHeroSchema = z.object({
  greeting: z.string().min(1).max(100).optional(),
  name: z.string().min(1).max(100).optional(),
  jobTitle: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  ctaText: z.string().min(1).max(50).optional(),
  ctaLink: z.string().min(1).optional(),
  backgroundImage: z.string().optional(),
  backgroundMusic: z.string().optional(),
  heroImage: z.string().optional(),
  techStack: z.string().optional(),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Invalid URL'),
  icon: z.string().optional(),
  sortOrder: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export type UpdateHeroInput = z.infer<typeof updateHeroSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
