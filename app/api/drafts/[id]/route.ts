import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { patchDraftSchema } from '@/lib/validators';
import { handleApiError } from '../../_utils';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsed = patchDraftSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const draft = await prisma.draft.update({ where: { id }, data: parsed.data });
    return NextResponse.json(draft);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.draft.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
