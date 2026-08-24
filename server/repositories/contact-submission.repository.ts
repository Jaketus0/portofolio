import prisma from '../utils/prisma';

export type SubmissionStatusValue = 'PENDING' | 'READ' | 'ARCHIVED';

export const contactSubmissionRepository = {
  findPublic() {
    return prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  },

  findAll(status?: SubmissionStatusValue | 'ALL') {
    const where = status && status !== 'ALL' ? { status } : {};
    return prisma.contactSubmission.findMany({ where, orderBy: { createdAt: 'desc' } });
  },

  findById(id: string) {
    return prisma.contactSubmission.findUnique({ where: { id } });
  },

  create(data: { fullName: string; phone: string; email: string; message: string }) {
    return prisma.contactSubmission.create({ data });
  },

  updateStatus(id: string, status: SubmissionStatusValue) {
    return prisma.contactSubmission.update({ where: { id }, data: { status } });
  },

  delete(id: string) {
    return prisma.contactSubmission.delete({ where: { id } });
  },

  countPending() {
    return prisma.contactSubmission.count({ where: { status: 'PENDING' } });
  },
};