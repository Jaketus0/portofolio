import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await ctx.params;
  const safePath = path.join(process.cwd(), 'uploads', ...segments);
  const resolved = path.resolve(safePath);

  // Prevent path traversal outside uploads dir
  const uploadsRoot = path.resolve(process.cwd(), 'uploads');
  if (!resolved.startsWith(uploadsRoot)) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
      return new NextResponse('Not found', { status: 404 });
    }
    const buf = fs.readFileSync(resolved);
    const ext = path.extname(resolved).slice(1);
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
    };
    return new NextResponse(buf, {
      headers: { 'Content-Type': mimeMap[ext] || 'application/octet-stream' },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
