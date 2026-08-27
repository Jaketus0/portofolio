import 'dotenv/config';
import { execSync } from 'child_process';
import { prisma } from '../server/utils/prisma';

async function ensureSchema() {
  console.log('🛠️ Ensuring database schema exists...');
  execSync('npx prisma db push', { stdio: 'inherit' });
}

async function main() {
  await ensureSchema();
  console.log('🌱 Seeding database...');

  // ── Admin ──────────────────────────────────────────────
  const admin = await prisma.admin.upsert({
    where: { email: 'moluscaxyz@gmail.com' },
    update: {},
    create: {
      email: 'moluscaxyz@gmail.com',
      name: 'oggy',
      role: 'admin',
    },
  });
  console.log('✅ Admin:', admin.email);

  // ── Hero Section (upsert first row) ────────────────────
  const heroCount = await prisma.heroSection.count();
  if (heroCount === 0) {
    await prisma.heroSection.create({
      data: {
        greeting: "Hello, I'm",
        name: 'Your Name',
        jobTitle: 'Full Stack Developer',
        description: 'I build modern web applications with clean code and pixel-perfect design.',
        ctaText: 'View My Work',
        ctaLink: '#projects',
        socialLinks: {
          create: [
            { platform: 'GitHub', url: 'https://github.com', icon: 'github', sortOrder: 0 },
            { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin', sortOrder: 1 },
            { platform: 'Instagram', url: 'https://instagram.com', icon: 'instagram', sortOrder: 2 },
          ],
        },
      },
    });
    console.log('✅ Hero section created');
  } else {
    console.log('ℹ️ Hero section already exists, skipping');
  }

  // ── About Section ──────────────────────────────────────
  const aboutCount = await prisma.aboutSection.count();
  if (aboutCount === 0) {
    await prisma.aboutSection.create({
      data: {
        name: 'Your Name',
        shortIntro: 'A passionate developer who loves building things for the web.',
        longDescription: '<p>I am a full stack developer with a passion for creating beautiful, functional, and user-centered digital experiences.</p>',
        timelines: {
          create: [
            {
              title: 'Full Stack Developer',
              organization: 'Tech Company',
              type: 'EXPERIENCE',
              startDate: new Date('2022-01-01'),
              isCurrent: true,
              sortOrder: 0,
            },
            {
              title: 'Bachelor of Computer Science',
              organization: 'University',
              type: 'EDUCATION',
              startDate: new Date('2018-08-01'),
              endDate: new Date('2022-06-01'),
              sortOrder: 1,
            },
          ],
        },
      },
    });
    console.log('✅ About section created');
  } else {
    console.log('ℹ️ About section already exists, skipping');
  }

  // ── Skills (only insert if none) ───────────────────────
  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    await prisma.skill.createMany({
      data: [
        { name: 'TypeScript', icon: 'typescript', category: 'PROGRAMMING_LANGUAGE', sortOrder: 0 },
        { name: 'JavaScript', icon: 'javascript', category: 'PROGRAMMING_LANGUAGE', sortOrder: 1 },
        { name: 'Python', icon: 'python', category: 'PROGRAMMING_LANGUAGE', sortOrder: 2 },
        { name: 'React', icon: 'react', category: 'FRAMEWORK', sortOrder: 0 },
        { name: 'Next.js', icon: 'nextjs', category: 'FRAMEWORK', sortOrder: 1 },
        { name: 'Express.js', icon: 'express', category: 'FRAMEWORK', sortOrder: 2 },
        { name: 'TailwindCSS', icon: 'tailwindcss', category: 'LIBRARY', sortOrder: 0 },
        { name: 'Prisma', icon: 'prisma', category: 'LIBRARY', sortOrder: 1 },
        { name: 'MySQL', icon: 'mysql', category: 'DATABASE', sortOrder: 0 },
        { name: 'PostgreSQL', icon: 'postgresql', category: 'DATABASE', sortOrder: 1 },
        { name: 'Docker', icon: 'docker', category: 'DEVOPS', sortOrder: 0 },
        { name: 'Git', icon: 'git', category: 'TOOLS', sortOrder: 0 },
        { name: 'VS Code', icon: 'vscode', category: 'TOOLS', sortOrder: 1 },
      ],
    });
    console.log('✅ Skills created');
  } else {
    console.log('ℹ️ Skills already exist, skipping');
  }

  // ── Services ───────────────────────────────────────────
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        { title: 'Web Development', shortDesc: 'Fast, accessible, and maintainable websites and web apps.', icon: 'Code2', sortOrder: 0 },
        { title: 'Full-Stack Engineering', shortDesc: 'End-to-end features — from database and APIs to polished interfaces.', icon: 'Server', sortOrder: 1 },
        { title: 'UI / Interaction Design', shortDesc: 'Calm, considered interfaces with motion that guides rather than distracts.', icon: 'Palette', sortOrder: 2 },
        { title: 'Performance & SEO', shortDesc: 'Sites that load fast and are easy to find.', icon: 'Zap', sortOrder: 3 },
        { title: 'DevOps & Deployment', shortDesc: 'Reliable pipelines, monitoring, and infrastructure.', icon: 'Cloud', sortOrder: 4 },
        { title: 'Consulting & Audits', shortDesc: 'Focused reviews of code quality, architecture, and UX.', icon: 'Search', sortOrder: 5 },
      ],
    });
    console.log('✅ Services created');
  } else {
    console.log('ℹ️ Services already exist, skipping');
  }

  // ── Contact Info ───────────────────────────────────────
  const contactCount = await prisma.contactInfo.count();
  if (contactCount === 0) {
    await prisma.contactInfo.create({
      data: {
        email: 'hello@skylogic.dev',
        whatsapp: '+628123456789',
        linkedin: 'https://linkedin.com/in/yourprofile',
        github: 'https://github.com/yourprofile',
        instagram: 'https://instagram.com/yourprofile',
        availabilityStatus: 'Available for work',
        isAvailable: true,
      },
    });
    console.log('✅ Contact info created');
  } else {
    console.log('ℹ️ Contact info already exists, skipping');
  }

  // ── Site Settings ──────────────────────────────────────
  const settingsCount = await prisma.siteSettings.count();
  if (settingsCount === 0) {
    await prisma.siteSettings.create({
      data: {
        siteName: 'VIA',
        seoTitle: 'VIA — Software Engineer',
        seoDescription: 'A professional portfolio showcasing projects, skills, and experience.',
        theme: 'light',
        maintenanceMode: false,
      },
    });
    console.log('✅ Site settings created');
  } else {
    console.log('ℹ️ Site settings already exist, skipping');
  }

  // ── Sample Project ─────────────────────────────────────
  const project = await prisma.project.upsert({
    where: { slug: 'portfolio-platform' },
    update: {},
    create: {
      title: 'Portfolio Platform',
      slug: 'portfolio-platform',
      category: 'Web Application',
      shortDescription: 'A full-stack portfolio CMS with a clean, minimal admin dashboard.',
      fullDescription: '<p>A full-stack portfolio CMS built with Next.js, Express, and PostgreSQL.</p>',
      techStack: JSON.stringify(['Next.js', 'Express.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'TailwindCSS']),
      githubUrl: 'https://github.com/yourprofile/portfolio',
      featured: true,
      status: 'PUBLISHED',
      startDate: new Date('2024-01-01'),
      sortOrder: 0,
    },
  });
  console.log('✅ Sample project:', project.slug);

  // ── Sample Guest Messages (only if none) ───────────────
  const msgCount = await prisma.guestMessage.count();
  if (msgCount === 0) {
    await prisma.guestMessage.createMany({
      data: [
        { name: 'Visitor', message: 'Amazing portfolio! Love the theme!', status: 'APPROVED', rotation: -2.5 },
        { name: 'Dev Friend', message: 'Clean code, great design!', status: 'APPROVED', pinned: true, pinnedAt: new Date(), rotation: 1.8 },
        { name: 'Recruiter', message: 'Impressive work. Would love to connect!', status: 'APPROVED', rotation: -1.2 },
      ],
    });
    console.log('✅ Sample messages created');
  } else {
    console.log('ℹ️ Messages already exist, skipping');
  }

  console.log('\n🎮 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
