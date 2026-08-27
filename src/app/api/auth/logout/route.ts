import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, readBody, requireAdmin } from '@/lib/api-route';
import { authService } from '@server/services/auth.service';

export const POST = apiHandler(async (req: NextRequest) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const body = await readBody(req);
  const { refreshToken } = body;

  await authService.logout((refreshToken as string) || '', admin.adminId);

  const response = jsonSuccess(null, 'Logout successful');
  response.cookies.delete('accessToken');
  return response;
});
