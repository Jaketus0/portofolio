import prisma from '../utils/prisma';

export const authRepository = {
  findAdminByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  },

  createOtpToken(data: { code: string; email: string; adminId: string; expiresAt: Date }) {
    return prisma.otpToken.create({ data });
  },

  findLatestOtp(email: string) {
    return prisma.otpToken.findFirst({
      where: { email, isUsed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
  },

  findLatestOtpAny(email: string) {
    return prisma.otpToken.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });
  },

  findAdminById(id: string) {
    return prisma.admin.findUnique({ where: { id } });
  },

  markOtpUsed(id: string) {
    return prisma.otpToken.update({ where: { id }, data: { isUsed: true } });
  },

  incrementOtpAttempts(id: string) {
    return prisma.otpToken.update({ where: { id }, data: { attempts: { increment: 1 } } });
  },

  countRecentOtps(email: string, sinceMinutes: number) {
    const since = new Date(Date.now() - sinceMinutes * 60 * 1000);
    return prisma.otpToken.count({ where: { email, createdAt: { gt: since } } });
  },

  updateLastLogin(adminId: string) {
    return prisma.admin.update({ where: { id: adminId }, data: { lastLoginAt: new Date() } });
  },

  createRefreshToken(data: { token: string; adminId: string; expiresAt: Date }) {
    return prisma.refreshToken.create({ data });
  },

  findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  },

  deleteRefreshToken(token: string) {
    return prisma.refreshToken.deleteMany({ where: { token } });
  },

  deleteAllRefreshTokens(adminId: string) {
    return prisma.refreshToken.deleteMany({ where: { adminId } });
  },

  cleanupExpiredTokens() {
    return prisma.$transaction([
      prisma.otpToken.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
      prisma.refreshToken.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
    ]);
  },
};
