import { DraftStatus, DraftType } from '@prisma/client';
import { z } from 'zod';

export const sourceSchema = z.object({
  name: z.string().min(1),
  rssUrl: z.string().url(),
  topic: z.string().min(1),
  enabled: z.boolean().default(true),
});

export const patchSourceSchema = sourceSchema.partial();

export const itemPatchSchema = z.object({
  isRead: z.boolean(),
});

export const draftSchema = z.object({
  itemId: z.string().uuid().nullable().optional(),
  type: z.nativeEnum(DraftType),
  content: z.string().min(1),
  status: z.nativeEnum(DraftStatus).default(DraftStatus.DRAFT),
  tweetUrl: z.string().url().optional().nullable(),
});

export const patchDraftSchema = draftSchema.partial();

export const settingsSchema = z.object({
  includeKeywords: z.array(z.string()),
  excludeKeywords: z.array(z.string()),
  dedupDays: z.number().int().positive(),
  scoreRules: z.record(z.number().int()),
});
