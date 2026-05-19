import { NextRequest, NextResponse } from 'next/server';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { streamHeming } from '@/lib/ai/interpret';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chartA, chartB, question } = body as { chartA: ZiweiChart; chartB: ZiweiChart; question?: string };
    if (!chartA || !chartB) {
      return NextResponse.json({ error: '缺少必填字段：chartA, chartB' }, { status: 400 });
    }
    const stream = await streamHeming(chartA, chartB, question);
    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
    });
  } catch (error) {
    console.error('合盘分析失败:', error);
    return NextResponse.json({ error: '合盘分析生成失败' }, { status: 500 });
  }
}
