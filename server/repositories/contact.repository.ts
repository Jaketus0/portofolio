import prisma from '../utils/prisma';

export const contactRepository = {
  findFirst() {
    return prisma.contactInfo.findFirst();
  },

  update(id: string, data: Record<string, unknown>) {
    return prisma.contactInfo.update({ where: { id }, data });
  },

  upsert(data: Record<string, unknown>) {
    return prisma.contactInfo.upsert({
      where: { id: (data.id as string) || 'default' },
      update: data,
      create: data as any,
    });
  },
};
