import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export function dbErrorMessage(error: unknown) {
  const text = error instanceof Error ? error.message : 'Unknown database error';
  if (text.toLowerCase().includes('environment variable not found: database_url')) {
    return 'DATABASE_URL is missing. Set it in your environment before using database-backed features.';
  }
  return text;
}
