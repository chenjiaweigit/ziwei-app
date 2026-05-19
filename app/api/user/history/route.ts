import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const charts = db.charts.findByUser(userId);
  return NextResponse.json(charts.map(c => ({
    id: c.id,
    birthInfo: JSON.parse(c.birthInfo),
    createdAt: c.createdAt,
  })));
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const { birthInfo, chart } = await request.json();
  const record = db.charts.create(userId, birthInfo, chart);

  return NextResponse.json({ id: record.id, createdAt: record.createdAt });
}

export async function DELETE(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const { id } = await request.json();
  db.charts.delete(id, userId);
  return NextResponse.json({ success: true });
}
