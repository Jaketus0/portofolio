import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, jsonBadRequest, readBody } from '@/lib/api-route';
import { verifyRefreshToken, generateAccessToken } from '@server/utils/jwt';
import { authRepository } from '@server/repositories/auth.repository';

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await readBody(req);
  const { refreshToken } = body;

  if (!refreshToken) {
    return jsonBadRequest('Refresh token is required');
  }

  const stored = await authRepository.findRefreshToken(refreshToken as string);
  if (!stored) {
    return jsonBadRequest('Invalid refresh token');
  }

  const payload = verifyRefreshToken(refreshToken as string);

  const admin = await authRepository.findAdminById(payload.adminId);
  if (!admin) {
    return jsonBadRequest('Admin not found');
  }

  const accessToken = generateAccessToken({
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
  });

  return jsonSuccess({ accessToken, refreshToken });
});
