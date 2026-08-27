import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, jsonNotFound } from '@/lib/api-route';
import { projectService } from '@server/services/project.service';

export const GET = apiHandler(async (req: NextRequest, ctx: any) => {
  const { slug } = await ctx.params;
  const project = await projectService.getProjectBySlug(slug);
  if (!project) return jsonNotFound('Project');
  return jsonSuccess(project);
});
