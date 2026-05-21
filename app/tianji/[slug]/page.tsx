import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TIANJI_MODULES, HEXAGRAMS, FENGSHUI_ENTRIES } from '@/lib/nihai';

const STATUS_LABEL: Record<string, string> = {
  active: '已上线',
  preview: '预览中',
  coming: '即将开放',
};

const STATUS_COLOR: Record<string, string> = {
  active: '#10b981',
  preview: '#d4a843',
  coming: '#9db0d0',
};

export function generateStaticParams() {
  return TIANJI_MODULES.map(mod => ({ slug: mod.slug }));
}

export default async function TianjiModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = TIANJI_MODULES.find(m => m.slug === slug);
  if (!mod) notFound();

  const ac = '#d4a843';

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto px-6 pt-4">
        <Link href="/tianji" style={{
          fontSize: '12px', color: 'var(--tx-3)',
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          textDecoration: 'none',
        }}>
          ← 返回天纪
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <span style={{ fontSize: '36px' }}>{mod.icon}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--tx-0)' }}>{mod.name}</h1>
              <span style={{
                fontSize: '10px', padding: '1px 8px', borderRadius: '999px',
                color: STATUS_COLOR[mod.status],
                background: `${STATUS_COLOR[mod.status]}15`,
                border: `1px solid ${STATUS_COLOR[mod.status]}30`,
              }}>
                {STATUS_LABEL[mod.status]}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: ac, letterSpacing: '0.1em' }}>
              {mod.nameEn} · {mod.subtitle}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 1.8, marginBottom: '16px' }}>
          {mod.description}
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          {mod.school && (
            <span style={{ color: 'var(--tx-3)' }}>
              学派：<span style={{ color: 'var(--tx-1)' }}>{mod.school}</span>
            </span>
          )}
          {mod.lessons && (
            <span style={{ color: 'var(--tx-3)' }}>
              课时：<span style={{ color: 'var(--tx-1)' }}>{mod.lessons}</span>
            </span>
          )}
        </div>

        {mod.references.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--tx-3)' }}>参考书目：</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {mod.references.map(ref => (
                <span key={ref} style={{
                  fontSize: '11px', padding: '2px 10px',
                  background: `${ac}10`, border: `1px solid ${ac}20`,
                  borderRadius: '999px', color: 'var(--tx-2)',
                }}>
                  {ref}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {mod.details.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <div style={{
            background: 'var(--bg-card)', borderRadius: '12px',
            border: `1px solid ${ac}15`, padding: '20px 24px',
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '12px' }}>
              详细介绍
            </h2>
            <div className="space-y-3">
              {mod.details.map((d, i) => (
                <p key={i} style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.8 }}>{d}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {mod.chapters.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-8">
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '12px', paddingLeft: '4px' }}>
            章节 · {mod.chapters.length}
          </h2>
          <div className="space-y-3">
            {mod.chapters.map(ch => (
              <div key={ch.id} style={{
                background: 'var(--bg-card)', borderRadius: '12px',
                border: `1px solid var(--bdr)`, padding: '16px 20px',
              }}>
                <div className="flex items-start gap-3 mb-2">
                  <span style={{
                    fontSize: '10px', fontWeight: 600, color: ac,
                    background: `${ac}12`, borderRadius: '6px',
                    padding: '2px 8px', flexShrink: 0, marginTop: '2px',
                  }}>
                    {ch.order}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--tx-0)' }}>{ch.title}</h3>
                    {ch.subtitle && (
                      <div style={{ fontSize: '11px', color: ac, letterSpacing: '0.05em', marginTop: '2px' }}>
                        {ch.subtitle}
                      </div>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '10px', marginLeft: '28px' }}>
                  {ch.description}
                </p>
                {ch.keyPoints.length > 0 && (
                  <div className="flex flex-wrap gap-1.5" style={{ marginLeft: '28px' }}>
                    {ch.keyPoints.map((kp, i) => (
                      <span key={i} style={{
                        fontSize: '11px', padding: '3px 10px',
                        background: 'rgba(184,146,42,0.06)',
                        border: '1px solid rgba(184,146,42,0.12)',
                        borderRadius: '999px', color: 'var(--tx-2)',
                      }}>
                        {kp}
                      </span>
                    ))}
                  </div>
                )}
                {ch.quotes && ch.quotes.length > 0 && (
                  <div style={{ marginTop: '10px', marginLeft: '28px', padding: '8px 14px', background: `${ac}08`, borderRadius: '8px', borderLeft: `2px solid ${ac}` }}>
                    <div style={{ fontSize: '10px', color: ac, marginBottom: '4px', letterSpacing: '0.1em' }}>倪师原话</div>
                    {ch.quotes.map((q, i) => (
                      <p key={i} style={{ fontSize: '12px', color: 'var(--tx-2)', fontStyle: 'italic', lineHeight: 1.6 }}>
                        「{q}」
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {mod.slug === 'yijing' && (
        <div className="max-w-3xl mx-auto px-6 pb-8">
          {/* Divination entry */}
          <div style={{
            background: `linear-gradient(135deg, ${ac}10, ${ac}05)`,
            borderRadius: '12px', border: `1px solid ${ac}25`,
            padding: '20px 24px', marginBottom: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎲</div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--tx-0)', marginBottom: '6px' }}>
              易经占卜 · 起卦
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '14px' }}>
              默念所问之事，选择起卦方式<br />
              金钱卦 · 数字卦 · 时间卦
            </p>
            <Link href="/tianji/yijing/divine" style={{
              display: 'inline-block', padding: '10px 28px',
              background: ac, color: '#fff', borderRadius: '999px',
              fontSize: '13px', fontWeight: 600, textDecoration: 'none',
            }}>
              开始起卦 →
            </Link>
          </div>

          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '12px', paddingLeft: '4px' }}>
            六十四卦 · {HEXAGRAMS.length}
          </h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '8px',
          }}>
            {HEXAGRAMS.map(h => (
              <details key={h.number} style={{
                background: 'var(--bg-card)', borderRadius: '10px',
                border: '1px solid var(--bdr)',
              }}>
                <summary style={{
                  padding: '10px 12px', cursor: 'pointer', userSelect: 'none',
                  fontSize: '13px', fontWeight: 600, color: 'var(--tx-0)',
                  listStyle: 'inside',
                }}>
                  <span style={{ color: ac }}>{h.number}.</span> {h.name}
                  <span style={{ fontSize: '10px', color: 'var(--tx-3)', marginLeft: '6px' }}>
                    {h.composition}
                  </span>
                </summary>
                <div style={{ padding: '0 12px 12px', borderTop: '1px solid var(--bdr)', marginTop: '6px', paddingTop: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--tx-3)', marginBottom: '4px' }}>
                    {h.upper} ⊙ {h.lower}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--tx-2)', lineHeight: 1.6, marginBottom: '6px' }}>
                    {h.meaning}
                  </div>
                  <div style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '4px' }}>
                    <span style={{ color: ac }}>倪师解：</span>
                    <span style={{ color: 'var(--tx-2)' }}>{h.niInterpretation}</span>
                  </div>
                  <div style={{ fontSize: '11px', lineHeight: 1.6 }}>
                    <span style={{ color: ac }}>断辞：</span>
                    <span style={{ color: 'var(--tx-2)' }}>{h.divination}</span>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {mod.slug === 'kanyu' && (
        <div className="max-w-3xl mx-auto px-6 pb-8">
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '12px', paddingLeft: '4px' }}>
            核心概念 · {FENGSHUI_ENTRIES.length}
          </h2>
          <div className="space-y-3">
            {FENGSHUI_ENTRIES.map(entry => {
              const catColor = entry.category === 'yangzhai' ? '#d4a843' : entry.category === 'yinzhai' ? '#5a7a9a' : '#7a8a6a';
              const catLabel = entry.category === 'yangzhai' ? '阳宅' : entry.category === 'yinzhai' ? '阴宅' : '理论';
              return (
                <div key={entry.id} style={{
                  background: 'var(--bg-card)', borderRadius: '12px',
                  border: '1px solid var(--bdr)', padding: '16px 20px',
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{
                      fontSize: '10px', padding: '2px 8px', borderRadius: '999px',
                      background: `${catColor}15`, color: catColor,
                      border: `1px solid ${catColor}30`,
                    }}>
                      {catLabel}
                    </span>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--tx-0)' }}>
                      {entry.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '8px' }}>
                    {entry.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.keyPoints.map((kp, i) => (
                      <span key={i} style={{
                        fontSize: '11px', padding: '3px 10px',
                        background: `${catColor}08`,
                        border: `1px solid ${catColor}15`,
                        borderRadius: '999px', color: 'var(--tx-2)',
                      }}>
                        {kp}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mod.keywords.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-16">
          <div style={{
            fontSize: '11px', color: 'var(--tx-3)', textAlign: 'center',
            padding: '12px', borderTop: '1px solid var(--bdr)',
          }}>
            相关概念：{mod.keywords.join(' · ')}
          </div>
        </div>
      )}
    </div>
  );
}
