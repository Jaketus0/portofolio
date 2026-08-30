import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonCreated, jsonError, requireAdmin } from '@/lib/api-route';
import { mediaService } from '@server/services/media.service';
import { getPublicUrl } from '@/lib/storage';

export const POST = apiHandler(async (req: NextRequest) => {
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const admin = adminOrRes;

  const body = await req.json().catch(() => null);
  const name = body?.name as string | undefined;
  const type = body?.type as string | undefined;
  const size = Number(body?.size) || 0;
  const storagePath = body?.path as string | undefined;
  if (!name || !storagePath) return jsonError('name and path required', 400);

  const publicUrl = getPublicUrl(storagePath);
  if (!publicUrl) return jsonError('Storage not configured', 503);

  const subfolder = storagePath.split('/')[0] || 'media';
  const result = await mediaService.recordExternalFile(
    admin.adminId,
    name,
    type || 'application/octet-stream',
    size,
    subfolder,
    publicUrl
  );
  return jsonCreated(result);
});
