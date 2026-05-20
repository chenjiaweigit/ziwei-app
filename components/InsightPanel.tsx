'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SelectedSiHua {
  starName: string;
  siHua: string;
  view: TimeView;
}

interface InsightPanelProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
  selectedSiHua?: SelectedSiHua | null;
}

const FETCH_TIMEOUT = 120_000;

const TOPICS = [
  { key: 'overview',     label: '命格' },
  { key: 'love',        label: '感情' },
  { key: 'career',      label: '事业' },
  { key: 'wealth',      label: '财运' },
  { key: 'health',      label: '健康' },
  { key: 'personality', label: '性格' },
] as const;

type TopicKey = typeof TOPICS[number]['key'];

type ViewMode = 'professional' | 'simple';

const TOPIC_PROMPTS: Record<string, string> = {
  overview: `请生成命格总览，按以下结构输出：

**【命格定性】**
用一句话概括这个命盘的核心格局与命主气质。

**【主星解读】**
命宫主星的核心特质，引用倪海夏原话或观点。

**【三方四正】**
财、官、迁三宫的联动分析及整体格局。

**【当前大限】**
当下大限运势方向与最值得关注的事项。

**【优势与注意】**
命盘天赋优势，以及需要注意的风险或功课。`,

  love: `请深度分析感情婚姻运，按以下结构输出：

**【感情格局】**
一句话定性感情命格。

**【夫妻宫分析】**
夫妻宫主星、四化，以及倪海夏体系的具体解读。

**【三方联动】**
相关宫位对感情的影响。

**【当前大限感情运】**
当下10年感情走向与关键节点。

**【实际建议】**
具体可行的感情建议。`,

  career: `请深度分析事业运，按以下结构输出：

**【事业格局】**
一句话定性事业命格，宜任职或宜创业。

**【官禄宫分析】**
官禄宫主星、四化，以及倪师对这种配置的判断。

**【财帛宫联动】**
财运与事业的关系，财路来源分析。

**【当前大限事业运】**
当下10年事业走向。

**【实际建议】**
适合的方向、行业与策略。`,

  wealth: `请深度分析财运，按以下结构输出：

**【财运格局】**
一句话定性财运模式，是主动财还是被动财。

**【财帛宫分析】**
财帛宫主星、四化，财富来源与流动模式。

**【田宅宫（财库）】**
积蓄能力与不动产运势分析。

**【当前大限财运】**
当下财运走向与注意事项。

**【理财建议】**
具体的财务建议。`,

  health: `请分析健康运势，按以下结构输出：

**【疾厄宫主星】**
疾厄宫星曜与健康含义。

**【主要风险】**
结合倪海夏子午流注理论，分析主要健康隐患与需关注的部位。

**【大限健康走势】**
当下健康趋势与关键时间段。

**【预防建议】**
具体注意事项与养生方向。`,

  personality: `请深度解析性格特质，按以下结构输出：

**【命宫主星性格】**
命宫主星的核心性格特质，引用倪师原话。

**【三方性格综合】**
财、官、迁三宫对性格的影响，全貌描绘。

**【人际关系模式】**
与他人互动方式、待人处世风格。

**【优势与人生课题】**
天赋优势，以及需要面对的人生功课。`,
};

