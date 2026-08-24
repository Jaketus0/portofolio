import prisma from '../utils/prisma';

export const serviceRepository = {
  findPublic() {
    return prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  },

  findAll() {
    return prisma.service.findMany({ orderBy: { sortOrder: 'asc' } });
  },

  findById(id: string) {
    return prisma.service.findUnique({ where: { id } });
  },

  create(data: { title: string; shortDesc: string; icon?: string; sortOrder?: number; isActive?: boolean }) {
    return prisma.service.create({ data });
  },

  update(id: string, data: Record<string, unknown>) {
    return prisma.service.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.service.delete({ where: { id } });
  },
};