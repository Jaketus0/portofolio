import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess } from '@/lib/api-route';
import { generateCaptchaChallenge } from '@server/utils/captcha.util';

export const GET = apiHandler(async (req: NextRequest) => {
  const result = generateCaptchaChallenge();
  return jsonSuccess(result);
});