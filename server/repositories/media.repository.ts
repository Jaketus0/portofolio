import prisma from '../utils/prisma';
import path from 'path';
import fs from 'fs';

export const mediaRepository = {
  findAll(folder?: string, search?: string) {
    const where: Record<string, unknown> = {};
    if (folder) where.folder = folder;
    if (search) {
      where.OR = [
        { filename: { contains: search } },
        { originalName: { contains: search } },
      ];
    }
    return prisma.mediaFile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id: string) {
    return prisma.mediaFile.findUnique({ where: { id } });
  },

  create(data: {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    folder: string;
    path: string;
    url: string;
    width?: number;
    height?: number;
  }) {
    return prisma.mediaFile.create({ data });
  },

  update(id: string, data: Record<string, unknown>) {
    return prisma.mediaFile.update({ where: { id }, data });
  },

  async delete(id: string) {
    const file = await prisma.mediaFile.findUnique({ where: { id } });
    if (file) {
      const fullPath = path.join(process.cwd(), file.path);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
      await prisma.mediaFile.delete({ where: { id } });
    }
    return file;
  },

  getFolders() {
    return prisma.mediaFile.findMany({
      select: { folder: true },
      distinct: ['folder'],
      orderBy: { folder: 'asc' },
    });
  },
};
