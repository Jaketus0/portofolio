import prisma from '../utils/prisma';
import { Prisma, ProjectStatus } from '@prisma/client';
import { PAGINATION_DEFAULT_LIMIT, PAGINATION_DEFAULT_PAGE } from '../utils/constants';

interface ProjectFilters {
  search?: string;
  category?: string;
  featured?: boolean;
  status?: ProjectStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const projectRepository = {
  async findMany(filters: ProjectFilters) {
    const page = filters.page || PAGINATION_DEFAULT_PAGE;
    const limit = filters.limit || PAGINATION_DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {};

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { shortDescription: { contains: filters.search } },
        { category: { contains: filters.search } },
      ];
    }
    if (filters.category) where.category = filters.category;
    if (filters.featured !== undefined) where.featured = filters.featured;
    if (filters.status) where.status = filters.status;

    const orderBy: Prisma.ProjectOrderByWithRelationInput = {};
    if (filters.sortBy) {
      (orderBy as any)[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.sortOrder = 'asc';
    }

    const [data, total] = await prisma.$transaction([
      prisma.project.findMany({
        where,
        include: { images: { orderBy: { sortOrder: 'asc' } } },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  findPublished(filters: ProjectFilters) {
    return this.findMany({ ...filters, status: 'PUBLISHED' });
  },

  findBySlug(slug: string) {
    return prisma.project.findUnique({
      where: { slug },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
  },

  findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
  },

  create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({
      data,
      include: { images: true },
    });
  },

  update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({
      where: { id },
      data,
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
  },

  delete(id: string) {
    return prisma.project.delete({ where: { id } });
  },

  addImage(projectId: string, data: { url: string; caption?: string; sortOrder?: number }) {
    return prisma.projectImage.create({ data: { ...data, projectId } });
  },

  removeImage(imageId: string) {
    return prisma.projectImage.delete({ where: { id: imageId } });
  },

  findImage(imageId: string) {
    return prisma.projectImage.findUnique({ where: { id: imageId } });
  },

  countByCategory() {
    return prisma.project.groupBy({
      by: ['category'],
      _count: { id: true },
      where: { status: 'PUBLISHED' },
    });
  },
};
