import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin } from '@/lib/api-route';
import { settingsService } from '@server/services/settings.service';

export const GET = apiHandler(async (req: NextRequest) => {
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const limitParam = new URL(req.url).searchParams.get('limit');
  const limit = limitParam ? Number(limitParam) : undefined;
  const result = await settingsService.getRecentActivities(limit);
  return jsonSuccess(result);
});
