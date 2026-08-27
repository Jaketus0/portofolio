import { NextRequest } from 'next/server';
import { apiHandler, jsonCreated, requireAdmin, readBody } from '@/lib/api-route';
import { aboutService } from '@server/services/about.service';

export const POST = apiHandler(async (req: NextRequest) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const body = await readBody(req);
  const created = await aboutService.createTimeline(admin.adminId, body);
  return jsonCreated(created);
});
