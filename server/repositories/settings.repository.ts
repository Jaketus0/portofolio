import prisma from '../utils/prisma';

export const settingsRepository = {
  findFirst() {
    return prisma.siteSettings.findFirst();
  },

  update(id: string, data: Record<string, unknown>) {
    return prisma.siteSettings.update({ where: { id }, data });
  },
};

export const profileRepository = {
  findById(id: string) {
    return prisma.admin.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, avatar: true, role: true, lastLoginAt: true, createdAt: true },
    });
  },

  update(id: string, data: Record<string, unknown>) {
    return prisma.admin.update({ where: { id }, data });
  },
};

export const activityRepository = {
  create(data: { action: string; entity: string; entityId?: string; details?: string; adminId: string }) {
    return prisma.activityLog.create({ data });
  },

  findRecent(limit = 20) {
    return prisma.activityLog.findMany({
      include: { admin: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
};
