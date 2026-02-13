import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { prisma } from '@/lib/prisma';
import { hashItem } from '@/lib/hash';
import { toPlainText } from '@/lib/sanitize';
import { defaultSettings } from '@/lib/defaults';
import { scoreItem } from '@/lib/scoring';

const parser = new Parser();

async function processSource(source: { id: string; name: string; rssUrl: string; topic: string }) {
  const feed = await parser.parseURL(source.rssUrl);
  const settings = await prisma.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1, ...defaultSettings } });

  let inserted = 0;
  for (const entry of feed.items ?? []) {
    const title = (entry.title ?? '').trim();
    const url = entry.link ?? '';
    if (!title || !url) continue;

    const snippet = toPlainText(entry.contentSnippet ?? entry.summary ?? entry.content ?? null);
    const contentText = toPlainText(entry.content ?? null);

    const { hostname } = new URL(url);
    const hash = hashItem(hostname, title, snippet);

    const scored = scoreItem(title, snippet, settings);
    if (scored.skip) continue;

    await prisma.item
      .create({
        data: {
          sourceId: source.id,
          title,
          url,
          publishedAt: entry.isoDate ? new Date(entry.isoDate) : entry.pubDate ? new Date(entry.pubDate) : null,
          snippet,
          contentText,
          hash,
          score: scored.score,
          topic: source.topic,
        },
      })
      .then(() => {
        inserted += 1;
      })
      .catch(() => null);
  }

  await prisma.source.update({
    where: { id: source.id },
    data: { lastFetchedAt: new Date(), lastError: null, errorCount: 0 },
  });

  return { source: source.name, inserted };
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret');
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sources = await prisma.source.findMany({ where: { enabled: true }, select: { id: true, name: true, rssUrl: true, topic: true } });
    const chunks: typeof sources[] = [];
    for (let i = 0; i < sources.length; i += 3) chunks.push(sources.slice(i, i + 3));

    const results: Array<{ source: string; inserted: number; error?: string }> = [];
    for (const chunk of chunks) {
      const batch = await Promise.all(
        chunk.map(async (source) => {
          try {
            return await processSource(source);
          } catch (error) {
            await prisma.source.update({
              where: { id: source.id },
              data: {
                lastFetchedAt: new Date(),
                errorCount: { increment: 1 },
                lastError: error instanceof Error ? error.message.slice(0, 500) : 'Unknown ingestion error',
              },
            });
            return {
              source: source.name,
              inserted: 0,
              error: error instanceof Error ? error.message : 'Unknown ingestion error',
            };
          }
        }),
      );
      results.push(...batch);
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed ingestion' }, { status: 500 });
  }
}
