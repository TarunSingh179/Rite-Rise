import { PrismaClient } from '@prisma/client';
import { validateEnv } from './env';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = (() => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  
  if (process.env.NODE_ENV !== 'test') {
    validateEnv();
  }
  
  const client = new PrismaClient();
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
  return client;
})();
