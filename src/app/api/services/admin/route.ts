import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin } from '@/lib/api-route';
import { serviceService } from '@server/services/service.service';

export const GET = apiHandler(async (req: NextRequest) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const services = await serviceService.getAllServices();
  return jsonSuccess(services);
});
