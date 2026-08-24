import { projectRepository } from '../repositories/project.repository';
import { activityRepository } from '../repositories/settings.repository';
import slugify from 'slugify';
import { Prisma } from '@prisma/client';

export const projectService = {
  async getProjects(filters: any, isAdmin = false) {
    if (isAdmin) {
      return projectRepository.findMany(filters);
    }
    return projectRepository.findPublished(filters);
  },

  async getProjectBySlug(slug: string) {
    return projectRepository.findBySlug(slug);
  },

  async getProjectById(id: string) {
    return projectRepository.findById(id);
  },

  async createProject(adminId: string, data: any) {
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = slugify(data.title, { lower: true, strict: true });
    }
    
    // Ensure slug is unique
    const existing = await projectRepository.findBySlug(data.slug);
    if (existing) {
      data.slug = `${data.slug}-${Date.now()}`;
    }

    if (Array.isArray(data.techStack)) {
        data.techStack = JSON.stringify(data.techStack);
    }

    const project = await projectRepository.create(data);
    await activityRepository.create({ action: 'CREATE', entity: 'Project', entityId: project.id, adminId });
    return project;
  },

  async updateProject(adminId: string, id: string, data: any) {
    if (data.title && !data.slug) {
      data.slug = slugify(data.title, { lower: true, strict: true });
    }
    if (Array.isArray(data.techStack)) {
        data.techStack = JSON.stringify(data.techStack);
    }
    const project = await projectRepository.update(id, data);
    await activityRepository.create({ action: 'UPDATE', entity: 'Project', entityId: id, adminId });
    return project;
  },

  async deleteProject(adminId: string, id: string) {
    await projectRepository.delete(id);
    await activityRepository.create({ action: 'DELETE', entity: 'Project', entityId: id, adminId });
    return true;
  },

  async addProjectImage(adminId: string, projectId: string, data: any) {
    const image = await projectRepository.addImage(projectId, data);
    await activityRepository.create({ action: 'CREATE', entity: 'ProjectImage', entityId: image.id, adminId });
    return image;
  },

  async removeProjectImage(adminId: string, imageId: string) {
    await projectRepository.removeImage(imageId);
    await activityRepository.create({ action: 'DELETE', entity: 'ProjectImage', entityId: imageId, adminId });
    return true;
  }
};
