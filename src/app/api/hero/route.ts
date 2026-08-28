import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin, readBody } from '@/lib/api-route';
import { heroService } from '@server/services/hero.service';

export const GET = apiHandler(async (req: NextRequest) => {
  const hero = await heroService.getHero();
  return jsonSuccess(hero);
});

export const PUT = apiHandler(async (req: NextRequest) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const body = await readBody(req);
  const updated = await heroService.updateHero(admin.adminId, body);
  return jsonSuccess(updated);
});
