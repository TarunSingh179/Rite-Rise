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
  'REDIS_URL',
  'REDIS_TOKEN',
  'NEXT_PUBLIC_APP_URL',
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

// Validate on module load
if (process.env.NODE_ENV !== 'test') {
  validateEnv();
}
