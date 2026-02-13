import { PrismaClient } from '@prisma/client';
import { defaultSettings } from '../lib/defaults';

const prisma = new PrismaClient();

async function main() {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {
      includeKeywords: defaultSettings.includeKeywords,
      excludeKeywords: defaultSettings.excludeKeywords,
      dedupDays: defaultSettings.dedupDays,
      scoreRules: defaultSettings.scoreRules,
    },
    create: {
      id: 1,
      includeKeywords: defaultSettings.includeKeywords,
      excludeKeywords: defaultSettings.excludeKeywords,
      dedupDays: defaultSettings.dedupDays,
      scoreRules: defaultSettings.scoreRules,
    },
  });
}

main().finally(async () => prisma.$disconnect());
