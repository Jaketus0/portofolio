import prisma from '../utils/prisma';
import { MessageStatus } from '@prisma/client';

export const messageRepository = {
  findPublic() {
    return prisma.guestMessage.findMany({
      where: { status: 'APPROVED' },
      orderBy: [{ pinned: 'desc' }, { pinnedAt: 'desc' }, { createdAt: 'desc' }],
    });
  },

  findAll(status?: MessageStatus) {
    const where = status ? { status } : {};
    return prisma.guestMessage.findMany({
      where,
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    });
  },

  findById(id: string) {
    return prisma.guestMessage.findUnique({ where: { id } });
  },

  create(data: { name: string; message: string; rotation: number; status?: MessageStatus }) {
    return prisma.guestMessage.create({ data });
  },

  approve(id: string) {
    return prisma.guestMessage.update({ where: { id }, data: { status: 'APPROVED' } });
  },

  hide(id: string) {
    return prisma.guestMessage.update({ where: { id }, data: { status: 'HIDDEN' } });
  },

  pin(id: string) {
    return prisma.guestMessage.update({
      where: { id },
      data: { pinned: true, pinnedAt: new Date() },
    });
  },

  unpin(id: string) {
    return prisma.guestMessage.update({
      where: { id },
      data: { pinned: false, pinnedAt: null },
    });
  },

  delete(id: string) {
    return prisma.guestMessage.delete({ where: { id } });
  },

  countByStatus() {
    return prisma.guestMessage.groupBy({
      by: ['status'],
      _count: { id: true },
    });
  },

  countPinned() {
    return prisma.guestMessage.count({ where: { pinned: true } });
  },
};
