/**
 * Environment variable validation
 * Ensures all required variables are set at startup
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
];

const optionalEnvVars = [
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'NEXT_PUBLIC_APP_URL',
  'RESEND_API_KEY',
  'EMAIL_FROM',
];

export function validateEnv() {
  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  // Warn about optional but recommended variables
  if (process.env.NODE_ENV === 'production') {
    const missingOptional = optionalEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingOptional.length > 0) {
      console.warn(
        `⚠️  Missing optional environment variables: ${missingOptional.join(', ')}`
      );
      console.warn('Some features may not work without these variables');
    }
  }
}

// Removed top-level validation to prevent build-time failures
// validateEnv is now called lazily by service clients
