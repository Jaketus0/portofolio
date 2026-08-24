import { Request, Response, NextFunction } from 'express';
import { serviceService } from '../services/service.service';
import { sendSuccess } from '../utils/response';

export const serviceController = {
  async getPublicServices(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await serviceService.getPublicServices();
      sendSuccess(res, services);
    } catch (error) {
      next(error);
    }
  },

  async getAllServices(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await serviceService.getAllServices();
      sendSuccess(res, services);
    } catch (error) {
      next(error);
    }
  },

  async createService(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await serviceService.createService(req.admin!.adminId, req.body);
      sendSuccess(res, service, 'Service created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateService(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await serviceService.updateService(req.admin!.adminId, req.params.id as string, req.body);
      sendSuccess(res, service, 'Service updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      await serviceService.deleteService(req.admin!.adminId, req.params.id as string);
      sendSuccess(res, null, 'Service deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};