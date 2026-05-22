import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { drizzleDb } from '@/lib/db/client';
import { divinations } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const rows = await drizzleDb.select().from(divinations)
    .where(eq(divinations.userId, userId))
    .orderBy(desc(divinations.savedAt))
    .limit(20);

  return NextResponse.json(rows.map(r => ({
    ...r,
    result: JSON.parse(r.result),
  })));
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const { method, question, result, aiText, label } = await request.json();
  const id = uid();
  const savedAt = new Date().toISOString();

  await drizzleDb.insert(divinations).values({
    id,
    userId,
    method,
    question: question || '',
    result: JSON.stringify(result),
    aiText: aiText || '',
    label: label || '',
    savedAt,
  });

  return NextResponse.json({ id, savedAt });
}

export async function PUT(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const { id, aiText } = await request.json();
  await drizzleDb.update(divinations)
    .set({ aiText })
    .where(eq(divinations.id, id));

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const { id } = await request.json();
  await drizzleDb.delete(divinations)
    .where(eq(divinations.id, id));

  return NextResponse.json({ success: true });
}
