import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin } from '@/lib/api-route';
import { messageService } from '@server/services/message.service';

export const PUT = apiHandler(async (req: NextRequest, ctx: any) => {
  const { id } = await ctx.params;
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const admin = adminOrRes;
  const result = await messageService.approveMessage(admin.adminId, id);
  return jsonSuccess(result);
});
