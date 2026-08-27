import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin } from '@/lib/api-route';
import { visitorService } from '@server/services/visitor.service';

export const GET = apiHandler(async (req: NextRequest) => {
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const result = await visitorService.getVisitorAnalytics();
  return jsonSuccess(result);
});
