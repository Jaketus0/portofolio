import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess } from '@/lib/api-route';
import { messageService } from '@server/services/message.service';

export const GET = apiHandler(async (req: NextRequest) => {
  const result = await messageService.getPublicMessages();
  return jsonSuccess(result);
});
