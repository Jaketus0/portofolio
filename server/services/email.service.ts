import "dotenv/config";
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

const smtpUser = process.env.SMTP_USER?.trim();
const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, '');

const smtpHost = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  requireTLS: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  connectionTimeout: 20000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
});

function getFromAddress(): string {
  const configuredFrom = process.env.SMTP_FROM?.trim();
  if (configuredFrom) return configuredFrom;

  const smtpUser = process.env.SMTP_USER?.trim();
  return smtpUser ? smtpUser : 'noreply@localhost';
}

export async function sendOtpEmail(email: string, otpCode: string): Promise<boolean> {
  try {
    logger.info(`Attempting to send OTP to ${email} via ${smtpHost}`);
    const info = await transporter.sendMail({
      from: getFromAddress(),
      to: email,
      subject: '🔐 OGGY - Your Login OTP Code',
      html: `
        <div style="font-family: 'Courier New', monospace; max-width: 480px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; padding: 32px; border: 4px solid #00ff88; border-radius: 0;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #00ff88; font-size: 24px; margin: 0; letter-spacing: 2px;">🎮 OGGY</h1>
            <p style="color: #888; font-size: 12px; margin-top: 4px;">ADMIN LOGIN VERIFICATION</p>
          </div>
          <div style="background: #16213e; border: 2px solid #0f3460; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="margin: 0 0 16px 0; color: #ccc; font-size: 14px;">Your one-time password:</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #00ff88; padding: 16px; background: #0a0a1a; border: 2px dashed #00ff88;">
              ${otpCode}
            </div>
            <p style="margin: 16px 0 0 0; color: #ff6b6b; font-size: 12px;">⏰ Expires in 5 minutes</p>
          </div>
          <p style="color: #888; font-size: 11px; text-align: center; margin: 0;">
            If you didn't request this code, please ignore this email.<br>
            Do not share this code with anyone.
          </p>
        </div>
      `,
    });

    logger.success(`OTP email sent to ${email}: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send OTP email to ${email}:`, error);
    return false;
  }
}

export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    logger.success('Email transporter verified');
    return true;
  } catch (error) {
    logger.warn('Email transporter not configured:', error);
    return false;
  }
}
