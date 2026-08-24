import { profileRepository, activityRepository } from '../repositories/settings.repository';
import { authRepository } from '../repositories/auth.repository';

export const profileService = {
  async getProfile(adminId: string) {
    return profileRepository.findById(adminId);
  },

  async updateProfile(adminId: string, data: any) {
    // Only allow updating name and avatar
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;

    const profile = await profileRepository.update(adminId, updateData);
    await activityRepository.create({ action: 'UPDATE', entity: 'AdminProfile', adminId });
    
    return profile;
  }
};
