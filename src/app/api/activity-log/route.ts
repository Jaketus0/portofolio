import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin } from '@/lib/api-route';
import { activityRepository } from '@server/repositories/settings.repository';

export const GET = apiHandler(async (req: NextRequest) => {
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const limitParam = new URL(req.url).searchParams.get('limit');
  const limit = limitParam ? Number(limitParam) : undefined;
  const result = await activityRepository.findRecent(limit);
  return jsonSuccess(result);
});
