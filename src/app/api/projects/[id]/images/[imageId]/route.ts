import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin } from '@/lib/api-route';
import { projectService } from '@server/services/project.service';

export const DELETE = apiHandler(async (req: NextRequest, ctx: any) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { imageId } = await ctx.params;
  await projectService.removeProjectImage(admin.adminId, imageId);
  return jsonSuccess(null, 'Image removed');
});
