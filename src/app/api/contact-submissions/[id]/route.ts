import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin } from '@/lib/api-route';
import { contactSubmissionService } from '@server/services/contact-submission.service';

export const DELETE = apiHandler(async (req: NextRequest, ctx: any) => {
  const { id } = await ctx.params;
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const admin = adminOrRes;
  const result = await contactSubmissionService.deleteSubmission(admin.adminId, id);
  return jsonSuccess(result);
});