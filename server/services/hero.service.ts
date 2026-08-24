import { heroRepository } from '../repositories/hero.repository';
import { activityRepository } from '../repositories/settings.repository';

export const heroService = {
  async getHero() {
    return heroRepository.findActive();
  },

  async updateHero(adminId: string, data: Record<string, unknown>) {
    let hero = await heroRepository.findActive();
    if (!hero) {
      throw new Error('Hero section not initialized');
    }
    
    hero = await heroRepository.update(hero.id, data);
    
    await activityRepository.create({
      action: 'UPDATE',
      entity: 'HeroSection',
      entityId: hero.id,
      adminId,
    });
    
    return hero;
  },

  // Social Links
  async getSocialLinks() {
    const hero = await heroRepository.findActive();
    if (!hero) return [];
    return heroRepository.findAllSocialLinks(hero.id);
  },

  async createSocialLink(adminId: string, data: Record<string, unknown>) {
    const hero = await heroRepository.findActive();
    if (!hero) throw new Error('Hero section not initialized');
    
    const link = await heroRepository.createSocialLink(hero.id, data);
    await activityRepository.create({ action: 'CREATE', entity: 'SocialLink', entityId: link.id, adminId });
    return link;
  },

  async updateSocialLink(adminId: string, id: string, data: Record<string, unknown>) {
    const link = await heroRepository.updateSocialLink(id, data);
    await activityRepository.create({ action: 'UPDATE', entity: 'SocialLink', entityId: id, adminId });
    return link;
  },

  async deleteSocialLink(adminId: string, id: string) {
    await heroRepository.deleteSocialLink(id);
    await activityRepository.create({ action: 'DELETE', entity: 'SocialLink', entityId: id, adminId });
    return true;
  }
};
