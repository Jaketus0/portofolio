import { Request, Response, NextFunction } from 'express';
import { mediaService } from '../services/media.service';
import { sendSuccess, sendBadRequest, sendNotFound } from '../utils/response';

export const mediaController = {
  async getMediaFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const folder = req.query.folder as string;
      const search = req.query.search as string;
      const files = await mediaService.getMediaFiles(folder, search);
      sendSuccess(res, files);
    } catch (error) {
      next(error);
    }
  },

  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        sendBadRequest(res, 'No file uploaded');
        return;
      }
      
      const folderPath = req.body.folder || '/';
      const file = await mediaService.uploadFile(req.admin!.adminId, req.file, folderPath);
      sendSuccess(res, file, 'File uploaded successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateFile(req: Request, res: Response, next: NextFunction) {
    try {
      const file = await mediaService.updateFile(req.admin!.adminId, (req.params.id as string), req.body);
      sendSuccess(res, file, 'File updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      await mediaService.deleteFile(req.admin!.adminId, (req.params.id as string));
      sendSuccess(res, null, 'File deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  async getFolders(req: Request, res: Response, next: NextFunction) {
    try {
      const folders = await mediaService.getFolders();
      sendSuccess(res, folders.map(f => f.folder));
    } catch (error) {
      next(error);
    }
  }
};
