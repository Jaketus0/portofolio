import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin } from '@/lib/api-route';
import { mediaService } from '@server/services/media.service';

export const GET = apiHandler(async (req: NextRequest) => {
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const url = new URL(req.url);
  const folder = url.searchParams.get('folder') ?? undefined;
  const search = url.searchParams.get('search') ?? undefined;
  const result = await mediaService.getMediaFiles(folder, search);
  return jsonSuccess(result);
});