import { PrismaClient } from '@prisma/client';

// Previne a criação de múltiplas instâncias do Prisma Client em dev (por conta do hot-reload do Next.js)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'development') globalForPrisma.prisma = prisma;
