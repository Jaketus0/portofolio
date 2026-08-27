import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin, readBody } from '@/lib/api-route';
import { heroService } from '@server/services/hero.service';

export const GET = apiHandler(async (req: NextRequest) => {
  const hero = await heroService.getHero();
  return jsonSuccess(hero);
});

export const PUT = apiHandler(async (req: NextRequest) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const isMultipart = req.headers.get('content-type')?.includes('multipart');

  if (isMultipart) {
    const formData = await req.formData();
    const body: Record<string, any> = {};
    const file = formData.get('heroImage') as File | null;
    for (const [key, value] of formData.entries()) {
      if (key !== 'heroImage') body[key] = value;
    }
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `${crypto.randomUUID()}.${ext}`;
      const fs = await import('fs');
      const path = await import('path');
      const uploadDir = path.join(process.cwd(), 'uploads', 'images');
      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      body.heroImage = `/uploads/images/${filename}`;
    }
    const updated = await heroService.updateHero(admin.adminId, body);
    return jsonSuccess(updated);
  }

  const body = await readBody(req);
  const updated = await heroService.updateHero(admin.adminId, body);
  return jsonSuccess(updated);
});
