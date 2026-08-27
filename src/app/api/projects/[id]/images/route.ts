import { NextRequest } from 'next/server';
import { apiHandler, jsonCreated, requireAdmin, readBody } from '@/lib/api-route';
import { projectService } from '@server/services/project.service';

export const POST = apiHandler(async (req: NextRequest, ctx: any) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { id } = await ctx.params;
  const body = await readBody(req);
  const image = await projectService.addProjectImage(admin.adminId, id, body);
  return jsonCreated(image, 'Image added');
});
