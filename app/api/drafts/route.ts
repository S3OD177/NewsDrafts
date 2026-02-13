import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { draftSchema } from '@/lib/validators';
import { handleApiError } from '../_utils';

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status');
    const drafts = await prisma.draft.findMany({
      where: status ? { status: status as any } : {},
      include: { item: true },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(drafts);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = draftSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const draft = await prisma.draft.create({ data: parsed.data });
    return NextResponse.json(draft, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
