import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin, readBody } from '@/lib/api-route';
import { aboutService } from '@server/services/about.service';

export const PUT = apiHandler(async (req: NextRequest, ctx: any) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { id } = await ctx.params;
  const body = await readBody(req);
  const updated = await aboutService.updateTimeline(admin.adminId, id, body);
  return jsonSuccess(updated);
});

export const DELETE = apiHandler(async (req: NextRequest, ctx: any) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { id } = await ctx.params;
  await aboutService.deleteTimeline(admin.adminId, id);
  return jsonSuccess(null, 'Timeline deleted');
});
