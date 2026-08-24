import prisma from '../utils/prisma';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';

export const visitorRepository = {
  create(data: {
    ipAddress?: string;
    country?: string;
    city?: string;
    browser?: string;
    os?: string;
    device?: string;
    page: string;
    referrer?: string;
    sessionId: string;
  }) {
    return prisma.visitor.create({ data });
  },

  async getStats() {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    const [total, todayCount, weeklyCount, monthlyCount] = await prisma.$transaction([
      prisma.visitor.count(),
      prisma.visitor.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
      prisma.visitor.count({ where: { createdAt: { gte: weekStart, lte: weekEnd } } }),
      prisma.visitor.count({ where: { createdAt: { gte: monthStart, lte: monthEnd } } }),
    ]);

    return { total, today: todayCount, weekly: weeklyCount, monthly: monthlyCount };
  },

  async getVisitorsPerDay(days: number = 30) {
    const since = subDays(new Date(), days);
    const visitors = await prisma.visitor.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const grouped: Record<string, number> = {};
    for (const v of visitors) {
      const day = v.createdAt.toISOString().split('T')[0];
      grouped[day] = (grouped[day] || 0) + 1;
    }

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  },

  async getTopBrowsers(limit = 5) {
    const result = await prisma.visitor.groupBy({
      by: ['browser'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
      where: { browser: { not: null } },
    });
    return result.map((r) => ({ name: r.browser || 'Unknown', count: r._count.id }));
  },

  async getTopDevices(limit = 5) {
    const result = await prisma.visitor.groupBy({
      by: ['device'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
      where: { device: { not: null } },
    });
    return result.map((r) => ({ name: r.device || 'Unknown', count: r._count.id }));
  },

  async getTopCountries(limit = 10) {
    const result = await prisma.visitor.groupBy({
      by: ['country'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
      where: { country: { not: null } },
    });
    return result.map((r) => ({ name: r.country || 'Unknown', count: r._count.id }));
  },

  async getTopPages(limit = 10) {
    const result = await prisma.visitor.groupBy({
      by: ['page'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });
    return result.map((r) => ({ name: r.page, count: r._count.id }));
  },

  async getTopReferrers(limit = 10) {
    const result = await prisma.visitor.groupBy({
      by: ['referrer'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
      where: { referrer: { not: null } },
    });
    return result.map((r) => ({ name: r.referrer || 'Direct', count: r._count.id }));
  },

  async getUniqueSessionsToday() {
    const todayStart = startOfDay(new Date());
    const result = await prisma.visitor.findMany({
      where: { createdAt: { gte: todayStart } },
      select: { sessionId: true },
      distinct: ['sessionId'],
    });
    return result.length;
  },
};
