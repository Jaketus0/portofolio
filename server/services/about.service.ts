import { aboutRepository } from '../repositories/about.repository';
import { activityRepository } from '../repositories/settings.repository';

export const aboutService = {
  async getAbout() {
    return aboutRepository.findActive();
  },

  async updateAbout(adminId: string, data: Record<string, unknown>) {
    let about = await aboutRepository.findActive();
    if (!about) throw new Error('About section not initialized');
    
    about = await aboutRepository.update(about.id, data);
    await activityRepository.create({ action: 'UPDATE', entity: 'AboutSection', entityId: about.id, adminId });
    return about;
  },

  // Timeline
  async createTimeline(adminId: string, data: Record<string, unknown>) {
    const about = await aboutRepository.findActive();
    if (!about) throw new Error('About section not initialized');
    
    const timeline = await aboutRepository.createTimeline(about.id, data);
    await activityRepository.create({ action: 'CREATE', entity: 'Timeline', entityId: timeline.id, adminId });
    return timeline;
  },

  async updateTimeline(adminId: string, id: string, data: Record<string, unknown>) {
    const timeline = await aboutRepository.updateTimeline(id, data);
    await activityRepository.create({ action: 'UPDATE', entity: 'Timeline', entityId: id, adminId });
    return timeline;
  },

  async deleteTimeline(adminId: string, id: string) {
    await aboutRepository.deleteTimeline(id);
    await activityRepository.create({ action: 'DELETE', entity: 'Timeline', entityId: id, adminId });
    return true;
  },

  async reorderTimelines(adminId: string, items: { id: string; sortOrder: number }[]) {
    await aboutRepository.reorderTimelines(items);
    await activityRepository.create({ action: 'REORDER', entity: 'Timeline', adminId });
    return true;
  }
};
