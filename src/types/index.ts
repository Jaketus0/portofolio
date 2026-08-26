export type SkillCategory = 'PROGRAMMING_LANGUAGE' | 'FRAMEWORK' | 'LIBRARY' | 'DATABASE' | 'DEVOPS' | 'CLOUD' | 'CYBERSECURITY' | 'TOOLS' | 'OTHERS';

export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type MessageStatus = 'PENDING' | 'APPROVED' | 'HIDDEN';

export type SubmissionStatus = 'PENDING' | 'READ' | 'ARCHIVED';

export type TimelineType = 'EXPERIENCE' | 'EDUCATION';

// Basic shared types - matching Prisma schema
export interface HeroSection {
  id: string;
  greeting: string;
  name: string;
  jobTitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string | null;
  backgroundMusic: string | null;
  heroImage: string | null;
  techStack?: string | null;
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface AboutSection {
  id: string;
  photo: string | null;
  name: string;
  shortIntro: string;
  longDescription: string;
  resumeUrl: string | null;
  cvUrl: string | null;
  timelines?: Timeline[];
}

export interface Timeline {
  id: string;
  title: string;
  organization: string;
  description: string | null;
  type: TimelineType;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  sortOrder: number;
}

export interface Project {
  id: string;
  coverImage: string | null;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  techStack: any; // Can be string or JSON array
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  sortOrder: number;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  url: string;
  caption: string | null;
  sortOrder: number;
}

export interface Skill {
  id: string;
  name: string;
  icon: string | null;
  category: SkillCategory;
  sortOrder: number;
  isActive: boolean;
}

export interface ContactInfo {
  id: string;
  whatsapp: string | null;
  email: string | null;
  linkedin: string | null;
  github: string | null;
  instagram: string | null;
  discord: string | null;
  telegram: string | null;
  googleMaps: string | null;
  availabilityStatus: string;
  isAvailable: boolean;
}

export interface GuestMessage {
  id: string;
  name: string;
  message: string;
  status: MessageStatus;
  pinned: boolean;
  pinnedAt: string | null;
  rotation: number;
  createdAt: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  logo: string | null;
  favicon: string | null;
  theme: string;
  maintenanceMode: boolean;
}

export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ContactSubmission {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  message: string;
  status: SubmissionStatus;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
  admin: {
    name: string;
    avatar: string | null;
  };
}
