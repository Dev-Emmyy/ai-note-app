// libs/prisma.js
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = (): PrismaClient => {
  return new PrismaClient();
};

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma || prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}