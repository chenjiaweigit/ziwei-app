'use client';

import Link from 'next/link';
import { useState, useCallback, useRef } from 'react';
import { TIANJI_MODULES, coinDivination, numberDivination, timeDivination, buildResult } from '@/lib/nihai';
import type { DivinationResult, YaoLine } from '@/lib/nihai';
import { useDivinationHistory, type DivinationHistoryEntry } from '@/lib/nihai/divination-history';
import HexagramDisplay from '@/components/tianji/HexagramDisplay';
import LiuqinPanel from '@/components/tianji/LiuqinPanel';
import CoinToss from '@/components/tianji/CoinToss';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const ac = '#d4a843';

const DIVINE_CSS = "@keyframes fadeInYao{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}.loading-dots::after{content:'.';animation:dots 1.2s steps(3,end) infinite;display:inline-block;width:12px;text-align:left;visibility:hidden}@keyframes dots{0%{visibility:hidden}25%{visibility:visible}50%{visibility:visible}75%{visibility:visible}100%{visibility:hidden}}";

const METHOD_OPTIONS: { id: string; icon: string; label: string; desc: string }[] = [
  { id: 'coin', icon: '💰', label: '金钱卦', desc: '三枚硬币掷六次，传统起卦法' },
  { id: 'number', icon: '🔢', label: '数字卦', desc: '输入三个数字快速起卦' },
  { id: 'time', icon: '⏰', label: '时间卦', desc: '以当前时间自动起卦' },
];