const SIMPLE_PROMPTS: Record<string, string> = {
  overview: `请用通俗易懂的方式解读这个命盘，结构如下：

**【核心结论】**
用最简单直白的话，1-2句话说清楚这个命盘最大的特点是什么，让人一听就懂。

**【行动建议】**
给出2-3条具体、可操作的建议，直接告诉用户现在应该做什么，越简单越好。

**【详细解读】**
用最简短的话解释这个命盘的关键配置，不要用太多专业术语，让普通人能听懂。控制在150字以内。

──────────────────────────────────────

**通俗版总结：** 用大白话把这个命盘说清楚，让人一听就知道自己是什么命。格式：「你这个人啊，...」

**你现在最值得做的1-2件事：**
列出用户当下最值得做的1-2件事，简短明确。`,

  love: `请用通俗易懂的方式分析感情运势，结构如下：

**【核心结论】**
用最简单直白的话，1-2句话说清楚感情方面最大的特点是什么。

**【行动建议】**
给出2-3条具体、可操作的情感建议，直接告诉用户应该怎么做。

**【详细解读】**
用简短的话解释感情宫位的关键配置，让普通人能听懂。控制在150字以内。

──────────────────────────────────────

**通俗版总结：** 用大白话把感情运势说清楚，让人一听就明白自己感情上是什么情况。格式：「在感情上，你这个人啊，...」

**你现在最值得做的1-2件事：**
列出感情方面最值得做的1-2件事。`,

  career: `请用通俗易懂的方式分析事业运势，结构如下：

**【核心结论】**
用最简单直白的话，1-2句话说清楚事业方面最大的特点是什么，适合上班还是创业。

**【行动建议】**
给出2-3条具体、可操作的职业建议，告诉用户适合往哪个方向发展。

**【详细解读】**
用简短的话解释事业宫位的关键配置，让普通人能听懂。控制在150字以内。

──────────────────────────────────────

**通俗版总结：** 用大白话把事业运势说清楚，让人一听就明白自己适合什么样的工作。格式：「在事业上，你这个人啊，...」

**你现在最值得做的1-2件事：**
列出事业方面最值得做的1-2件事。`,

  wealth: `请用通俗易懂的方式分析财运，结构如下：

**【核心结论】**
用最简单直白的话，1-2句话说清楚财运模式，是上班赚钱还是投资赚钱，适合什么样的财务规划。

**【行动建议】**
给出2-3条具体、可操作的理财建议，告诉用户应该怎么管钱。

**【详细解读】**
用简短的话解释财帛宫的关键配置，让普通人能听懂。控制在150字以内。

──────────────────────────────────────

**通俗版总结：** 用大白话把财运说清楚，让人一听就知道自己怎么赚钱、怎么花钱。格式：「在钱财上，你这个人啊，...」

**你现在最值得做的1-2件事：**
列出理财方面最值得做的1-2件事。`,

  health: `请用通俗易懂的方式分析健康运势，结构如下：

**【核心结论】**
用最简单直白的话，1-2句话说清楚健康方面需要注意什么，哪里比较薄弱。

**【行动建议】**
给出2-3条具体、可操作的养生建议，告诉用户平时应该注意什么。

**【详细解读】**
用简短的话解释健康宫位的关键配置，让普通人能听懂。控制在150字以内。

──────────────────────────────────────

**通俗版总结：** 用大白话把健康运势说清楚，让人一听就知道自己该注意什么。格式：「在健康上，你这个人啊，...」

**你现在最值得做的1-2件事：**
列出健康方面最值得做的1-2件事。`,

  personality: `请用通俗易懂的方式解析性格特质，结构如下：

**【核心结论】**
用最简单直白的话，1-2句话说清楚这个人最大的性格特点是什么。

**【行动建议】**
给出2-3条具体建议，告诉你这样的性格在人际交往中应该注意什么。

**【详细解读】**
用简短的话解释性格配置，让普通人能听懂。控制在150字以内。

──────────────────────────────────────

**通俗版总结：** 用大白话把性格说清楚，让人一听就认识自己。格式：「你这个人啊，性格上...」

**你现在最值得做的1-2件事：**
列出性格发挥方面最值得做的1-2件事。`,
};

const PALACE_ROLES: Record<string, string> = {
  '命宫':   '自我、性格、先天格局',
  '兄弟宫': '兄弟关系、合伙人',
  '夫妻宫': '感情关系、婚姻状态',
  '子女宫': '子女缘分、下属关系',
  '财帛宫': '财运来源、收入方式',
  '疾厄宫': '身体健康、意外',
  '迁移宫': '外出机遇、人际格局',
  '交友宫': '朋友圈、贵人、小人',
  '官禄宫': '事业成就、社会地位',
  '田宅宫': '不动产、家庭环境',
  '福德宫': '精神享受、内心福分',
  '父母宫': '父母关系、文书契约',
};

