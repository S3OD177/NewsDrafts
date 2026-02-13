import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sourceSchema } from '@/lib/validators';
import { handleApiError } from '../_utils';

export async function GET() {
  try {
    const sources = await prisma.source.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(sources);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = sourceSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const source = await prisma.source.create({ data: parsed.data });
    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
