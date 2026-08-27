import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, jsonCreated, requireAdmin, readBody, validateBody } from '@/lib/api-route';
import { heroService } from '@server/services/hero.service';
import { socialLinkSchema } from '@server/validations/hero.validation';

export const GET = apiHandler(async (req: NextRequest) => {
  const links = await heroService.getSocialLinks();
  return jsonSuccess(links);
});

export const POST = apiHandler(async (req: NextRequest) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const body = await readBody(req);
  const result = await validateBody(socialLinkSchema, body);
  if (result.error) return result.error;

  const created = await heroService.createSocialLink(admin.adminId, result.data);
  return jsonCreated(created);
});
