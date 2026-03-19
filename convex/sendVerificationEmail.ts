'use node';

import { action } from './_generated/server';
import { v } from 'convex/values';
import nodemailer from 'nodemailer';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
    secure: port === 465,
  });
}

export const sendVerificationEmail = action({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (_ctx, { email, code }) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !isValidEmail(normalized)) {
      throw new Error('Invalid email');
    }

    const transporter = createTransporter();
    if (!transporter) {
      console.log('Email not configured. Verification code for', normalized, ':', code);
      return { sent: false, debugCode: code };
    }

    const from = process.env.EMAIL_FROM || `no-reply@${normalized.split('@')[1]}`;
    const subject = 'Your verification code';
    const text = `Your verification code is: ${code}\n\nThis code expires in 15 minutes.`;

    await transporter.sendMail({
      from,
      to: normalized,
      subject,
      text,
    });

    return { sent: true };
  },
});
