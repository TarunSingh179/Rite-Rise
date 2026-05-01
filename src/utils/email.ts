interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    console.log('--- Email would be sent ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', html);
    console.log('--- End email ---');
    return;
  }

  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'noreply@riterise.com',
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to send email');
    }
  }
}

export function generateVerificationEmail(name: string, verificationUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a73e8;">Verify Your Email</h1>
      <p>Hi ${name},</p>
      <p>Thank you for joining RITE Rise! Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" style="display: inline-block; background-color: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
        Verify Email Address
      </a>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
      <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #999; font-size: 12px;">If you didn't create an account, you can safely ignore this email.</p>
    </div>
  `;
}

export function generateResetPasswordEmail(name: string, resetUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a73e8;">Reset Your Password</h1>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
        Reset Password
      </a>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${resetUrl}</p>
      <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #999; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
  `;
}
