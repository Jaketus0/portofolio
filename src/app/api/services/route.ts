import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, jsonCreated, requireAdmin, readBody, validateBody } from '@/lib/api-route';
import { serviceService } from '@server/services/service.service';
import { createServiceSchema } from '@server/validations/service.validation';

export const GET = apiHandler(async (req: NextRequest) => {
  const services = await serviceService.getPublicServices();
  return jsonSuccess(services);
});

export const POST = apiHandler(async (req: NextRequest) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const body = await readBody(req);
  const result = await validateBody(createServiceSchema, body);
  if (result.error) return result.error;

  const created = await serviceService.createService(admin.adminId, result.data);
  return jsonCreated(created, 'Service created');
});
