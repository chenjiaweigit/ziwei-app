import { NextRequest, NextResponse } from 'next/server';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { streamInterpret } from '@/lib/ai/interpret';

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
