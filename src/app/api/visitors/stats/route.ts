import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess } from '@/lib/api-route';
import { visitorService } from '@server/services/visitor.service';

export const GET = apiHandler(async (req: NextRequest) => {
  const result = await visitorService.getAnalyticsStats();
  return jsonSuccess(result);
});
