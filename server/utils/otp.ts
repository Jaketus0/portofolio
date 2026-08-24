import bcrypt from 'bcryptjs';
import crypto from 'crypto';

function normalizeOtp(code: string): string {
  return (code || '').trim().replace(/\s+/g, '').padStart(6, '0');
}

/**
 * Generate a 6-digit numeric OTP code
 */
export function generateOtpCode(): string {
  return crypto.randomInt(0, 1000000).toString().padStart(6, '0');
}

/**
 * Hash the OTP before storing
 */
export async function hashOtp(code: string): Promise<string> {
  const normalized = normalizeOtp(code);
  const secret = process.env.JWT_SECRET || 'skylogic-dev-secret';
  return crypto.createHmac('sha256', secret).update(normalized).digest('hex');
}

/**
 * Verify OTP against hash
 */
export async function verifyOtp(code: string, hash: string): Promise<boolean> {
  const normalizedCode = normalizeOtp(code);
  if (!normalizedCode || !hash) return false;

  if (hash.startsWith('$2')) {
    return bcrypt.compare(normalizedCode, hash);
  }

  const expectedHash = crypto.createHmac('sha256', process.env.JWT_SECRET || 'skylogic-dev-secret').update(normalizedCode).digest('hex');
  return expectedHash === hash;
}

/**
 * Calculate expiry time
 */
export function getOtpExpiry(minutes?: number): Date {
  const mins = minutes || parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10);
  return new Date(Date.now() + mins * 60 * 1000);
}
