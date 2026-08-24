import { mediaRepository } from '../repositories/media.repository';
import { activityRepository } from '../repositories/settings.repository';
import sharp from 'sharp';
import path from 'path';

export const mediaService = {
  async getMediaFiles(folder?: string, search?: string) {
    return mediaRepository.findAll(folder, search);
  },

  async uploadFile(adminId: string, file: Express.Multer.File, folderPath = '/') {
    // Process image to get width/height if applicable
    let width: number | undefined = undefined;
    let height: number | undefined = undefined;
    
    if (file.mimetype.startsWith('image/')) {
        try {
            const metadata = await sharp(file.path).metadata();
            width = metadata.width || undefined;
            height = metadata.height || undefined;
        } catch (e) {
            console.error('Error reading image dimensions', e);
        }
    }

    const media = await mediaRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      folder: folderPath,
      path: file.path.replace(process.cwd(), '').replace(/\\/g, '/'),
      url: `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`,
      width,
      height
    });

    await activityRepository.create({ action: 'UPLOAD', entity: 'MediaFile', entityId: media.id, adminId });
    return media;
  },

  async updateFile(adminId: string, id: string, data: Record<string, unknown>) {
    const media = await mediaRepository.update(id, data);
    await activityRepository.create({ action: 'UPDATE', entity: 'MediaFile', entityId: id, adminId });
    return media;
  },

  async deleteFile(adminId: string, id: string) {
    await mediaRepository.delete(id);
    await activityRepository.create({ action: 'DELETE', entity: 'MediaFile', entityId: id, adminId });
    return true;
  },

  async getFolders() {
    return mediaRepository.getFolders();
  }
};
