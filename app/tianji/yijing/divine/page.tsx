'use client';

import Link from 'next/link';
import { useState, useCallback, useRef } from 'react';
import { TIANJI_MODULES, coinDivination, numberDivination, timeDivination, buildResult } from '@/lib/nihai';
import type { DivinationMethod, DivinationResult, YaoLine } from '@/lib/nihai';
import HexagramDisplay from '@/components/tianji/HexagramDisplay';
import CoinToss from '@/components/tianji/CoinToss';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const ac = '#d4a843';

const METHOD_OPTIONS: { id: DivinationMethod; icon: string; label: string; desc: string }[] = [
  { id: 'coin', icon: '💰', label: '金钱卦', desc: '三枚硬币掷六次，传统起卦法' },
  { id: 'number', icon: '🔢', label: '数字卦', desc: '输入三个数字快速起卦' },
  { id: 'time', icon: '⏰', label: '时间卦', desc: '以当前时间自动起卦' },
];

export default function YijingDivinePage() {
  const [method, setMethod] = useState<DivinationMethod | null>(null);
  const [step, setStep] = useState(0);
  const [tosses, setTosses] = useState<YaoLine[]>([]);
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [question, setQuestion] = useState('');
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [num3, setNum3] = useState('');
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMethod(null);
    setStep(0);
    setTosses([]);
    setResult(null);
    setQuestion('');
    setAiText('');
    setAiLoading(false);
    setNum1('');
    setNum2('');
    setNum3('');
  }, []);

  const handleCoinToss = useCallback((_results: boolean[]) => {
    const line = {
      position: step + 1,
      value: 0,
      changing: false,
      yin: false,
      label: '',
    };

    const heads = _results.filter(Boolean).length;
    line.value = heads === 0 ? 6 : heads === 1 ? 7 : heads === 2 ? 8 : 9;
    line.yin = line.value % 2 === 0;
    line.changing = line.value === 6 || line.value === 9;
    const yi = line.yin ? '六' : '九';
    const posLabels = ['初', '二', '三', '四', '五', '上'];
    line.label = `${posLabels[step]}${yi}`;

    const newTosses = [...tosses, line];
    setTosses(newTosses);
    const newStep = step + 1;
    setStep(newStep);

    if (newStep === 6) {
      const r = buildResult(newTosses, 'coin');
      setResult(r);
    }
  }, [step, tosses]);

  const doNumberDivination = useCallback(() => {
    const a = parseInt(num1) || Math.floor(Math.random() * 8) + 1;
    const b = parseInt(num2) || Math.floor(Math.random() * 8) + 1;
    const c = parseInt(num3) || Math.floor(Math.random() * 6) + 1;
    const lines = numberDivination(a, b, c);
    setTosses(lines);
    setStep(6);
    setResult(buildResult(lines, 'number'));
  }, [num1, num2, num3]);

  const doTimeDivination = useCallback(() => {
    const lines = timeDivination();
    setTosses(lines);
    setStep(6);
    setResult(buildResult(lines, 'time'));
  }, []);

  const handleAiInterpret = useCallback(async () => {
    if (!result) return;
    setAiLoading(true);
    setAiText('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/divine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hexagram: result.hexagram,
          changed: result.hasChanging ? result.changed : undefined,
          changingPosition: result.hasChanging ? result.changingPosition : undefined,
          innerHexagram: { number: result.innerNumber, name: result.inner.name, composition: result.inner.composition },
          question: question || undefined,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        setAiText('AI 解卦服务暂不可用，请稍后再试');
        setAiLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) setAiText(prev => prev + parsed.text);
            if (parsed.error) setAiText(parsed.error);
          } catch { /* ignore parse errors */ }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setAiText('AI 解卦失败，请重试');
      }
    }
    setAiLoading(false);
  }, [result, question]);

  function renderYaoBar(line: YaoLine) {
    const ac2 = '#ff6b6b';
    const color = line.changing ? ac2 : 'var(--tx-0)';

    const yinSegment = (key: string) => (
      <div key={key} style={{
        width: '32px', height: '3px', borderRadius: '1px', background: color,
      }} />
    );

    return (
      <div key={line.position} className="flex items-center gap-2" style={{ animation: 'fadeInYao 0.3s ease-out' }}>
        <div style={{ width: '80px', height: '18px', display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
          {line.yin ? (
            <>{[0, 1].map(i => yinSegment(`${i}`))}</>
          ) : (
            <div style={{ width: '100%', height: '3px', borderRadius: '1px', background: color }} />
          )}
          {line.changing && <span style={{ position: 'absolute', right: '-18px', top: '2px', fontSize: '11px', color: ac2 }}>✦</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: '10px', color: line.changing ? ac2 : 'var(--tx-3)', fontWeight: line.changing ? 600 : 400 }}>
            {line.label}
          </span>
          <span style={{
            fontSize: '10px', padding: '1px 6px', borderRadius: '4px',
            background: line.changing ? `${ac2}15` : `${ac}08`,
            color: line.changing ? ac2 : 'var(--tx-3)',
          }}>
            {['老阴', '少阳', '少阴', '老阳'][line.value - 6]}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="max-w-3xl mx-auto px-6 pt-4">
        <Link href="/tianji/yijing" style={{
          fontSize: '12px', color: 'var(--tx-3)',
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          textDecoration: 'none',
        }}>
          ← 返回易经
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-6 pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.4))' }} />
          <span style={{ fontSize: '11px', color: ac, letterSpacing: '0.4em' }}>易经 · 起卦占卜</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.4))' }} />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--tx-0)', textAlign: 'center', letterSpacing: '0.1em', marginBottom: '8px' }}>
          {result ? (method === 'coin' ? '金钱卦 · 起卦完成' : '占卜结果') : '选择起卦方式'}
        </h1>
      </div>

      {/* Question input */}
      {(result || (!result && !method)) && (
        <div className="max-w-lg mx-auto px-6 pb-4">
          <div style={{
            background: 'var(--bg-card)', borderRadius: '12px',
            border: '1px solid var(--bdr)', padding: '14px 18px',
          }}>
            <div style={{ fontSize: '10px', color: 'var(--tx-3)', marginBottom: '6px', letterSpacing: '0.1em' }}>
              心中所问（可选）
            </div>
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="默念所问之事，或在此输入..."
              style={{
                width: '100%', padding: '8px 0', border: 'none',
                background: 'none', color: 'var(--tx-0)', fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* Method selection */}
      {!method && !result && (
        <div className="max-w-lg mx-auto px-6 pb-20">
          <div className="space-y-3">
            {METHOD_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => { setMethod(opt.id); if (opt.id === 'time') setTimeout(doTimeDivination, 300); }}
                style={{
                  width: '100%', cursor: 'pointer', textAlign: 'left',
                  background: 'var(--bg-card)', border: `1px solid var(--bdr)`,
                  borderRadius: '12px', padding: '18px 22px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  transition: 'border-color 0.2s',
                }}
              >
                <span style={{ fontSize: '28px' }}>{opt.icon}</span>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--tx-0)' }}>{opt.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--tx-2)', marginTop: '4px' }}>{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Coin toss interaction */}
      {method === 'coin' && !result && (
        <div className="max-w-lg mx-auto px-6 pb-20">
          <div style={{
            background: 'var(--bg-card)', borderRadius: '12px',
            border: '1px solid var(--bdr)', padding: '24px',
            textAlign: 'center',
          }}>
            <div className="flex items-center justify-center gap-2 mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 600,
                  background: i < step ? ac : 'var(--bdr)',
                  color: i < step ? '#fff' : 'var(--tx-3)',
                  transition: 'all 0.3s',
                }}>
                  {i + 1}
                </div>
              ))}
            </div>

            <CoinToss onToss={handleCoinToss} disabled={step >= 6} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', marginTop: '16px', minHeight: '80px' }}>
              {[...tosses].reverse().map(renderYaoBar)}
            </div>

            <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--tx-3)' }}>
              {step < 6 ? `已完成 ${step}/6 爻` : '六爻已齐，卦象生成中...'}
            </div>

            <button
              onClick={reset}
              style={{
                marginTop: '12px', padding: '6px 16px', cursor: 'pointer',
                background: 'none', border: '1px solid var(--bdr)',
                borderRadius: '999px', fontSize: '11px', color: 'var(--tx-3)',
              }}
            >
              重新选择起卦方式
            </button>
          </div>
        </div>
      )}

      {/* Number input */}
      {method === 'number' && !result && (
        <div className="max-w-lg mx-auto px-6 pb-20">
          <div style={{
            background: 'var(--bg-card)', borderRadius: '12px',
            border: '1px solid var(--bdr)', padding: '24px',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '16px', textAlign: 'center' }}>
              输入三个数字（留空则随机）
            </div>
            <div className="flex items-center justify-center gap-3 mb-6">
              {['num1', 'num2', 'num3'].map((key, i) => (
                <div key={key}>
                  <div style={{ fontSize: '10px', color: 'var(--tx-3)', textAlign: 'center', marginBottom: '4px' }}>
                    数字 {i + 1}
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={[num1, num2, num3][i]}
                    onChange={e => [setNum1, setNum2, setNum3][i](e.target.value)}
                    placeholder={['8', '8', '6'][i]}
                    style={{
                      width: '72px', padding: '10px', textAlign: 'center',
                      background: 'var(--bg-page)', border: '1px solid var(--bdr)',
                      borderRadius: '8px', color: 'var(--tx-0)', fontSize: '18px', fontWeight: 700,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={doNumberDivination}
                style={{
                  padding: '12px 32px', cursor: 'pointer',
                  background: ac, color: '#fff', border: 'none',
                  borderRadius: '999px', fontSize: '14px', fontWeight: 600,
                }}
              >
                🔢 起卦
              </button>
              <button
                onClick={reset}
                style={{
                  display: 'block', margin: '12px auto 0',
                  padding: '6px 16px', cursor: 'pointer',
                  background: 'none', border: '1px solid var(--bdr)',
                  borderRadius: '999px', fontSize: '11px', color: 'var(--tx-3)',
                }}
              >
                重新选择起卦方式
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="max-w-3xl mx-auto px-6 space-y-4">
          {/* Method badge */}
          <div className="flex items-center justify-center gap-3">
            <span style={{
              fontSize: '11px', padding: '4px 14px', borderRadius: '999px',
              background: `${ac}10`, color: ac, border: `1px solid ${ac}20`,
            }}>
              {METHOD_OPTIONS.find(m => m.id === result.method)?.icon}{' '}
              {METHOD_OPTIONS.find(m => m.id === result.method)?.label}
            </span>
            {question && (
              <span style={{ fontSize: '11px', color: 'var(--tx-3)', fontStyle: 'italic' }}>
                「{question}」
              </span>
            )}
          </div>

          {/* Hexagram displays */}
          <HexagramDisplay hexagram={result.hexagram} label="本卦" />

          {/* Inner hexagram note */}
          <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--tx-3)' }}>
            互卦：{result.inner.composition}（第{result.innerNumber}卦 · {result.inner.name}）
          </div>

          {result.hasChanging && (
            <>
              <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--tx-3)' }}>
                <span style={{ color: '#ff6b6b', fontWeight: 600 }}>✦ 动爻：{result.changingPosition}爻</span>
                <span style={{ margin: '0 8px' }}>→</span>
                <span style={{ color: ac, fontWeight: 600 }}>变卦</span>
              </div>
              <HexagramDisplay hexagram={result.changed} label="变卦" />
            </>
          )}

          {/* AI Interpretation */}
          <div style={{
            background: 'var(--bg-card)', borderRadius: '12px',
            border: `1px solid var(--bdr)`, overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 18px', borderBottom: '1px solid var(--bdr)',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--tx-0)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ac} strokeWidth="2" strokeLinecap="round">
                  <circle cx="7" cy="12" r="5" />
                  <circle cx="17" cy="12" r="5" />
                  <path d="M2 12h3m14 0h3" />
                </svg>
                AI 解卦
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {aiLoading && (
                  <span style={{ fontSize: '11px', color: 'var(--tx-3)' }}>
                    解卦中<span className="loading-dots">...</span>
                  </span>
                )}
                {aiText && !aiLoading && (
                  <button
                    onClick={() => { setAiText(''); setTimeout(handleAiInterpret, 50); }}
                    style={{
                      padding: '6px 16px', cursor: 'pointer',
                      background: 'none', border: `1px solid ${ac}`,
                      borderRadius: '999px', fontSize: '11px', color: ac,
                    }}
                  >
                    重新解卦
                  </button>
                )}
                {!aiText && !aiLoading && (
                  <button
                    onClick={handleAiInterpret}
                    style={{
                      padding: '6px 16px', cursor: 'pointer',
                      background: ac, color: '#fff', border: 'none',
                      borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                    }}
                  >
                    开始解卦
                  </button>
                )}
              </div>
            </div>
              {aiText && (
              <div style={{ padding: '14px 18px' }}>
                <MarkdownRenderer text={aiText} />
              </div>
            )}
            {!aiText && !aiLoading && (
              <div style={{ padding: '20px 18px', textAlign: 'center', fontSize: '12px', color: 'var(--tx-3)' }}>
                点击「开始解卦」，AI 将为你解读卦象含义
              </div>
            )}
          </div>

          {/* Restart */}
          <div className="text-center pt-2">
            <button
              onClick={reset}
              style={{
                padding: '10px 28px', cursor: 'pointer',
                background: ac, color: '#fff', border: 'none',
                borderRadius: '999px', fontSize: '13px', fontWeight: 600,
              }}
            >
              🔄 再占一次
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInYao {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .loading-dots::after {
          content: '';
          animation: dots 1.2s steps(3, end) infinite;
          display: inline-block;
          width: 12px;
          text-align: left;
        }
        @keyframes dots {
          0%   { content: ''; }
          25%  { content: '.'; }
          50%  { content: '..'; }
          75%  { content: '...'; }
          100% { content: ''; }
        }
      `}</style>
    </div>
  );
}
