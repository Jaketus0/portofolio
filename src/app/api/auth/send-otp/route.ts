import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, readBody, jsonBadRequest } from '@/lib/api-route';
import { authService } from '@server/services/auth.service';

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await readBody(req);
  const email = body.email as string;

  if (!email) {
    return jsonBadRequest('Email is required');
  }

  const result = await authService.requestOtp(email);
  return jsonSuccess(null, result.message);
});
