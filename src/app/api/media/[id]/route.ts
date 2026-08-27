import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin, readBody } from '@/lib/api-route';
import { mediaService } from '@server/services/media.service';

export const PUT = apiHandler(async (req: NextRequest, ctx: any) => {
  const { id } = await ctx.params;
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const admin = adminOrRes;
  const body = await readBody(req);
  const result = await mediaService.updateFile(admin.adminId, id, body);
  return jsonSuccess(result);
});

export const DELETE = apiHandler(async (req: NextRequest, ctx: any) => {
  const { id } = await ctx.params;
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const admin = adminOrRes;
  const result = await mediaService.deleteFile(admin.adminId, id);
  return jsonSuccess(result);
});