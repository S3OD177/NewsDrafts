-- CreateEnum
CREATE TYPE "DraftType" AS ENUM ('SHORT', 'WHY', 'THREAD', 'CUSTOM');

-- CreateEnum
CREATE TYPE "DraftStatus" AS ENUM ('DRAFT', 'APPROVED', 'POSTED', 'REJECTED');

CREATE TABLE "Source" (
  "id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "rssUrl" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  "lastFetchedAt" TIMESTAMPTZ(6),
  "lastError" TEXT,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Item" (
  "id" UUID NOT NULL,
  "sourceId" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "publishedAt" TIMESTAMPTZ(6),
  "snippet" TEXT,
  "contentText" TEXT,
  "hash" TEXT NOT NULL,
  "score" INTEGER NOT NULL DEFAULT 0,
  "topic" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Draft" (
  "id" UUID NOT NULL,
  "itemId" UUID,
  "type" "DraftType" NOT NULL,
  "content" TEXT NOT NULL,
  "status" "DraftStatus" NOT NULL DEFAULT 'DRAFT',
  "tweetUrl" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "Draft_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Settings" (
  "id" INTEGER NOT NULL,
  "includeKeywords" TEXT[] NOT NULL,
  "excludeKeywords" TEXT[] NOT NULL,
  "dedupDays" INTEGER NOT NULL DEFAULT 30,
  "scoreRules" JSONB NOT NULL,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Source_rssUrl_key" ON "Source"("rssUrl");
CREATE UNIQUE INDEX "Item_hash_key" ON "Item"("hash");
CREATE INDEX "Item_publishedAt_idx" ON "Item"("publishedAt");
CREATE INDEX "Item_score_idx" ON "Item"("score");
CREATE INDEX "Item_topic_idx" ON "Item"("topic");
CREATE INDEX "Draft_status_idx" ON "Draft"("status");

ALTER TABLE "Item" ADD CONSTRAINT "Item_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
