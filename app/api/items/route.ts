import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '../_utils';

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams;
    const topic = q.get('topic');
    const sourceId = q.get('sourceId');
    const minScore = q.get('minScore');
    const read = q.get('read');
    const from = q.get('from');
    const to = q.get('to');
    const search = q.get('search');

    const where: any = {
      ...(topic ? { topic: { equals: topic, mode: 'insensitive' } } : {}),
      ...(sourceId ? { sourceId } : {}),
      ...(minScore ? { score: { gte: Number(minScore) } } : {}),
      ...(read === 'read' ? { isRead: true } : read === 'unread' ? { isRead: false } : {}),
      ...(from || to
        ? {
            publishedAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { snippet: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const items = await prisma.item.findMany({
      where,
      include: { source: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 300,
    });

    return NextResponse.json(items);
  } catch (error) {
    return handleApiError(error);
  }
}
