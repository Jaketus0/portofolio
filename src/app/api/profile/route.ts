import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin, readBody } from '@/lib/api-route';
import { profileService } from '@server/services/profile.service';

export const GET = apiHandler(async (req: NextRequest) => {
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const admin = adminOrRes;
  const result = await profileService.getProfile(admin.adminId);
  return jsonSuccess(result);
});

export const PUT = apiHandler(async (req: NextRequest) => {
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const admin = adminOrRes;
  const body = await readBody(req);
  const result = await profileService.updateProfile(admin.adminId, body);
  return jsonSuccess(result);
});
