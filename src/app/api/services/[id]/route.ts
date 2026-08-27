import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin, readBody, validateBody } from '@/lib/api-route';
import { serviceService } from '@server/services/service.service';
import { updateServiceSchema } from '@server/validations/service.validation';

export const PUT = apiHandler(async (req: NextRequest, ctx: any) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { id } = await ctx.params;
  const body = await readBody(req);
  const result = await validateBody(updateServiceSchema, body);
  if (result.error) return result.error;

  const updated = await serviceService.updateService(admin.adminId, id, result.data);
  return jsonSuccess(updated, 'Service updated');
});

export const DELETE = apiHandler(async (req: NextRequest, ctx: any) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { id } = await ctx.params;
  await serviceService.deleteService(admin.adminId, id);
  return jsonSuccess(null, 'Service deleted');
});
