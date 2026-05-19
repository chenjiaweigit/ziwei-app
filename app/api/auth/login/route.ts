import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone) return NextResponse.json({ error: '请输入手机号' }, { status: 400 });
    const user = db.users.findByPhone(phone);
    if (!user) return NextResponse.json({ error: '用户不存在，请先注册' }, { status: 404 });
    const token = signToken({ userId: user.id, phone: user.phone });
    return NextResponse.json({ token, user: { id: user.id, phone: user.phone, name: user.name, avatar: user.avatar, membershipTier: user.membershipTier } });
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
}
