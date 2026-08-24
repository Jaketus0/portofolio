import prisma from '../utils/prisma';

export const heroRepository = {
  findActive() {
    return prisma.heroSection.findFirst({
      where: { isActive: true },
      include: { socialLinks: { orderBy: { sortOrder: 'asc' } } },
    });
  },

  findById(id: string) {
    return prisma.heroSection.findUnique({
      where: { id },
      include: { socialLinks: { orderBy: { sortOrder: 'asc' } } },
    });
  },

  update(id: string, data: Record<string, unknown>) {
    return prisma.heroSection.update({
      where: { id },
      data,
      include: { socialLinks: { orderBy: { sortOrder: 'asc' } } },
    });
  },

  // Social Links
  createSocialLink(heroId: string, data: Record<string, unknown>) {
    return prisma.socialLink.create({ data: { ...data, heroId } as any });
  },

  updateSocialLink(id: string, data: Record<string, unknown>) {
    return prisma.socialLink.update({ where: { id }, data });
  },

  deleteSocialLink(id: string) {
    return prisma.socialLink.delete({ where: { id } });
  },

  findSocialLink(id: string) {
    return prisma.socialLink.findUnique({ where: { id } });
  },

  findAllSocialLinks(heroId: string) {
    return prisma.socialLink.findMany({
      where: { heroId },
      orderBy: { sortOrder: 'asc' },
    });
  },
};
