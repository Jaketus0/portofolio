import { authRepository } from '../repositories/auth.repository';
import { activityRepository } from '../repositories/settings.repository';
import { generateAccessToken, generateRefreshToken, generateRememberMeRefreshToken } from '../utils/jwt';
import { logger } from '../utils/logger';
import { generateOtpCode, getOtpExpiry, hashOtp, verifyOtp } from '../utils/otp';
import { sendOtpEmail } from './email.service';

const badRequest = (message: string) => Object.assign(new Error(message), { name: 'ValidationError' });

async function issueSession(adminId: string, rememberMe: boolean) {
  const admin = await authRepository.findAdminById(adminId);
  if (!admin) throw badRequest('Admin not found');

  const payload = { adminId: admin.id, email: admin.email, role: admin.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = rememberMe
    ? generateRememberMeRefreshToken(payload)
    : generateRefreshToken(payload);

  const expiresAt = new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000));

  await authRepository.createRefreshToken({
    token: refreshToken,
    adminId: admin.id,
    expiresAt,
  });

  await activityRepository.create({
    action: 'LOGIN',
    entity: 'Auth',
    adminId: admin.id,
  });

  return { accessToken, refreshToken, user: { id: admin.id, email: admin.email, name: admin.name, avatar: admin.avatar, role: admin.role } };
}

export const authService = {
  async requestOtp(emailRaw: string) {
    const email = emailRaw.trim().toLowerCase();
    const admin = await authRepository.findAdminByEmail(email);
    if (!admin || !admin.isActive) {
      // Don't leak whether email exists
      return { success: true, message: 'If the email exists, an OTP will be sent.' };
    }

    // Check rate limits from repository (fallback if middleware fails)
    // const recentOtps = await authRepository.countRecentOtps(email, 10);
    // if (recentOtps >= 3) {
    //   throw new Error('Too many OTP requests. Please try again later.');
    // }

    const code = generateOtpCode();
    const hashedCode = await hashOtp(code);
    const expiresAt = getOtpExpiry(5);

    await authRepository.createOtpToken({
      code: hashedCode,
      email,
      adminId: admin.id,
      expiresAt,
    });

    const emailSent = await sendOtpEmail(email, code);

    if (!emailSent) {
      logger.warn(`SMTP failed for ${email}; email delivery failed`);
      throw new Error('Failed to send OTP email');
    }

    return {
      success: true,
      message: 'OTP sent to email.',
    };
  },

  async verifyOtp(emailRaw: string, code: string, rememberMe = false) {
    const email = emailRaw.trim().toLowerCase();
    const normalizedCode = (code || '').trim().replace(/\s+/g, '');

    let otp = await authRepository.findLatestOtp(email);

    // Jika tidak ada OTP aktif, cek apakah kode ini sudah pernah dipakai baru-baru ini.
    // Kasus: user klik Verify dua kali setelah sukses pertama — jangan error, lanjutkan sesi.
    if (!otp) {
      const prev = await authRepository.findLatestOtpAny(email);
      if (
        prev &&
        prev.isUsed &&
        Date.now() - prev.createdAt.getTime() < 10 * 60 * 1000 &&
        (await verifyOtp(normalizedCode, prev.code))
      ) {
        return issueSession(prev.adminId, rememberMe);
      }
      if (prev && !prev.isUsed && prev.expiresAt < new Date()) {
        throw badRequest('OTP kedaluwarsa. Silakan minta kode baru.');
      }
      throw badRequest('Tidak ada OTP aktif. Silakan minta kode terlebih dahulu.');
    }

    if (otp.attempts >= otp.maxAttempts) {
      throw badRequest('Terlalu banyak upaya. Silakan minta OTP baru.');
    }

    const isValid = await verifyOtp(normalizedCode, otp.code);
    if (!isValid) {
      await authRepository.incrementOtpAttempts(otp.id);
      const remaining = otp.maxAttempts - (otp.attempts + 1);
      throw badRequest(`OTP tidak valid. ${remaining > 0 ? `${remaining} percobaan tersisa.` : 'Mintalah kode baru.'}`);
    }

    await authRepository.markOtpUsed(otp.id);
    await authRepository.updateLastLogin(otp.adminId);

    return issueSession(otp.adminId, rememberMe);
  },

  async logout(token: string, adminId: string) {
    if (token) await authRepository.deleteRefreshToken(token);
    await activityRepository.create({ action: 'LOGOUT', entity: 'Auth', adminId });
    return true;
  }
};
