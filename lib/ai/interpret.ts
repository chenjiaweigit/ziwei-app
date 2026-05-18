import OpenAI from 'openai';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { SYSTEM_PROMPT, TOPIC_PROMPTS } from './prompts';
import { extractChartContext } from './knowledge';

function getClient(): OpenAI {
  const provider = process.env.AI_PROVIDER || 'deepseek';

  if (provider === 'deepseek') {
    return new OpenAI({
      baseURL: 'https://api.deepseek.com/v1',
      apiKey: process.env.DEEPSEEK_API_KEY || '',
    });
  }

  return new OpenAI({
    baseURL: process.env.MIMO_BASE_URL || 'https://api.deepseek.com/v1',
    apiKey: process.env.MIMO_API_KEY || process.env.DEEPSEEK_API_KEY || '',
  });
}

const MODEL = process.env.AI_MODEL || 'deepseek-chat';

function buildContext(chart: ZiweiChart): string {
  return extractChartContext(chart);
}

export async function streamInterpret(
  chart: ZiweiChart,
  messages: { role: 'user' | 'assistant'; content: string }[],
): Promise<ReadableStream> {
  const client = getClient();
  const context = buildContext(chart);

  const systemMessage = `${SYSTEM_PROMPT}\n\n以下是命主的命盘数据。请据此给出解读：\n\n${context}`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemMessage },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 4096,
    stream: true,
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const delta = chunk.choices?.[0]?.delta;
          if (delta?.content) {
            const data = JSON.stringify({ delta: { text: delta.content } });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: '解读生成失败' })}\n\n`),
        );
        controller.close();
      }
    },
  });
}

export async function generateInterpretation(
  chart: ZiweiChart,
  topic?: string,
): Promise<string> {
  if (!topic) topic = 'overview';

  const prompt = TOPIC_PROMPTS[topic] || TOPIC_PROMPTS.overview;
  const client = getClient();
  const context = buildContext(chart);

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n命盘数据：\n${context}` },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
  });

  return response.choices?.[0]?.message?.content || '解读生成失败';
}
