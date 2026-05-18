import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { phone, name } = await request.json();

    if (!phone || !/^1\d{10}$/.test(phone)) {
      return NextResponse.json({ error: '手机号格式不正确' }, { status: 400 });
    }

    const existing = db.users.findByPhone(phone);
    if (existing) {
      const token = signToken({ userId: existing.id, phone: existing.phone });
      return NextResponse.json({ token, user: { id: existing.id, phone: existing.phone, name: existing.name } });
    }

    const user = db.users.create(phone, name || '');
    const token = signToken({ userId: user.id, phone: user.phone });
    return NextResponse.json({ token, user: { id: user.id, phone: user.phone, name: user.name } });
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json({ error: '注册失败' }, { status: 500 });
  }
}
