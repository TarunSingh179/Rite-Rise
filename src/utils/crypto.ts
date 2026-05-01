import crypto from 'crypto';

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateVerificationCode(): string {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

export async function hashToken(token: string): Promise<string> {
  const hash = crypto.createHash('sha256');
  hash.update(token);
  return hash.digest('hex');
}
