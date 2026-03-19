import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

async function sendVerificationEmail(to: string, code: string) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || `no-reply@${to.split('@')[1]}`;

  if (!host || !port || !user || !pass) {
    console.error('SMTP configuration missing');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      auth: { user, pass },
      secure: port === 465,
    });

    await transporter.sendMail({
      from,
      to,
      subject: 'Your Hirwa Ambassadeur Verification Code',
      text: `Your verification code is: ${code}\n\nThis code expires in 15 minutes.\n\nIf you did not request this, you can ignore this message.`,
      html: `
        <h2>Verify Your Email</h2>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 2px; color: #333;">${code}</h1>
        <p style="color: #666;">This code expires in 15 minutes.</p>
        <p style="color: #999; font-size: 12px;">If you did not request this, you can ignore this message.</p>
      `,
    });

    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    const success = await sendVerificationEmail(email, code);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send email', debugCode: code },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
