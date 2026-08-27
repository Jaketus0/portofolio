import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin, readBody, validateBody } from '@/lib/api-route';
import { heroService } from '@server/services/hero.service';
import { socialLinkSchema } from '@server/validations/hero.validation';

export const PUT = apiHandler(async (req: NextRequest, ctx: any) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { id } = await ctx.params;
  const body = await readBody(req);
  const result = await validateBody(socialLinkSchema, body);
  if (result.error) return result.error;

  const updated = await heroService.updateSocialLink(admin.adminId, id, result.data);
  return jsonSuccess(updated);
});

export const DELETE = apiHandler(async (req: NextRequest, ctx: any) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { id } = await ctx.params;
  await heroService.deleteSocialLink(admin.adminId, id);
  return jsonSuccess(null, 'Social link deleted');
});
