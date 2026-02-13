import { NextResponse } from 'next/server';
import { dbErrorMessage } from '@/lib/prisma';

export function handleApiError(error: unknown) {
  const message = dbErrorMessage(error);
  return NextResponse.json({ error: message }, { status: 500 });
}
