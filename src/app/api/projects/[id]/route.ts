import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, jsonNotFound, requireAdmin, readBody, validateBody } from '@/lib/api-route';
import { projectService } from '@server/services/project.service';
import { updateProjectSchema } from '@server/validations/project.validation';

export const GET = apiHandler(async (req: NextRequest, ctx: any) => {
  const { id } = await ctx.params;
  const project = await projectService.getProjectById(id);
  if (!project) return jsonNotFound('Project');
  return jsonSuccess(project);
});

export const PUT = apiHandler(async (req: NextRequest, ctx: any) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { id } = await ctx.params;
  const body = await readBody(req);
  const result = await validateBody(updateProjectSchema, body);
  if (result.error) return result.error;

  const updated = await projectService.updateProject(admin.adminId, id, result.data);
  return jsonSuccess(updated, 'Project updated');
});

export const DELETE = apiHandler(async (req: NextRequest, ctx: any) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { id } = await ctx.params;
  await projectService.deleteProject(admin.adminId, id);
  return jsonSuccess(null, 'Project deleted');
});
