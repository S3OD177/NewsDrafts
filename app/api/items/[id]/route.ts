import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { itemPatchSchema } from '@/lib/validators';
import { handleApiError } from '../../_utils';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await prisma.item.findUnique({ where: { id }, include: { source: true, drafts: true } });
    return NextResponse.json(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsed = itemPatchSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const item = await prisma.item.update({ where: { id }, data: parsed.data });
    return NextResponse.json(item);
  } catch (error) {
    return handleApiError(error);
  }
}
