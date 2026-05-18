import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

const TIERS: Record<string, { amount: number; label: string; months: number }> = {
  pro: { amount: 29.9, label: 'Pro 会员', months: 1 },
  unlimited: { amount: 99.9, label: '终身会员', months: 999 },
};

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const { tier } = await request.json();
  const config = TIERS[tier];
  if (!config) {
    return NextResponse.json({ error: '无效的会员等级' }, { status: 400 });
  }

  const order = db.payments.create(userId, config.amount, tier);

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + config.months);

  db.users.update(userId, {
    membershipTier: tier,
    expiresAt: expiresAt.toISOString(),
  });

  return NextResponse.json({
    success: true,
    orderId: order.id,
    tier,
    expiresAt: expiresAt.toISOString(),
  });
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const user = db.users.findById(userId);
  if (!user) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 });
  }

  return NextResponse.json({
    membershipTier: user.membershipTier,
    expiresAt: user.expiresAt,
  });
}
