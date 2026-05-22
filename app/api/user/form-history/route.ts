import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { drizzleDb } from '@/lib/db/client';
import { formHistory } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'chart';

  const rows = await drizzleDb.select().from(formHistory)
    .where(eq(formHistory.userId, userId))
    .orderBy(desc(formHistory.createdAt))
    .limit(20);

  return NextResponse.json(rows.filter(r => r.type === type).map(r => ({
    ...r,
    formData: JSON.parse(r.formData),
  })));
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { type, label, formData } = await request.json();
  const id = uid();
  const createdAt = new Date().toISOString();

  await drizzleDb.insert(formHistory).values({ id, userId, type, label, formData: JSON.stringify(formData), createdAt });

  return NextResponse.json({ id, createdAt });
}

export async function DELETE(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { id } = await request.json();
  await drizzleDb.delete(formHistory).where(eq(formHistory.id, id));
  return NextResponse.json({ success: true });
}
