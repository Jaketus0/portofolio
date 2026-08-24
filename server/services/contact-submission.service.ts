import { contactSubmissionRepository, SubmissionStatusValue } from '../repositories/contact-submission.repository';
import { activityRepository } from '../repositories/settings.repository';

export const contactSubmissionService = {
  async createSubmission(data: { fullName: string; phone: string; email: string; message: string }) {
    return contactSubmissionRepository.create(data);
  },

  async getAll(status?: string) {
    const valid: SubmissionStatusValue | 'ALL' =
      status === 'PENDING' || status === 'READ' || status === 'ARCHIVED' ? status : 'ALL';
    return contactSubmissionRepository.findAll(valid);
  },

  async updateStatus(adminId: string, id: string, status: SubmissionStatusValue) {
    if (status !== 'PENDING' && status !== 'READ' && status !== 'ARCHIVED') {
      throw new Error('Invalid status');
    }
    const item = await contactSubmissionRepository.updateStatus(id, status);
    await activityRepository.create({ action: 'UPDATE', entity: 'ContactSubmission', entityId: id, adminId });
    return item;
  },

  async deleteSubmission(adminId: string, id: string) {
    await contactSubmissionRepository.delete(id);
    await activityRepository.create({ action: 'DELETE', entity: 'ContactSubmission', entityId: id, adminId });
    return true;
  },
};