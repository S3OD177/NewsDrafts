import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { patchSourceSchema } from '@/lib/validators';
import { handleApiError } from '../../_utils';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsed = patchSourceSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const source = await prisma.source.update({ where: { id }, data: parsed.data });
    return NextResponse.json(source);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.source.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
