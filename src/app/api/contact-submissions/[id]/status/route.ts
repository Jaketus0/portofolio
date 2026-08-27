import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin, readBody } from '@/lib/api-route';
import { contactSubmissionService } from '@server/services/contact-submission.service';

export const PUT = apiHandler(async (req: NextRequest, ctx: any) => {
  const { id } = await ctx.params;
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const admin = adminOrRes;
  const body = await readBody(req);
  const result = await contactSubmissionService.updateStatus(admin.adminId, id, body.status as any);
  return jsonSuccess(result);
});