export default function YijingDivinePage() {
  const [method, setMethod] = useState<string | null>(null);
  const [coinMode, setCoinMode] = useState<'auto' | 'manual'>('auto');
  const [step, setStep] = useState(0);
  const [tosses, setTosses] = useState<YaoLine[]>([]);
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [question, setQuestion] = useState('');
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [num3, setNum3] = useState('');
  const [manualCoins, setManualCoins] = useState<boolean[][]>(
    Array.from({ length: 6 }, () => [false, false, false])
  );
  const [wasManual, setWasManual] = useState(false);
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const currentHistoryId = useRef<string | null>(null);
  const questionRef = useRef(question);
  questionRef.current = question;
  const aiAccumRef = useRef('');
  const { history, save, updateAI, remove } = useDivinationHistory();

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMethod(null);
    setCoinMode('auto');
    setStep(0);
    setTosses([]);
    setResult(null);
    setQuestion('');
    setAiText('');
    setAiLoading(false);
    setNum1('');
    setNum2('');
    setNum3('');
    setManualCoins(Array.from({ length: 6 }, () => [false, false, false]));
    setWasManual(false);
    currentHistoryId.current = null;
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
      const label = `${r.hexagram.composition} · 金钱卦`;
      currentHistoryId.current = save({ method: 'coin', question: questionRef.current, result: r, aiText: '', label });
    }
  }, [step, tosses, save]);

  const doNumberDivination = useCallback(() => {
    const a = parseInt(num1) || Math.floor(Math.random() * 8) + 1;
    const b = parseInt(num2) || Math.floor(Math.random() * 8) + 1;
    const c = parseInt(num3) || Math.floor(Math.random() * 6) + 1;
    const lines = numberDivination(a, b, c);
    setTosses(lines);
    setStep(6);
    const r = buildResult(lines, 'number');
    setResult(r);
    const label = `${r.hexagram.composition} · 数字卦`;
    currentHistoryId.current = save({ method: 'number', question: questionRef.current, result: r, aiText: '', label });
  }, [num1, num2, num3, save]);

  const doTimeDivination = useCallback(() => {
    const lines = timeDivination();
    setTosses(lines);
    setStep(6);
    const r = buildResult(lines, 'time');
    setResult(r);
    const label = `${r.hexagram.composition} · 时间卦`;
    currentHistoryId.current = save({ method: 'time', question: questionRef.current, result: r, aiText: '', label });
  }, [save]);

  const handleManualSubmit = useCallback(() => {
    const headsCounts = manualCoins.map(row => row.filter(Boolean).length);
    const posLabels = ['初', '二', '三', '四', '五', '上'];
    const lines: YaoLine[] = headsCounts.map((heads, i) => {
      const value = heads === 0 ? 6 : heads === 1 ? 7 : heads === 2 ? 8 : 9;
      return {
        position: i + 1,
        value,
        yin: value % 2 === 0,
        changing: value === 6 || value === 9,
        label: `${posLabels[i]}${value % 2 === 0 ? '六' : '九'}`,
      };
    });
    setTosses(lines);
    setStep(6);
    setWasManual(true);
    const r = buildResult(lines, 'coin');
    setResult(r);
    const label = `${r.hexagram.composition} · 金钱卦·手动`;
    currentHistoryId.current = save({ method: 'coin', question: questionRef.current, result: r, aiText: '', label });
  }, [manualCoins, save]);

  const loadFromHistory = useCallback((entry: DivinationHistoryEntry) => {
    setMethod(entry.method);
    setResult(entry.result);
    setQuestion(entry.question);
    setAiText(entry.aiText);
    setTosses(entry.result.lines);
    setStep(6);
    currentHistoryId.current = entry.id;
  }, []);

  const handleAiInterpret = useCallback(async () => {
    if (!result) return;
    setAiLoading(true);
    setAiText('');
    aiAccumRef.current = '';

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
            if (parsed.text) {
              aiAccumRef.current += parsed.text;
              setAiText(aiAccumRef.current);
            }
            if (parsed.error) setAiText(parsed.error);
          } catch { /* ignore parse errors */ }
        }
      }

      if (currentHistoryId.current && aiAccumRef.current) {
        updateAI(currentHistoryId.current, aiAccumRef.current);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setAiText('AI 解卦失败，请重试');
      }
    }
    setAiLoading(false);
  }, [result, question, save, updateAI]);

  function renderYaoBar(line: YaoLine) {
    const ac2 = '#ff6b6b';
    const color = line.changing ? ac2 : 'var(--tx-0)';

    const yinSegment = (key: string) => (
      <div key={key} style={{
        width: 'calc(50% - 3px)', height: '3px', borderRadius: '1px', background: color,
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

      {/* Method selection + history */}
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

          {/* History */}
          {history.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', letterSpacing: '0.4em', color: 'var(--tx-3)' }}>历史记录</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--bdr)' }} />
              </div>
              <div className="space-y-2">
                {history.slice(0, 15).map(entry => (
                  <button
                    key={entry.id}
                    onClick={() => loadFromHistory(entry)}
                    style={{
                      width: '100%', cursor: 'pointer', textAlign: 'left',
                      background: 'var(--bg-card)', border: '1px solid var(--bdr)',
                      borderRadius: '10px', padding: '12px 16px',
                      display: 'flex', alignItems: 'center', gap: '12px',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = ac; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--bdr)'; }}
                  >
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>
                      {entry.method === 'coin' ? '💰' : entry.method === 'number' ? '🔢' : entry.method === 'time' ? '⏰' : '💰'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--tx-0)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {entry.label}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--tx-3)', marginTop: '2px' }}>
                        {entry.question && `「${entry.question}」· `}
                        {new Date(entry.savedAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); remove(entry.id); }}
                      style={{
                        flexShrink: 0, fontSize: '14px', color: 'var(--tx-3)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        opacity: 0.4, transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.4'; }}
                    >
                      ×
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Coin section: auto or manual */}
      {method === 'coin' && !result && (
        <div className="max-w-lg mx-auto px-6 pb-20">
          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '4px', marginBottom: '16px',
            background: 'var(--bg-card)', borderRadius: '12px',
            border: '1px solid var(--bdr)', padding: '4px',
          }}>
            {[
              { id: 'auto', icon: '🎲', label: '自动起卦' },
              { id: 'manual', icon: '✋', label: '手动起卦' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setCoinMode(tab.id as 'auto' | 'manual');
                  setStep(0);
                  setTosses([]);
                  setManualCoins(Array.from({ length: 6 }, () => [false, false, false]));
                  setWasManual(false);
                }}
                style={{
                  flex: 1, padding: '10px 0', cursor: 'pointer', textAlign: 'center',
                  fontSize: '13px', fontWeight: 600, border: 'none', borderRadius: '10px',
                  background: coinMode === tab.id ? ac : 'transparent',
                  color: coinMode === tab.id ? '#fff' : 'var(--tx-3)',
                  transition: 'all 0.2s',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {coinMode === 'auto' && (
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
          )}

          {coinMode === 'manual' && (
            <div style={{
              background: 'var(--bg-card)', borderRadius: '12px',
              border: '1px solid var(--bdr)', padding: '20px',
            }}>
              <div style={{
                fontSize: '11px', color: 'var(--tx-3)', textAlign: 'center',
                lineHeight: 1.6, marginBottom: '16px', padding: '10px 14px',
                background: `${ac}06`, borderRadius: '8px',
              }}>
                拿出三枚真铜钱，每爻掷一次，点击下方硬币切换<b>正</b>/<b>反</b>面记录结果，六爻填毕点击「成卦」。
                <br />
                <span style={{ color: ac, fontSize: '10px' }}>
                  三正=老阳(9)·变爻 | 两正=少阴(8) | 一正=少阳(7) | 三反=老阴(6)·变爻
                </span>
              </div>

              {manualCoins.map((row, rowIdx) => {
                const heads = row.filter(Boolean).length;
                const value = heads === 0 ? 6 : heads === 1 ? 7 : heads === 2 ? 8 : 9;
                const posLabels = ['初', '二', '三', '四', '五', '上'];
                const typeLabels = ['老阴(6)', '少阳(7)', '少阴(8)', '老阳(9)'];
                return (
                  <div key={rowIdx} style={{
                    display: 'flex', alignItems: 'center',
                    padding: '6px 8px', marginBottom: '4px',
                    borderRadius: '8px', background: 'var(--bg-page)',
                    gap: '8px',
                  }}>
                    <span style={{
                      fontSize: '12px', fontWeight: 600, color: 'var(--tx-2)',
                      width: '22px', textAlign: 'right',
                    }}>
                      {posLabels[rowIdx]}
                    </span>
                    {/* Yao icon */}
                    <div style={{
                      width: '24px', height: '14px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {value % 2 === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', width: '100%' }}>
                          <div style={{ flex: 1, height: '2px', borderRadius: '1px', background: value === 6 ? '#ff6b6b' : 'var(--tx-2)' }} />
                          <div style={{ width: '3px', flexShrink: 0 }} />
                          <div style={{ flex: 1, height: '2px', borderRadius: '1px', background: value === 6 ? '#ff6b6b' : 'var(--tx-2)' }} />
                        </div>
                      ) : (
                        <div style={{ width: '100%', height: '2px', borderRadius: '1px', background: value === 9 ? '#ff6b6b' : 'var(--tx-2)' }} />
                      )}
                    </div>
                    {[0, 1, 2].map(coinIdx => (
                      <button
                        key={coinIdx}
                        onClick={() => {
                          const next = manualCoins.map(r => [...r]);
                          next[rowIdx][coinIdx] = !next[rowIdx][coinIdx];
                          setManualCoins(next);
                        }}
                        style={{
                          width: '36px', height: '36px', cursor: 'pointer',
                          borderRadius: '50%', border: 'none',
                          fontSize: '16px', fontWeight: 700,
                          background: row[coinIdx] ? '#d4a843' : '#8a9bb5',
                          color: '#fff',
                          transition: 'all 0.15s',
                        }}
                      >
                        {row[coinIdx] ? '正' : '反'}
                      </button>
                    ))}
                    <span style={{
                      fontSize: '11px', padding: '2px 8px', borderRadius: '999px',
                      color: value === 6 || value === 9 ? '#ff6b6b' : 'var(--tx-2)',
                      background: value === 6 || value === 9 ? '#ff6b6b15' : 'transparent',
                      fontWeight: value === 6 || value === 9 ? 600 : 400,
                      whiteSpace: 'nowrap',
                    }}>
                      {heads === 0 ? '三反' : heads === 1 ? '一正二反' : heads === 2 ? '二正一反' : '三正'}
                      {' · '}{typeLabels[heads]}
                    </span>
                  </div>
                );
              })}

              <div className="flex justify-center gap-3" style={{ marginTop: '16px' }}>
                <button
                  onClick={handleManualSubmit}
                  style={{
                    padding: '10px 28px', cursor: 'pointer',
                    background: ac, color: '#fff', border: 'none',
                    borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                  }}
                >
                  ✋ 成卦
                </button>
                <button
                  onClick={reset}
                  style={{
                    padding: '10px 28px', cursor: 'pointer',
                    background: 'none', border: '1px solid var(--bdr)',
                    borderRadius: '999px', fontSize: '13px', color: 'var(--tx-3)',
                  }}
                >
                  重新选择起卦方式
                </button>
              </div>
            </div>
          )}
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
              {result.method === 'coin' ? '💰' : result.method === 'number' ? '🔢' : '⏰'}{' '}
              {result.method === 'number' ? '数字卦' : result.method === 'time' ? '时间卦' : (wasManual ? '金钱卦·手动' : '金钱卦')}
            </span>
            {question && (
              <span style={{ fontSize: '11px', color: 'var(--tx-3)', fontStyle: 'italic' }}>
                「{question}」
              </span>
            )}
          </div>

          {/* Hexagram displays */}
          <HexagramDisplay hexagram={result.hexagram} label="本卦" />
          <LiuqinPanel hexagram={result.hexagram} label="六神·六亲·纳甲" />

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
              <LiuqinPanel hexagram={result.changed} label="变卦·六神·六亲·纳甲" />
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

      <style>{DIVINE_CSS}</style>

      </div>
    </div>
  );
}
