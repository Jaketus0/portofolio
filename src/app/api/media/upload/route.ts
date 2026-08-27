import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonCreated, requireAdmin } from '@/lib/api-route';
import { mediaService } from '@server/services/media.service';

export const POST = apiHandler(async (req: NextRequest) => {
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const admin = adminOrRes;

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const folder = (formData.get('folder') as string) || '/';
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split('.').pop() || '';
  const filename = `${crypto.randomUUID()}.${ext}`;
  const fs = await import('fs');
  const pathMod = await import('path');

  let subfolder = 'media';
  if (file.type.startsWith('image/')) subfolder = 'images';
  else if (file.type === 'application/pdf' || file.type.includes('word')) subfolder = 'documents';

  const uploadDir = pathMod.join(process.cwd(), 'uploads', subfolder);
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.writeFileSync(pathMod.join(uploadDir, filename), buffer);

  const fileInfo = {
    filename,
    originalname: file.name,
    mimetype: file.type,
    size: file.size,
    path: pathMod.join(uploadDir, filename),
    url: `/uploads/${subfolder}/${filename}`,
  };

  const result = await mediaService.uploadFile(admin.adminId, fileInfo as any, folder);
  return jsonCreated(result);
});