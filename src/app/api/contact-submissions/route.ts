import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonSuccess, jsonCreated, jsonBadRequest, requireAdmin, readBody, validateBody, rateLimiter } from '@/lib/api-route';
import { contactSubmissionService } from '@server/services/contact-submission.service';
import { createContactSubmissionSchema } from '@server/validations/contact-submission.validation';
import { verifyCaptchaChallenge } from '@server/utils/captcha.util';

export const GET = apiHandler(async (req: NextRequest) => {
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const status = new URL(req.url).searchParams.get('status') ?? undefined;
  const result = await contactSubmissionService.getAll(status);
  return jsonSuccess(result);
});

export const POST = apiHandler(async (req: NextRequest) => {
  const rl = rateLimiter(req, 60_000, 20);
  if (rl) return rl;
  const body = await readBody(req);
  const { data, error } = await validateBody(createContactSubmissionSchema, body);
  if (error) return error;
  const valid = verifyCaptchaChallenge(data.captchaToken, data.captchaAnswer);
  if (!valid) return jsonBadRequest('Invalid or expired captcha');
  const result = await contactSubmissionService.createSubmission({
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    message: data.message,
  });
  return jsonCreated(result);
});