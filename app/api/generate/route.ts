import { NextRequest, NextResponse } from 'next/server';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo } from '@/lib/ziwei/types';

export async function POST(request: NextRequest) {
  try {
    const body: BirthInfo = await request.json();
    const { year, month, day, hour, gender } = body;
    if (!year || !month || !day || hour === undefined || !gender) {
      return NextResponse.json({ error: '缺少必填字段：year, month, day, hour, gender' }, { status: 400 });
    }
    if (year < 1900 || year > 2030) {
      return NextResponse.json({ error: '年份超出范围（1900-2030）' }, { status: 400 });
    }
    if (gender !== 'male' && gender !== 'female') {
      return NextResponse.json({ error: '性别无效' }, { status: 400 });
    }
    const chart = generateChart(body);
    return NextResponse.json(chart);
  } catch (error) {
    console.error('生成命盘失败:', error);
    return NextResponse.json({ error: '命盘生成失败，请检查输入数据' }, { status: 500 });
  }
}
