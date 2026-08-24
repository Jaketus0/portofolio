import 'dotenv/config';
import nodemailer from 'nodemailer';

const smtpUser = process.env.SMTP_USER?.trim();
const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  requireTLS: true,
  auth: { user: smtpUser, pass: smtpPass },
});

const info = await transporter.sendMail({
  from: process.env.SMTP_FROM || smtpUser,
  to: smtpUser,
  subject: 'Test OTP email',
  text: 'This is a test email from the app.',
});

console.log(JSON.stringify({ accepted: info.accepted, rejected: info.rejected, messageId: info.messageId }, null, 2));
