import { contactRepository } from '../repositories/contact.repository';
import { activityRepository } from '../repositories/settings.repository';

export const contactService = {
  async getContactInfo() {
    return contactRepository.findFirst();
  },

  async updateContactInfo(adminId: string, data: Record<string, unknown>) {
    let contact = await contactRepository.findFirst();
    if (contact) {
        contact = await contactRepository.update(contact.id, data);
    } else {
        contact = await contactRepository.upsert(data);
    }
    
    await activityRepository.create({ action: 'UPDATE', entity: 'ContactInfo', entityId: contact.id, adminId });
    return contact;
  }
};
