import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultSettings } from '@/lib/defaults';
import { settingsSchema } from '@/lib/validators';
import { handleApiError } from '../_utils';

export async function GET() {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, ...defaultSettings },
    });
    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const parsed = settingsSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const updated = await prisma.settings.upsert({ where: { id: 1 }, update: parsed.data, create: { id: 1, ...parsed.data } });
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
