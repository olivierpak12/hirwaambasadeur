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

export const sendSubscriptionConfirmation = action({
  args: {
    email: v.string(),
  },
  handler: async (_ctx, { email }) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !isValidEmail(normalized)) {
      throw new Error('Invalid email');
    }

    const transporter = createTransporter();
    if (!transporter) {
      console.log('Email not configured. Subscription confirmation for', normalized);
      return { sent: false };
    }

    const from = process.env.EMAIL_FROM || `no-reply@${normalized.split('@')[1]}`;
    const subject = '✓ Subscription Confirmed - Hirwa Ambassadeur';
    const text = `Thank you for subscribing to Hirwa Ambassadeur!\n\nYou are now subscribed to our newsletter and will receive important updates about politics, business, culture, and more from Kigali.\n\nBest regards,\nThe Hirwa Ambassadeur Team`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
            .checkmark { font-size: 48px; margin-bottom: 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="checkmark">✓</div>
              <h1>Subscription Confirmed</h1>
            </div>
            <div class="content">
              <p>Thank you for subscribing to <strong>Hirwa Ambassadeur</strong>!</p>
              <p>You are now subscribed to our newsletter and will receive important updates about:</p>
              <ul>
                <li>Politics & Government</li>
                <li>Business & Economics</li>
                <li>Technology & Innovation</li>
                <li>Culture & Society</li>
                <li>And more from Kigali</li>
              </ul>
              <p>Check your inbox regularly for the latest news and insights.</p>
              <p>If you have any questions or need to manage your subscription preferences, feel free to contact us.</p>
              <p>Best regards,<br><strong>The Hirwa Ambassadeur Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Hirwa Ambassadeur. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from,
      to: normalized,
      subject,
      text,
      html,
    });

    return { sent: true };
  },
});
