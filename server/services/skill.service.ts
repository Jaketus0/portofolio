import { skillRepository } from '../repositories/skill.repository';
import { activityRepository } from '../repositories/settings.repository';
import { SkillCategory } from '@prisma/client';

export const skillService = {
  async getSkillsGrouped() {
    return skillRepository.findGroupedByCategory();
  },

  async getAllSkillsAdmin() {
    return skillRepository.findAllAdmin();
  },

  async createSkill(adminId: string, data: any) {
    const skill = await skillRepository.create(data);
    await activityRepository.create({ action: 'CREATE', entity: 'Skill', entityId: skill.id, adminId });
    return skill;
  },

  async updateSkill(adminId: string, id: string, data: any) {
    const skill = await skillRepository.update(id, data);
    await activityRepository.create({ action: 'UPDATE', entity: 'Skill', entityId: id, adminId });
    return skill;
  },

  async deleteSkill(adminId: string, id: string) {
    await skillRepository.delete(id);
    await activityRepository.create({ action: 'DELETE', entity: 'Skill', entityId: id, adminId });
    return true;
  },

  async reorderSkills(adminId: string, items: { id: string; sortOrder: number }[]) {
    await skillRepository.reorder(items);
    await activityRepository.create({ action: 'REORDER', entity: 'Skill', adminId });
    return true;
  }
};
