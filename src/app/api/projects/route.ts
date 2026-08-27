import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, jsonCreated, requireAdmin, readBody, validateBody, getAdmin } from '@/lib/api-route';
import { projectService } from '@server/services/project.service';
import { createProjectSchema } from '@server/validations/project.validation';

export const GET = apiHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const filters = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    featured: searchParams.has('featured') ? searchParams.get('featured') === 'true' : undefined,
    status: searchParams.get('status') || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
  };
  const isAdmin = !!getAdmin(req);
  const result = await projectService.getProjects(filters, isAdmin);
  return jsonSuccess(result.data, 'Projects retrieved', 200, result.meta);
});

export const POST = apiHandler(async (req: NextRequest) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const body = await readBody(req);
  const result = await validateBody(createProjectSchema, body);
  if (result.error) return result.error;

  const created = await projectService.createProject(admin.adminId, result.data);
  return jsonCreated(created, 'Project created');
});
