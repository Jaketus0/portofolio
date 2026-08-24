import { messageRepository } from '../repositories/message.repository';
import { activityRepository } from '../repositories/settings.repository';

export const messageService = {
  async getPublicMessages() {
    return messageRepository.findPublic();
  },

  async getAllMessages(status?: any) {
    return messageRepository.findAll(status);
  },

  async submitMessage(data: { name: string; message: string }) {
    // Generate random slight rotation for sticky note (-3 to 3 degrees)
    const rotation = (Math.random() * 6) - 3;
    // Auto-approve: tampil langsung di wall publik
    return messageRepository.create({ ...data, rotation, status: 'APPROVED' });
  },

  async approveMessage(adminId: string, id: string) {
    const msg = await messageRepository.approve(id);
    await activityRepository.create({ action: 'APPROVE', entity: 'GuestMessage', entityId: id, adminId });
    return msg;
  },

  async hideMessage(adminId: string, id: string) {
    const msg = await messageRepository.hide(id);
    await activityRepository.create({ action: 'HIDE', entity: 'GuestMessage', entityId: id, adminId });
    return msg;
  },

  async pinMessage(adminId: string, id: string) {
    const msg = await messageRepository.pin(id);
    await activityRepository.create({ action: 'PIN', entity: 'GuestMessage', entityId: id, adminId });
    return msg;
  },

  async unpinMessage(adminId: string, id: string) {
    const msg = await messageRepository.unpin(id);
    await activityRepository.create({ action: 'UNPIN', entity: 'GuestMessage', entityId: id, adminId });
    return msg;
  },

  async deleteMessage(adminId: string, id: string) {
    await messageRepository.delete(id);
    await activityRepository.create({ action: 'DELETE', entity: 'GuestMessage', entityId: id, adminId });
    return true;
  }
};
