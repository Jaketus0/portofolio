import prisma from '../utils/prisma';
import { SkillCategory } from '@prisma/client';

export const skillRepository = {
  findAll() {
    return prisma.skill.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  },

  findAllAdmin() {
    return prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } });
  },

  findById(id: string) {
    return prisma.skill.findUnique({ where: { id } });
  },

  findByCategory(category: SkillCategory) {
    return prisma.skill.findMany({
      where: { category, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  },

  create(data: { name: string; icon?: string; category: SkillCategory; sortOrder?: number }) {
    return prisma.skill.create({ data });
  },

  update(id: string, data: Record<string, unknown>) {
    return prisma.skill.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.skill.delete({ where: { id } });
  },

  reorder(items: { id: string; sortOrder: number }[]) {
    return prisma.$transaction(
      items.map((item) =>
        prisma.skill.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
      )
    );
  },

  async findGroupedByCategory() {
    const skills = await prisma.skill.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    const grouped: Record<string, typeof skills> = {};
    for (const skill of skills) {
      if (!grouped[skill.category]) grouped[skill.category] = [];
      grouped[skill.category].push(skill);
    }
    return grouped;
  },
};
