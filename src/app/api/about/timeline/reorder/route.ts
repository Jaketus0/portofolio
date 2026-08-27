import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin, readBody } from '@/lib/api-route';
import { aboutService } from '@server/services/about.service';

export const PUT = apiHandler(async (req: NextRequest) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const body = await readBody(req);
  const updated = await aboutService.reorderTimelines(admin.adminId, body.items as { id: string; sortOrder: number }[]);
  return jsonSuccess(updated);
});
