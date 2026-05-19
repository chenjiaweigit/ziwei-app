import OpenAI from 'openai';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { SYSTEM_PROMPT, TOPIC_PROMPTS } from './prompts';
import { extractChartContext } from './knowledge';

function getClient(): OpenAI {
  const provider = process.env.AI_PROVIDER || 'deepseek';
  return new OpenAI({
    baseURL: provider === 'deepseek' ? 'https://api.deepseek.com/v1' : (process.env.MIMO_BASE_URL || 'https://api.deepseek.com/v1'),
    apiKey: process.env.DEEPSEEK_API_KEY || process.env.MIMO_API_KEY || '',
  });
}

const MODEL = process.env.AI_MODEL || 'deepseek-chat';

function buildContext(chart: ZiweiChart): string {
  return extractChartContext(chart);
}

export async function streamInterpret(chart: ZiweiChart, messages: { role: 'user' | 'assistant'; content: string }[]): Promise<ReadableStream> {
  const client = getClient();
  const context = buildContext(chart);
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n以下是命主的命盘数据。请据此给出解读：\n\n${context}` },
      ...messages,
    ],
    temperature: 0.7, max_tokens: 4096, stream: true,
  });
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const delta = chunk.choices?.[0]?.delta;
          if (delta?.content) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: delta.content } })}\n\n`));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch { controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: '解读生成失败' })}\n\n`)); controller.close(); }
    },
  });
}

export async function streamHeming(chartA: ZiweiChart, chartB: ZiweiChart, question?: string): Promise<ReadableStream> {
  const client = getClient();
  const contextA = buildContext(chartA);
  const contextB = buildContext(chartB);
  const systemPrompt = `你是一位精通倪海夏《天纪》体系紫微斗数的资深命理师，专精于合盘（双盘对比分析）。${question ? `用户问题：${question}` : '请基于双方命盘，进行全面的合盘分析。'}甲方命盘：\n${contextA}\n乙方命盘：\n${contextB}`;
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question || '请分析这两人的缘分匹配度、感情走向与相处建议。' },
    ],
    temperature: 0.7, max_tokens: 4096, stream: true,
  });
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const delta = chunk.choices?.[0]?.delta;
          if (delta?.content) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: delta.content } })}\n\n`));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch { controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: '合盘分析生成失败' })}\n\n`)); controller.close(); }
    },
  });
}

export async function generateInterpretation(chart: ZiweiChart, topic?: string): Promise<string> {
  const prompt = TOPIC_PROMPTS[topic || 'overview'] || TOPIC_PROMPTS.overview;
  const client = getClient();
  const context = buildContext(chart);
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n命盘数据：\n${context}` },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7, max_tokens: 4096,
  });
  return response.choices?.[0]?.message?.content || '解读生成失败';
}