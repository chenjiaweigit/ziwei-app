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

export async function streamHeming(
  chartA: ZiweiChart,
  chartB: ZiweiChart,
  question?: string,
): Promise<ReadableStream> {
  const client = getClient();
  const contextA = buildContext(chartA);
  const contextB = buildContext(chartB);

  const systemPrompt = `你是一位精通倪海夏《天纪》体系紫微斗数的资深命理师，专精于合盘（双盘对比分析）。

合盘分析原则：
1. 先分别看两个人的命宫主星格局，理解各自的天性
2. 重点对比夫妻宫/官禄宫/财帛宫的星曜互动
3. 看双方四化的互补与冲突
4. 基于倪师体系给出实际的相处建议
5. 不说危言耸听的话，以建设性建议为主
6. 每段用【】作为小标题

${question ? `用户问题：${question}` : '请基于双方命盘，进行全面的合盘分析。'}

甲方命盘：
${contextA}

乙方命盘：
${contextB}`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question || '请分析这两人的缘分匹配度、感情走向与相处建议，按以下结构输出：\n\n**【双方命格总览】**\n各自命宫主星与核心特质。\n\n**【感情匹配分析】**\n夫妻宫星曜互动、感情模式的互补与冲突。\n\n**【事业与财运互动】**\n双方在事业和财务上的配合度。\n\n**【大限同步性】**\n当前大限走向是否一致，关键时间节点。\n\n**【相处建议】**\n基于命盘的具体相处策略与建议。' },
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
          encoder.encode(`data: ${JSON.stringify({ error: '合盘分析生成失败' })}\n\n`),
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
