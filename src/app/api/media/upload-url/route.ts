import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonError, jsonSuccess, requireAdmin } from '@/lib/api-route';
import { createUploadUrl } from '@/lib/storage';

export const POST = apiHandler(async (req: NextRequest) => {
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;

  const body = await req.json().catch(() => null);
  const name = body?.name as string | undefined;
  const type = body?.type as string | undefined;
  if (!name) return jsonError('File name required', 400);

  let subfolder = 'media';
  if (type?.startsWith('image/')) subfolder = 'images';
  else if (type === 'application/pdf' || type?.includes('word')) subfolder = 'documents';

  const ext = name.includes('.') ? name.split('.').pop() : '';
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext ? `.${ext}` : ''}`;
  const path = `${subfolder}/${filename}`;

  const signedUrl = await createUploadUrl(path);
  if (!signedUrl) return jsonError('Storage not configured', 503);

  return jsonSuccess({ path, signedUrl });
});
