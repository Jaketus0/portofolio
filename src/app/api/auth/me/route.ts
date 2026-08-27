import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin } from '@/lib/api-route';

export const GET = apiHandler(async (req: NextRequest) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  return jsonSuccess(admin, 'Current admin retrieved');
});
