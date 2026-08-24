import prisma from '../utils/prisma';

export const aboutRepository = {
  findActive() {
    return prisma.aboutSection.findFirst({
      where: { isActive: true },
      include: { timelines: { orderBy: { sortOrder: 'asc' } } },
    });
  },

  findById(id: string) {
    return prisma.aboutSection.findUnique({
      where: { id },
      include: { timelines: { orderBy: { sortOrder: 'asc' } } },
    });
  },

  update(id: string, data: Record<string, unknown>) {
    return prisma.aboutSection.update({
      where: { id },
      data,
      include: { timelines: { orderBy: { sortOrder: 'asc' } } },
    });
  },

  // Timeline
  createTimeline(aboutId: string, data: Record<string, unknown>) {
    return prisma.timeline.create({ data: { ...data, aboutId } as any });
  },

  updateTimeline(id: string, data: Record<string, unknown>) {
    return prisma.timeline.update({ where: { id }, data });
  },

  deleteTimeline(id: string) {
    return prisma.timeline.delete({ where: { id } });
  },

  findTimeline(id: string) {
    return prisma.timeline.findUnique({ where: { id } });
  },

  findAllTimelines(aboutId: string) {
    return prisma.timeline.findMany({
      where: { aboutId },
      orderBy: { sortOrder: 'asc' },
    });
  },

  reorderTimelines(items: { id: string; sortOrder: number }[]) {
    return prisma.$transaction(
      items.map((item) =>
        prisma.timeline.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
      )
    );
  },
};
