import { z } from 'zod';

export const updateSettingsSchema = z.object({
  siteName: z.string().min(1).optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  metaTags: z.any().optional(),
  googleAnalyticsId: z.string().optional(),
  theme: z.string().optional(),
  maintenanceMode: z.boolean().optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
