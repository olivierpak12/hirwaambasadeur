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

export const sendAuthorCredentials = action({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
  },
  handler: async (_ctx, { email, name, password }) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !isValidEmail(normalized)) {
      throw new Error('Invalid email');
    }

    const transporter = createTransporter();
    if (!transporter) {
      console.log('📧 Email not configured. Author credentials for', normalized);
      console.log(`   Name: ${name}`);
      console.log(`   Email: ${normalized}`);
      console.log(`   Password: ${password}`);
      console.log(`   Login URL: /author/login`);
      return { sent: false, debugMode: true };
    }

    const from = process.env.EMAIL_FROM || `no-reply@hirwaambassadeur.com`;
    const loginUrl = `${process.env.APP_URL || 'http://localhost:3000'}/author/login`;
    const subject = 'Your Hirwa Ambassadeur Author Account Credentials';
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
    .header { background: #070f09; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
    .content { padding: 20px; }
    .credentials { background: #f5f5f5; padding: 15px; border-left: 4px solid #5a8a6a; margin: 20px 0; }
    .credentials p { margin: 8px 0; }
    .label { font-weight: bold; color: #5a8a6a; }
    .button { display: inline-block; background: #5a8a6a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    .footer { background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Hirwa Ambassadeur</h1>
      <p>Author Account Created</p>
    </div>
    <div class="content">
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your author account has been created on the Hirwa Ambassadeur news platform. Below are your login credentials:</p>
      
      <div class="credentials">
        <p><span class="label">Email:</span> ${normalized}</p>
        <p><span class="label">Password:</span> ${password}</p>
      </div>
      
      <p>You can now log in to your account and start publishing articles.</p>
      
      <a href="${loginUrl}" class="button">Log In to Your Account</a>
      
      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        <strong>Security Tip:</strong> Please change your password after your first login. Do not share these credentials with anyone.
      </p>
    </div>
    <div class="footer">
      <p>© 2024 Hirwa Ambassadeur - Professional News Platform</p>
      <p>If you did not request this account, please contact our support team.</p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
Hello ${name},

Your author account has been created on the Hirwa Ambassadeur news platform.

Login Credentials:
- Email: ${normalized}
- Password: ${password}

You can log in at: ${loginUrl}

Security Tip: Please change your password after your first login. Do not share these credentials with anyone.

© 2024 Hirwa Ambassadeur - Professional News Platform
    `;

    try {
      await transporter.sendMail({
        from,
        to: normalized,
        subject,
        text,
        html: htmlContent,
      });
      return { sent: true };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send credentials email');
    }
  },
});
