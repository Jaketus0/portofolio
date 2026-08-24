import { serviceRepository } from '../repositories/service.repository';
import { activityRepository } from '../repositories/settings.repository';

export const serviceService = {
  async getPublicServices() {
    return serviceRepository.findPublic();
  },

  async getAllServices() {
    return serviceRepository.findAll();
  },

  async createService(adminId: string, data: any) {
    const service = await serviceRepository.create(data);
    await activityRepository.create({ action: 'CREATE', entity: 'Service', entityId: service.id, adminId });
    return service;
  },

  async updateService(adminId: string, id: string, data: any) {
    const service = await serviceRepository.update(id, data);
    await activityRepository.create({ action: 'UPDATE', entity: 'Service', entityId: id, adminId });
    return service;
  },

  async deleteService(adminId: string, id: string) {
    await serviceRepository.delete(id);
    await activityRepository.create({ action: 'DELETE', entity: 'Service', entityId: id, adminId });
    return true;
  },
};