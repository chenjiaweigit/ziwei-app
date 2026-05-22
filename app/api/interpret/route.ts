import { NextRequest, NextResponse } from 'next/server';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { streamInterpret } from '@/lib/ai/interpret';
import { getUserIdFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chart, messages } = body as {
      chart: ZiweiChart;
      messages: { role: 'user' | 'assistant'; content: string }[];
    };

    if (!chart || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '缺少必填字段：chart, messages' },
        { status: 400 },
      );
    }

    const userId = getUserIdFromRequest(request);
    if (userId) {
      const user = await db.users.findById(userId);
      const isPro = user?.membershipTier === 'pro' || user?.membershipTier === 'unlimited';
      if (!isPro) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const count = await db.charts.countSince(userId, today);
        if (count >= 3) {
          return NextResponse.json(
            { error: '免费用户每天限 3 次解读，升级会员解锁无限次' },
            { status: 429 },
          );
        }
      }
    }

    const stream = await streamInterpret(chart, messages);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('解读失败:', error);
    return NextResponse.json(
      { error: '解读生成失败' },
      { status: 500 },
    );
  }
}
