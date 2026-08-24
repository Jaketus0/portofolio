import { visitorRepository } from '../repositories/visitor.repository';

export const visitorService = {
  async trackVisitor(data: any) {
    return visitorRepository.create(data);
  },

  async getAnalyticsStats() {
    return visitorRepository.getStats();
  },

  async getVisitorAnalytics() {
    const [
      visitorsPerDay,
      topBrowsers,
      topDevices,
      topCountries,
      topPages,
      topReferrers
    ] = await Promise.all([
      visitorRepository.getVisitorsPerDay(30),
      visitorRepository.getTopBrowsers(5),
      visitorRepository.getTopDevices(5),
      visitorRepository.getTopCountries(5),
      visitorRepository.getTopPages(10),
      visitorRepository.getTopReferrers(10)
    ]);

    return {
      visitorsPerDay,
      topBrowsers,
      topDevices,
      topCountries,
      topPages,
      topReferrers
    };
  }
};
