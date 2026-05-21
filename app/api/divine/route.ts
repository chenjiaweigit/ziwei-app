import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface ProviderConfig {
  provider: string;
  baseURL: string;
  apiKey: string;
  model: string;
  retryCount: number;
}

function getProviderConfigs(): ProviderConfig[] {
  const configs: ProviderConfig[] = [];
  const slots = ['PRIMARY', 'PROVIDER1', 'PROVIDER2'];
  for (const slot of slots) {
    const baseURL = process.env[`${slot}_BASE_URL`];
    const apiKey = process.env[`${slot}_API_KEY`];
    if (!baseURL || !apiKey) continue;
    configs.push({
      provider: process.env[`${slot}_PROVIDER`] || slot.toLowerCase(),
      baseURL,
      apiKey,
      model: process.env[`${slot}_MODEL`] || 'gpt-4o-mini',
      retryCount: Math.max(0, parseInt(process.env[`${slot}_RETRY_COUNT`] || '1', 10)),
    });
  }
  if (configs.length === 0) {
    const legacyApiKey = process.env.DEEPSEEK_API_KEY;
    if (legacyApiKey) {
      configs.push({
        provider: process.env.AI_PROVIDER || 'deepseek',
        baseURL: process.env.MIMO_BASE_URL || 'https://api.deepseek.com/v1',
        apiKey: legacyApiKey,
        model: process.env.AI_MODEL || 'deepseek-chat',
        retryCount: 1,
      });
    }
  }
  return configs;
}

const SYSTEM_PROMPT = `你是一位精通倪海厦《天纪》体系的易经占卜解卦大师。你的角色是：

1. 解释卦象的象征意义（上下卦的关系、五行生克）
2. 结合倪师讲解要点给出通俗易懂的解释
3. 如果有动爻，解释动爻的意义以及本卦到变卦的变化趋势
4. 给出实际生活建议（事业、感情、健康、决策等方面）
5. 风格平实亲切，避免过度玄学化的表述，重在给问卦者启发

注意：
- 使用简体中文
- 语气诚恳、正面、有建设性
- 不要给出绝对化的预言
- 控制在 500 字以内`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hexagram, changed, changingPosition, innerHexagram, question } = body as {
      hexagram: { number: number; name: string; composition: string; meaning: string; niInterpretation: string; divination: string; upper: string; lower: string };
      changed?: { number: number; name: string; composition: string; meaning: string; niInterpretation: string; divination: string };
      changingPosition?: number;
      innerHexagram?: { number: number; name: string; composition: string };
      question?: string;
    };

    if (!hexagram) {
      return NextResponse.json({ error: '缺少卦象数据' }, { status: 400 });
    }

    let context = `【本卦】第${hexagram.number}卦 ${hexagram.name}（${hexagram.composition}）\n卦辞：${hexagram.meaning}\n倪师解：${hexagram.niInterpretation}\n断辞：${hexagram.divination}\n上卦：${hexagram.upper}，下卦：${hexagram.lower}`;

    if (changingPosition && changed) {
      context += `\n\n【动爻】第${changingPosition}爻变动\n\n【变卦】第${changed.number}卦 ${changed.name}（${changed.composition}）\n卦辞：${changed.meaning}\n倪师解：${changed.niInterpretation}\n断辞：${changed.divination}`;
    }

    if (innerHexagram) {
      context += `\n\n【互卦】第${innerHexagram.number}卦 ${innerHexagram.name}（${innerHexagram.composition}）`;
    }

    if (question) {
      context += `\n\n【问卦者的问题】${question}`;
    }

    const encoder = new TextEncoder();
    const configs = getProviderConfigs();

    if (configs.length === 0) {
      return NextResponse.json({ error: 'AI 服务未配置' }, { status: 500 });
    }

    let lastError: unknown;
    for (const config of configs) {
      const attempts = config.retryCount + 1;
      for (let i = 0; i < attempts; i++) {
        try {
          const client = new OpenAI({ baseURL: config.baseURL, apiKey: config.apiKey });
          const response = await client.chat.completions.create({
            model: config.model,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: `以下是一组卦象数据，请为问卦者解读：\n\n${context}` },
            ],
            temperature: 0.7,
            max_tokens: 1024,
            stream: true,
          });

          const stream = new ReadableStream({
            async start(controller) {
              try {
                let hasContent = false;
                for await (const chunk of response) {
                  const delta = chunk.choices?.[0]?.delta;
                  if (delta?.content) {
                    hasContent = true;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: delta.content })}\n\n`));
                  }
                }
                if (!hasContent) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: '解读为空' })}\n\n`));
                }
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
              } catch (err) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: '流式输出中断' })}\n\n`));
                controller.close();
              }
            },
          });

          return new Response(stream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              Connection: 'keep-alive',
            },
          });
        } catch (err) {
          lastError = err;
          console.error(`[Divine AI] ${config.provider} attempt ${i + 1}/${attempts} failed:`, err);
        }
      }
    }

    return NextResponse.json({ error: '所有 AI 服务均不可用' }, { status: 503 });
  } catch (error) {
    console.error('[Divine] Error:', error);
    return NextResponse.json({ error: '解卦失败' }, { status: 500 });
  }
}