/** Render AI markdown: **【Title】** → gold header, **bold** → strong */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const processed = text.replace(/<br\s*\/?>/gi, '\n');
  const lines = processed.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-0.5 first:pt-0">
              <span className="text-[13px] font-semibold tracking-wide" style={{ color: 'var(--t-gold)' }}>
                【{sectionMatch[1]}】
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[12px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} className="font-medium" style={{ color: 'var(--t-text)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span
          className="inline-block w-1.5 h-3 ml-0.5 animate-pulse rounded-sm align-middle"
          style={{ background: 'var(--t-gold)', opacity: 0.6 }}
        />
      )}
    </div>
  );
}

export default function InsightPanel({ chart, selectedPalace, selectedSiHua }: InsightPanelProps) {
  const [topicMessages, setTopicMessages] = useState<Record<TopicKey, Record<ViewMode, Message[]>>>({
    overview: { professional: [], simple: [] },
    love: { professional: [], simple: [] },
    career: { professional: [], simple: [] },
    wealth: { professional: [], simple: [] },
    health: { professional: [], simple: [] },
    personality: { professional: [], simple: [] },
  });
  const [qaMessages, setQaMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [topicLoading, setTopicLoading] = useState(false);
  const [qaLoading, setQaLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<TopicKey>('overview');
  const [viewMode, setViewMode] = useState<ViewMode>('professional');
  const topicMessagesRef = useRef<Record<TopicKey, Record<ViewMode, Message[]>>>(topicMessages);
  const qaMessagesRef = useRef<Message[]>(qaMessages);
  const topicLoadingRef = useRef(false);
  const qaLoadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);
  const qaScrollRef = useRef<HTMLDivElement>(null);
  const topicQueue = useRef<{ key: TopicKey; text: string; mode: ViewMode }[]>([]);
const qaQueue = useRef<string[]>([]);

const QA_PLACEHOLDERS = [
  '我的命格有什么特点？',
  '我的命格适合什么样的发展方向？',
  '我这辈子大概是什么样的命运？',
  '我的感情运势如何？',
  '我什么时候能遇到正缘？',
  '我的婚姻前景怎样？',
  '我的事业发展方向如何？',
  '我适合创业还是上班？',
  '我的事业高峰期在什么时候？',
  '我的财运如何？',
  '我这几年财运会好转吗？',
  '我适合投资什么领域？',
  '我的健康需要注意什么？',
  '我的体质有什么弱点？',
  '我应该如何保养身体？',
  '我的性格有什么特点？',
  '我的性格在人际交往中要注意什么？',
  '我的性格优势在哪里？',
];

const [qaPlaceholder, setQaPlaceholder] = useState(
  QA_PLACEHOLDERS[Math.floor(Math.random() * QA_PLACEHOLDERS.length)]
);

useEffect(() => {
  const interval = setInterval(() => {
    setQaPlaceholder(QA_PLACEHOLDERS[Math.floor(Math.random() * QA_PLACEHOLDERS.length)]);
  }, 3000);
  return () => clearInterval(interval);
}, []);

useEffect(() => { topicMessagesRef.current = topicMessages; }, [topicMessages]);
  useEffect(() => { qaMessagesRef.current = qaMessages; }, [qaMessages]);
  useEffect(() => { topicLoadingRef.current = topicLoading; }, [topicLoading]);
  useEffect(() => { qaLoadingRef.current = qaLoading; }, [qaLoading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [topicMessages, activeTopic, topicLoading]);

  useEffect(() => {
    if (qaScrollRef.current) {
      qaScrollRef.current.scrollTop = qaScrollRef.current.scrollHeight;
    }
  }, [qaMessages, qaLoading]);

  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    const prompt = viewMode === 'simple' ? SIMPLE_PROMPTS.overview : TOPIC_PROMPTS.overview;
    topicQueue.current.push({ key: 'overview', text: prompt, mode: viewMode });
    processTopicQueue();
  }, []);

  useEffect(() => {
    if (!selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;

    const majorStars = selectedPalace.stars.filter(s => s.type === 'major');
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => `${s.name}${s.siHua ? '化' + s.siHua : ''}`).join('、')
      : '空宫（借对宫）';
    const role = PALACE_ROLES[selectedPalace.name] ?? '';

    const professionalPrompt = `请重点分析【${selectedPalace.name}】（主管：${role}），该宫主星为${starDesc}，按以下结构输出：

**【宫位定性】**
${selectedPalace.name}在命盘中的意义，以及这种星曜配置的整体判断。

**【主星解读】**
主星在此宫的倪海夏体系解读，引用具体观点。

**【三方四正联动】**
三方四正宫位对此宫的影响。

**【实际建议】**
基于此宫的具体建议。`;

    const simplePrompt = `请用通俗易懂的方式重点分析【${selectedPalace.name}】，结构如下：

**【核心结论】**
用最简单的话，1-2句话说清楚${selectedPalace.name}最大的特点是什么，让人一听就懂。

**【行动建议】**
给出2条具体建议，告诉用户应该怎么做，越简单越好。

**【详细解读】**
用简短的话解释${selectedPalace.name}的关键配置，让普通人能听懂。控制在150字以内。

──────────────────────────────────────

**通俗版总结：** 用大白话把${selectedPalace.name}说清楚，让人一听就懂。`;

    const prompt = viewMode === 'simple' ? simplePrompt : professionalPrompt;

    if (topicMessagesRef.current[activeTopic][viewMode].length > 0) {
      setTopicMessages(prev => ({
        ...prev,
        [activeTopic]: {
          ...prev[activeTopic],
          [viewMode]: [],
        },
      }));
    }
    topicQueue.current.push({ key: activeTopic, text: prompt, mode: viewMode });
    processTopicQueue();
  }, [selectedPalace, activeTopic, viewMode]);

  useEffect(() => {
    if (!selectedSiHua) return;
    const key = `${selectedSiHua.starName}-${selectedSiHua.siHua}-${selectedSiHua.view}`;
    if (key === lastSiHuaKey.current) return;
    lastSiHuaKey.current = key;

    const palaceOfStar = chart.palaces.find(p =>
      p.stars.some(s => s.name === selectedSiHua.starName)
    );
    const palaceName = palaceOfStar?.name ?? '未知宫位';
    const viewLabel = selectedSiHua.view === 'daxian' ? '大限' : '流年';

    const professionalPrompt = `请分析【${viewLabel}${selectedSiHua.starName}化${selectedSiHua.siHua}】的飞化影响，按以下结构输出：

**【化${selectedSiHua.siHua}基本含义】**
化${selectedSiHua.siHua}在倪海夏体系中的核心含义，以及${selectedSiHua.starName}化${selectedSiHua.siHua}的特殊含义。

**【落宫影响】**
${selectedSiHua.starName}化${selectedSiHua.siHua}落在【${palaceName}】，该宫主管的领域受到何种影响，倪师如何解读。

**【三方四正飞化路径】**
化${selectedSiHua.siHua}入${palaceName}后，对其三方四正（对宫、两个三合宫）的联动影响。

**【当前运势影响】**
在${viewLabel}时间维度下，此化${selectedSiHua.siHua}对命主近期运势的具体影响。

**【实际建议】**
基于此四化的具体可操作建议。`;

    const simplePrompt = `请用通俗易懂的方式分析【${viewLabel}${selectedSiHua.starName}化${selectedSiHua.siHua}】，结构如下：

**【核心结论】**
用最简单的话，1-2句话说清楚这个四化的影响是什么，让人一听就懂。

**【行动建议】**
给出2条具体建议，告诉用户应该怎么做。

**【详细解读】**
用简短的话解释这个四化的关键影响，让普通人能听懂。控制在150字以内。

──────────────────────────────────────

**通俗版总结：** 用大白话把这个四化说清楚，让人一听就懂。`;

    const prompt = viewMode === 'simple' ? simplePrompt : professionalPrompt;

    if (topicMessagesRef.current[activeTopic][viewMode].length > 0) {
      setTopicMessages(prev => ({
        ...prev,
        [activeTopic]: {
          ...prev[activeTopic],
          [viewMode]: [],
        },
      }));
    }
    topicQueue.current.push({ key: activeTopic, text: prompt, mode: viewMode });
    processTopicQueue();
  }, [selectedSiHua, activeTopic, viewMode]);

  const processTopicQueue = useCallback(() => {
    if (topicLoadingRef.current || topicQueue.current.length === 0) return;
    const nextItem = topicQueue.current.shift()!;
    sendTopicMessage(nextItem.key, nextItem.text, nextItem.mode);
  }, []);

  const processQaQueue = useCallback(() => {
    if (qaLoadingRef.current || qaQueue.current.length === 0) return;
    const text = qaQueue.current.shift()!;
    sendQaMessage(text, true);
  }, []);

  const handleTopicClick = (topicKey: TopicKey) => {
    setActiveTopic(topicKey);

    if (topicMessagesRef.current[topicKey][viewMode].length > 0) return;

    const prompt = viewMode === 'simple' ? SIMPLE_PROMPTS[topicKey] : TOPIC_PROMPTS[topicKey];
    if (!topicLoadingRef.current) {
      topicQueue.current.push({ key: topicKey, text: prompt, mode: viewMode });
      processTopicQueue();
    } else {
      topicQueue.current.push({ key: topicKey, text: prompt, mode: viewMode });
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input;
    setInput('');
    qaQueue.current.push(text);
    processQaQueue();
  };

  const sendTopicMessage = (topicKey: TopicKey, text: string, mode: ViewMode) => {
    if (!text.trim() || topicLoadingRef.current) return;
    topicLoadingRef.current = true;
    setTopicLoading(true);

    const currentMessages = topicMessagesRef.current[topicKey][mode];
    const userMsg: Message = { role: 'user', content: text };
    const apiMessages = [...currentMessages, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    setTopicMessages(prev => ({
      ...prev,
      [topicKey]: {
        ...prev[topicKey],
        [mode]: [...prev[topicKey][mode], userMsg],
      },
    }));
    streamTopicResponse(topicKey, apiMessages, mode);
  };

  const sendQaMessage = (text: string, hidden = false) => {
    if (!text.trim() || qaLoadingRef.current) return;
    qaLoadingRef.current = true;
    setQaLoading(true);

    const userMsg: Message = { role: 'user', content: text };
    setQaMessages(prev => [...prev, userMsg]);

    const baseMessages = [...qaMessagesRef.current, userMsg].map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const apiMessages = [
      ...baseMessages,
      {
        role: 'user' as const,
        content: `${text}\n\n请在回答末尾追加以下通俗版说明（用"通俗版"标题分隔）：\n──────────────────────────────────────\n**通俗版：** 用最直白的话把上面的回答翻译成普通人都能听懂的大白话（50字以内）。\n**行动建议：** 基于上述回答，给出1-2条用户现在可以做的具体行动。`,
      },
    ];

    streamQaResponse(apiMessages);
  };

  const streamTopicResponse = async (topicKey: TopicKey, apiMessages: { role: 'user' | 'assistant'; content: string }[], mode: ViewMode) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, messages: apiMessages }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || '请求失败');
      }
      if (!res.body) throw new Error('无响应流');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setTopicMessages(prev => ({
        ...prev,
        [topicKey]: {
          ...prev[topicKey],
          [mode]: [...prev[topicKey][mode], { role: 'assistant', content: '' }],
        },
      }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const delta = JSON.parse(data).delta?.text ?? '';
            assistantText += delta;
            setTopicMessages(prev => {
              const updated = { ...prev };
              updated[topicKey] = {
                ...updated[topicKey],
                [mode]: [...updated[topicKey][mode]],
              };
              const msgs = updated[topicKey][mode];
              msgs[msgs.length - 1] = { role: 'assistant', content: assistantText };
              return updated;
            });
          } catch { /* skip */ }
        }
      }
    } catch (err) {
      const msg = err instanceof DOMException && err.name === 'AbortError'
        ? '解读请求超时，请检查 API 配置后重试。'
        : '解读失败，请稍后重试。';
      setTopicMessages(prev => ({
        ...prev,
        [topicKey]: {
          ...prev[topicKey],
          [mode]: [...prev[topicKey][mode], { role: 'assistant', content: msg }],
        },
      }));
    } finally {
      topicLoadingRef.current = false;
      setTopicLoading(false);
      setTimeout(() => processTopicQueue(), 100);
    }
  };

  const streamQaResponse = async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, messages: apiMessages }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || '请求失败');
      }
      if (!res.body) throw new Error('无响应流');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setQaMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const delta = JSON.parse(data).delta?.text ?? '';
            assistantText += delta;
            setQaMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: assistantText };
              return updated;
            });
          } catch { /* skip */ }
        }
      }
    } catch (err) {
      const msg = err instanceof DOMException && err.name === 'AbortError'
        ? '解读请求超时，请检查 API 配置后重试。'
        : '解读失败，请稍后重试。';
      setQaMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    } finally {
      qaLoadingRef.current = false;
      setQaLoading(false);
      setTimeout(() => processQaQueue(), 100);
    }
  };

  const currentMessages = topicMessages[activeTopic][viewMode];
  const hasAnyTopicMessages = Object.values(topicMessages).some(
    topic => topic.professional.length > 0 || topic.simple.length > 0
  );

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden card-glass">

      {/* ── 主题分析 ── */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2" style={{ borderBottom: '1px solid var(--t-border)' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--t-gold), transparent)', opacity: 0.3 }} />
          <span className="text-[13px] tracking-[0.2em] font-medium px-3" style={{ color: 'var(--t-gold)' }}>命理解读</span>
          <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--t-gold), transparent)', opacity: 0.3 }} />
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {TOPICS.map(t => {
            const isActive = activeTopic === t.key;
            const hasContent = topicMessages[t.key].professional.length > 0 || topicMessages[t.key].simple.length > 0;
            return (
              <button
                key={t.key}
                onClick={() => handleTopicClick(t.key)}
                className="py-2 text-[11px] font-medium rounded-lg transition-all duration-200 relative"
                style={{
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(212,168,67,0.2) 0%, rgba(212,168,67,0.1) 100%)' 
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? 'rgba(212,168,67,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: isActive ? '#e8c060' : '#8899aa',
                  boxShadow: isActive ? '0 2px 8px rgba(212,168,67,0.15)' : 'none',
                }}
              >
                {t.label}
                {hasContent && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--t-gold)' }} />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 mt-2">
          <button
            onClick={() => {
              setViewMode('professional');
              if (topicMessagesRef.current[activeTopic].professional.length === 0) {
                const prompt = TOPIC_PROMPTS[activeTopic];
                topicQueue.current.push({ key: activeTopic, text: prompt, mode: 'professional' });
                processTopicQueue();
              }
            }}
            className="relative text-[11px] py-1 px-3 transition-colors"
            style={{ color: viewMode === 'professional' ? 'var(--t-gold)' : 'var(--t-faint)' }}
          >
            专业版
            {viewMode === 'professional' && (
              <motion.div
                layoutId="viewModeUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: 'var(--t-gold)' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => {
              setViewMode('simple');
              if (topicMessagesRef.current[activeTopic].simple.length === 0) {
                const prompt = SIMPLE_PROMPTS[activeTopic];
                topicQueue.current.push({ key: activeTopic, text: prompt, mode: 'simple' });
                processTopicQueue();
              }
            }}
            className="relative text-[11px] py-1 px-3 transition-colors"
            style={{ color: viewMode === 'simple' ? 'var(--t-gold)' : 'var(--t-faint)' }}
          >
            通俗版
            {viewMode === 'simple' && (
              <motion.div
                layoutId="viewModeUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: 'var(--t-gold)' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* ── 命理解读区域 ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">

        {!hasAnyTopicMessages && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-3xl mb-3" style={{ color: 'var(--t-gold)', opacity: 0.15 }}>✦</div>
            <p className="text-[12px]" style={{ color: 'var(--t-faint)' }}>
              点击上方主题开始解读
            </p>
          </div>
        )}

        {currentMessages.length === 0 && hasAnyTopicMessages && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-[12px]" style={{ color: 'var(--t-faint)' }}>
              点击查看命理解读
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {currentMessages.map((msg, i) => {
            if (msg.role === 'user') return null;

            const isLastMsg = i === currentMessages.length - 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className="text-[10px] tracking-widest mb-2.5 flex items-center gap-1.5"
                  style={{ color: 'var(--t-faint)' }}
                >
                  <span style={{ color: 'var(--t-gold)', opacity: 0.4 }}>✦</span>
                  {TOPICS.find(t => t.key === activeTopic)?.label}解读
                </div>
                <AiContent text={msg.content} streaming={topicLoading && isLastMsg} />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {topicLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 py-2"
          >
            <div className="flex gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--t-gold)', animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--t-gold)', animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--t-gold)', animationDelay: '300ms' }} />
            </div>
            <span className="text-[11px]" style={{ color: 'var(--t-gold)' }}>AI 正在思考...</span>
          </motion.div>
        )}
      </div>

      {/* ── AI问答区域 ── */}
      <div className="flex-shrink-0 flex flex-col" style={{ borderTop: '1px solid var(--t-border)', maxHeight: '40%' }}>
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
            <span className="text-[11px] tracking-[0.15em] px-3" style={{ color: 'var(--t-faint)' }}>AI 问答</span>
            <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
          </div>
        </div>
        
        <div ref={qaScrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-3 min-h-0">
          {qaMessages.length === 0 && !qaLoading && (
            <div className="text-center py-3">
              <p className="text-[11px]" style={{ color: 'var(--t-faint)' }}>
                你可以这样提问：<span style={{ color: '#d4a843' }}>{qaPlaceholder}</span>
              </p>
            </div>
          )}

          {qaMessages.map((msg, i) => {
            if (msg.role === 'user') {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div
                    className="max-w-[85%] rounded-xl px-4 py-2.5 text-[12px]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(212,168,67,0.12) 0%, rgba(212,168,67,0.06) 100%)',
                      border: '1px solid rgba(212,168,67,0.2)',
                      color: 'var(--t-gold)',
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              );
            }

            const isLastMsg = i === qaMessages.length - 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-[11px] mb-1.5" style={{ color: 'var(--t-faint)' }}>
                  <span style={{ color: 'var(--t-gold)', opacity: 0.7 }}>✦</span> AI 回答
                </div>
                <div
                  className="rounded-xl px-4 py-2.5 text-[11px]"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--t-text2)',
                  }}
                >
                  <AiContent text={msg.content} streaming={qaLoading && isLastMsg} />
                </div>
              </motion.div>
            );
          })}

          {qaLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 py-2"
            >
              <div className="flex gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--t-gold)', animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--t-gold)', animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--t-gold)', animationDelay: '300ms' }} />
              </div>
              <span className="text-[11px]" style={{ color: 'var(--t-gold)' }}>AI 正在思考...</span>
            </motion.div>
          )}
        </div>

        <div className="px-4 pb-3 pt-2">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={qaLoading ? 'AI 解读中…' : '输入你的疑问...'}
              className="flex-1 rounded-xl px-4 py-3 text-[12px] focus:outline-none transition-all"
              style={{
                background: input.trim() ? 'rgba(200, 160, 50, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                border: input.trim() ? '2px solid #c8a032' : '1px solid rgba(255, 255, 255, 0.2)',
                color: 'var(--t-text)',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || qaLoading}
              className="px-5 py-3 rounded-xl text-[12px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: input.trim() && !qaLoading
                  ? 'linear-gradient(135deg, #c8a032 0%, #a88420 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: input.trim() && !qaLoading
                  ? '2px solid #d4a843'
                  : '1px solid rgba(255, 255, 255, 0.2)',
                color: input.trim() && !qaLoading ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
              }}
            >
              {qaLoading ? '•••' : '追问'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
