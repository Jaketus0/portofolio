import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonSuccess, jsonCreated, requireAdmin, readBody, validateBody, rateLimiter } from '@/lib/api-route';
import { messageService } from '@server/services/message.service';
import { createMessageSchema } from '@server/validations/message.validation';

export const GET = apiHandler(async (req: NextRequest) => {
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const status = new URL(req.url).searchParams.get('status') ?? undefined;
  const result = await messageService.getAllMessages(status);
  return jsonSuccess(result);
});

export const POST = apiHandler(async (req: NextRequest) => {
  const rl = rateLimiter(req, 60_000, 5);
  if (rl) return rl;
  const body = await readBody(req);
  const { data, error } = await validateBody(createMessageSchema, body);
  if (error) return error;
  const result = await messageService.submitMessage(data);
  return jsonCreated(result);
});
