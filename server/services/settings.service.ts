import { settingsRepository } from '../repositories/settings.repository';
import { activityRepository } from '../repositories/settings.repository';

export const settingsService = {
  async getSettings() {
    return settingsRepository.findFirst();
  },

  async updateSettings(adminId: string, data: any) {
    let settings = await settingsRepository.findFirst();
    if (!settings) throw new Error('Settings not initialized');
    
    settings = await settingsRepository.update(settings.id, data);
    await activityRepository.create({ action: 'UPDATE', entity: 'SiteSettings', entityId: settings.id, adminId });
    return settings;
  },

  async getRecentActivities(limit?: number) {
      return activityRepository.findRecent(limit);
  }
};
