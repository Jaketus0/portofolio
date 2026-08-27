import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, readBody, jsonBadRequest } from '@/lib/api-route';
import { authService } from '@server/services/auth.service';

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await readBody(req);
  const { email, code, rememberMe } = body;

  if (!email || !code) {
    return jsonBadRequest('Email and code are required');
  }

  const result = await authService.verifyOtp(
    email as string,
    code as string,
    !!rememberMe
  );

  const response = jsonSuccess(result, 'Login successful');
  response.cookies.set('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60,
  });

  return response;
});
